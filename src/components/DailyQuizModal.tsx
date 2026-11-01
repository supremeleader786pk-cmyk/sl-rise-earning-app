import React, { useState } from 'react';
import { X, Award, HelpCircle, CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import type { QuizQuestion } from '../types';

interface DailyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (amount: number, description: string) => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'In Islamic Finance, what does the term "Riba" strictly refer to?',
    options: [
      'Unjustified interest or usury charged on borrowed capital',
      'Honest business profit from physical trade',
      'Charity given to orphans (Sadaqah)',
      'A mutual agreement of partnership (Musharakah)'
    ],
    correctIndex: 0,
    explanation: 'Riba is the unjustified surplus or interest forbidden in the Quran. Wealth must grow through productive service or ethical trade, not debt-interest.'
  },
  {
    id: 2,
    question: 'What is the Islamic contract called where compensation is given for completing a specific task or job?',
    options: [
      'Ju\'ala (Ujrah / Service Wage)',
      'Maysir (Gambling)',
      'Gharar (Extreme deception)',
      'Qimar (Betting)'
    ],
    correctIndex: 0,
    explanation: 'Ju\'ala is a valid Islamic contract where a principal promises a set reward or fee to anyone who completes a defined beneficial task.'
  },
  {
    id: 3,
    question: 'Why are lottery tickets and paid spin-wheels considered non-Halal (Haram)?',
    options: [
      'Because they involve Maysir (gambling where people lose their stakes for chance)',
      'Because they take too long to complete',
      'Because they are only digital',
      'Because banks charge high taxes on them'
    ],
    correctIndex: 0,
    explanation: 'Maysir involves risking money where one person gains solely at the financial loss of others without exchanging genuine work or value.'
  },
  {
    id: 4,
    question: 'Under Shariah guidelines, is earning a transparent affiliate commission (Simsarah) permissible?',
    options: [
      'Yes, permissible when promoting genuine services without taking from the user’s wage',
      'No, all referral programs are strictly forbidden',
      'Only permissible if the company is based in Europe',
      'Permissible only during Friday afternoons'
    ],
    correctIndex: 0,
    explanation: 'Affiliate referral brokerage (Simsarah) is halal when the promoted service is ethical and the referrer fee is borne transparently by the business.'
  },
  {
    id: 5,
    question: 'What is the golden principle of ethical Islamic earning taught by the Prophet Muhammad (PBUH)?',
    options: [
      '"Earning a lawful livelihood is an obligation after the religious duties"',
      'Try to get rich overnight by taking huge reckless risks',
      'Never help friends earn their living',
      'Only earn by borrowing money'
    ],
    correctIndex: 0,
    explanation: 'The Prophet (PBUH) taught that seeking Halal earning through one\'s own labor and honest service is a sacred duty.'
  }
];

export const DailyQuizModal: React.FC<DailyQuizModalProps> = ({ isOpen, onClose, onReward }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleClaimReward = () => {
    const rewardAmount = score >= 3 ? 50 : 20;
    onReward(rewardAmount, `Completed Daily Islamic & Halal Finance Quiz (Score: ${score}/5)`);
    onClose();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121217] border border-amber-500/30 rounded-3xl p-5 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Daily Halal & Ethics Quiz</h3>
              <p className="text-[11px] text-amber-400/80 font-medium">Earn Rs. 50 for passing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isFinished ? (
          <div className="mt-4 space-y-4">
            {/* Progress and Question Counter */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="font-semibold text-amber-400">Score: {score}</span>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-[#17171e] border border-zinc-800">
              <h4 className="text-sm font-semibold leading-relaxed text-zinc-100">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                let btnStyle = 'bg-[#181820] border-zinc-800 text-zinc-300 hover:border-amber-500/50';
                if (showExplanation) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition flex items-start gap-2.5 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] shrink-0 font-bold text-amber-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                    {showExplanation && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {showExplanation && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {showExplanation && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                <span className="font-bold text-amber-400 block mb-0.5">Shariah Explanation:</span>
                {currentQ.explanation}
              </div>
            )}

            {/* Next Button */}
            {showExplanation && (
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl gold-gradient text-black font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
              >
                <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Award className="w-10 h-10 text-amber-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold">Quiz Completed!</h3>
              <p className="text-xs text-zinc-400 mt-1">You answered {score} out of {QUIZ_QUESTIONS.length} correctly.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#17171e] border border-zinc-800 space-y-2">
              <div className="text-xs text-zinc-400">Earning Reward Status:</div>
              <div className="text-2xl font-black text-amber-400">
                +Rs. {score >= 3 ? 50 : 20} PKR
              </div>
              <p className="text-[11px] text-zinc-500">
                {score >= 3
                  ? 'Mabrook! You passed the Halal Knowledge evaluation test.'
                  : 'Good effort! Participation reward credited.'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={handleClaimReward}
                className="flex-1 py-3 rounded-xl gold-gradient text-black font-bold text-xs active:scale-95 transition shadow-lg shadow-amber-500/20"
              >
                Claim Cash Bonus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
