import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const TakeAssessmentPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await api.get(`/Assessments/${id}`);
        setAssessment(res.data);

        let parsedQuestions = [];
        try {
          parsedQuestions = res.data.questions ? JSON.parse(res.data.questions) : [];
          if (!Array.isArray(parsedQuestions)) throw new Error();
        } catch {
          console.warn('Invalid questions format from API');
          parsedQuestions = [];
        }

        setQuestions(parsedQuestions);
      } catch (err) {
        console.error('Failed to load assessment or parse questions', err);
        setQuestions([]);
      }
    };

    fetchAssessment();
  }, [id]);

  const handleOptionSelect = (qIndex, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const calculatedScore = Math.round((correct / questions.length) * assessment.maxScore);
    setScore(calculatedScore);
    setSubmitted(true);

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      await api.post('/Results', {
        assessmentId: assessment.assessmentId,
        userId: localStorage.getItem('userId'),
        score: calculatedScore,
        attemptDate: new Date().toISOString(),
        timeTaken,
      });
    } catch (err) {
      console.error('Failed to submit result', err);
    }
  };

  if (!assessment) return <p className="p-6 text-slate-500">Loading assessment...</p>;

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6 text-center">
        {assessment.title}
      </h2>

      {submitted && (
        <motion.div
          className="text-center bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md mb-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="text-xl text-green-600 dark:text-green-400 font-semibold mb-2">
            🎉 You scored <strong>{score}</strong> / {assessment.maxScore}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            ⏱️ Time Taken: {Math.floor((Date.now() - startTime) / 1000)} seconds
          </p>
          <button
            onClick={() => navigate('/student/results')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg transition"
          >
            View My Results
          </button>
        </motion.div>
      )}

      <motion.form
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {questions.map((q, index) => {
          const selected = answers[index];
          const isCorrect = selected === q.correctAnswer;

          return (
            <motion.div
              key={index}
              className={`p-5 rounded-xl shadow border transition ${
                submitted
                  ? isCorrect
                    ? 'bg-green-50 border-green-300 dark:bg-green-900 dark:border-green-700'
                    : 'bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700'
                  : 'bg-white border-purple-200 dark:bg-slate-800 dark:border-slate-700'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">
                Q{index + 1}. {q.questionText}
              </h3>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-center gap-2 text-sm cursor-pointer ${
                      submitted && option === q.correctAnswer
                        ? 'text-green-700 dark:text-green-300'
                        : submitted && option === selected && option !== q.correctAnswer
                        ? 'text-red-600 dark:text-red-300'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      disabled={submitted}
                      checked={selected === option}
                      onChange={() => handleOptionSelect(index, option)}
                      className="accent-indigo-600"
                    />
                    {option}
                  </label>
                ))}
              </div>

              {submitted && selected !== q.correctAnswer && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Correct Answer: <strong>{q.correctAnswer}</strong>
                </p>
              )}
            </motion.div>
          );
        })}
      </motion.form>

      {!submitted && questions.length > 0 && (
        <button
          onClick={handleSubmit}
          className="mt-8 block mx-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
        >
          Submit Assessment
        </button>
      )}
    </motion.div>
  );
};

export default TakeAssessmentPage;
