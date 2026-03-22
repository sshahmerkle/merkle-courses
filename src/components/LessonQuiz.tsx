import { useEffect, useState } from 'react';
import { QuizQuestion } from '@/types';

export default function LessonQuiz({ questions, storageKey }: { questions: QuizQuestion[]; storageKey: string }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`quiz-${storageKey}`);
      if (saved) {
        const { answers: a, submitted: s } = JSON.parse(saved);
        setAnswers(a ?? {});
        setSubmitted(s ?? false);
      }
    } catch {}
  }, [storageKey]);

  // Persist state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(`quiz-${storageKey}`, JSON.stringify({ answers, submitted }));
    } catch {}
  }, [answers, submitted, storageKey]);

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.answer).length
    : 0;
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="mt-12 pt-8 border-t border-brand-gray-light dark:border-dm-border no-print">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Knowledge Check</h2>
      </div>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Test your understanding before moving on</p>

      <div className="space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isCorrect = submitted && chosen === q.answer;
          const isWrong = submitted && chosen !== undefined && chosen !== q.answer;

          return (
            <div
              key={qi}
              className={`p-5 rounded-xl border transition-colors ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/20'
                    : isWrong
                      ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20'
                      : 'border-brand-gray-light bg-gray-50/50 dark:border-dm-border dark:bg-dm-raised/50'
                  : 'border-brand-gray-light bg-white dark:border-dm-border dark:bg-dm-surface'
              }`}
            >
              <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3">
                <span className="text-brand-muted font-normal mr-1.5">Q{qi + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrectAnswer = oi === q.answer;

                  let cls = 'quiz-option';
                  if (submitted) {
                    if (isCorrectAnswer) cls += ' quiz-option-correct';
                    else if (isChosen) cls += ' quiz-option-incorrect';
                    else cls += ' quiz-option-neutral';
                  } else if (isChosen) {
                    cls += ' quiz-option-selected';
                  }

                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => !submitted && setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={cls}
                    >
                      <span className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors">
                        {submitted && isCorrectAnswer ? '✓' : submitted && isChosen ? '✗' : String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && q.explanation && (
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-dm-raised border border-brand-gray-light dark:border-dm-border rounded-lg px-3 py-2 leading-relaxed">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Explanation: </span>
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check Answers
        </button>
      ) : (
        <div className="mt-6 flex items-center gap-4">
          <div className={`px-5 py-2.5 rounded-xl text-sm font-bold ${
            score === questions.length
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : score >= questions.length / 2
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {score === questions.length ? '🎉' : score >= questions.length / 2 ? '👍' : '📚'}{' '}
            {score} / {questions.length} correct
          </div>
          <button
            onClick={reset}
            className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
