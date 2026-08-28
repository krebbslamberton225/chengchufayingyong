import React, { useState, useEffect, useCallback } from 'react';
import { DifficultyLevel, MathOperation, Question, UserStats } from '../types';
import { generateQuestion } from '../utils/mathGenerator';
import { sound } from '../utils/audio';
import { CAPY_CHEERS } from '../utils/capyConstants';
import confetti from 'canvas-confetti';
import { CapybaraMascot } from './CapybaraMascot';
import { ConfidenceMeter } from './ConfidenceMeter';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  Delete,
  Heart,
  Sparkles,
} from 'lucide-react';

interface PracticeQuizProps {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({ userStats, setUserStats }) => {
  const [level, setLevel] = useState<DifficultyLevel>('easy');
  const [operation, setOperation] = useState<MathOperation>('both');
  const [inputMode, setInputMode] = useState<'choice' | 'keypad'>('choice');

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [typedInput, setTypedInput] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [capyBubble, setCapyBubble] = useState<string>('看图数一数，像水豚一样从容答题～🐾');

  // Generate next question
  const nextQuestion = useCallback(() => {
    const q = generateQuestion(level, operation);
    setCurrentQuestion(q);
    setTypedInput('');
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setCapyBubble('仔细观察盘子里的物品，你一定算得出来！🍊');
  }, [level, operation]);

  // Initial load or level/operation change
  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  // Read question aloud
  const handleReadQuestion = () => {
    if (!currentQuestion) return;
    let textToSpeak = '';
    if (currentQuestion.type === 'multiply') {
      textToSpeak = `看图算乘法：有 ${currentQuestion.num1} 盘${currentQuestion.theme.name}，每盘有 ${currentQuestion.num2} 个，一共有多少个呢？${currentQuestion.num1}乘${currentQuestion.num2}等于几？`;
    } else {
      textToSpeak = `看图算除法：把 ${currentQuestion.num1} 个${currentQuestion.theme.name}平均分到 ${currentQuestion.num2} 个盘子里，每个盘子分几个呢？${currentQuestion.num1}除以${currentQuestion.num2}等于几？`;
    }
    sound.speak(textToSpeak);
  };

  // Submit Answer
  const handleCheckAnswer = (answerGiven: number) => {
    if (isAnswered || !currentQuestion) return;

    setIsAnswered(true);
    const correct = answerGiven === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#10B981', '#F97316', '#EC4899', '#8B5CF6'],
      });

      const newStreak = userStats.currentStreak + 1;
      const starsEarned = newStreak % 5 === 0 ? 2 : 1; // Bonus for 5x streak
      const randomCheer = CAPY_CHEERS.correct[Math.floor(Math.random() * CAPY_CHEERS.correct.length)];
      setCapyBubble(randomCheer);

      setUserStats((prev) => {
        const newScore = Math.min(100, (prev.confidenceScore || 0) + 10);
        return {
          ...prev,
          stars: prev.stars + starsEarned,
          totalAnswered: prev.totalAnswered + 1,
          correctAnswered: prev.correctAnswered + 1,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          confidenceScore: newScore,
        };
      });

      sound.speak(randomCheer);
    } else {
      sound.playRetry();
      setShowHint(true);
      const randomEncourage = CAPY_CHEERS.encourage[Math.floor(Math.random() * CAPY_CHEERS.encourage.length)];
      setCapyBubble(randomEncourage);
      sound.speak(randomEncourage);

      setUserStats((prev) => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        currentStreak: 0,
        confidenceScore: Math.max(10, (prev.confidenceScore || 0) + 2), // Boost confidence even on effort!
        mistakes: prev.mistakes.some((m) => m.id === currentQuestion.id)
          ? prev.mistakes
          : [...prev.mistakes, currentQuestion],
      }));
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-12" id="practice-quiz-tab">
      {/* Top Confidence Meter Bar */}
      <ConfidenceMeter
        score={userStats.confidenceScore || 30}
        streak={userStats.currentStreak}
        stars={userStats.stars}
        onBoostClick={() => {
          setUserStats((p) => ({
            ...p,
            confidenceScore: Math.min(100, (p.confidenceScore || 0) + 5),
          }));
        }}
      />

      {/* Quiz Controls Bar */}
      <div className="bg-white/95 rounded-3xl p-4 md:p-5 border-2 border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Difficulty Level */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-50 rounded-2xl border border-amber-200">
          <button
            id="quiz-lvl-easy"
            onClick={() => {
              sound.playPop();
              setLevel('easy');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
              level === 'easy' ? 'bg-amber-500 text-white shadow-2xs border border-amber-600' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            🌱 基础萌芽 (1-5)
          </button>
          <button
            id="quiz-lvl-med"
            onClick={() => {
              sound.playPop();
              setLevel('medium');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
              level === 'medium' ? 'bg-amber-500 text-white shadow-2xs border border-amber-600' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            🚀 进阶探索 (1-20)
          </button>
          <button
            id="quiz-lvl-hard"
            onClick={() => {
              sound.playPop();
              setLevel('hard');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
              level === 'hard' ? 'bg-amber-500 text-white shadow-2xs border border-amber-600' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            👑 挑战小状元
          </button>
        </div>

        {/* Operation Selector */}
        <div className="flex items-center gap-1 p-1 bg-orange-50 rounded-2xl border border-orange-200">
          <button
            id="quiz-op-both"
            onClick={() => {
              sound.playPop();
              setOperation('both');
            }}
            className={`px-2.5 py-1.5 rounded-xl font-black text-xs ${
              operation === 'both' ? 'bg-orange-500 text-white' : 'text-orange-950 hover:bg-orange-100'
            }`}
          >
            全部题型
          </button>
          <button
            id="quiz-op-mult"
            onClick={() => {
              sound.playPop();
              setOperation('multiply');
            }}
            className={`px-2.5 py-1.5 rounded-xl font-black text-xs ${
              operation === 'multiply' ? 'bg-orange-500 text-white' : 'text-orange-950 hover:bg-orange-100'
            }`}
          >
            ✖️ 乘法
          </button>
          <button
            id="quiz-op-div"
            onClick={() => {
              sound.playPop();
              setOperation('divide');
            }}
            className={`px-2.5 py-1.5 rounded-xl font-black text-xs ${
              operation === 'divide' ? 'bg-orange-500 text-white' : 'text-orange-950 hover:bg-orange-100'
            }`}
          >
            ➗ 除法
          </button>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            id="quiz-input-choice"
            onClick={() => setInputMode('choice')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              inputMode === 'choice' ? 'bg-white shadow-xs text-amber-950' : 'text-stone-500'
            }`}
          >
            选项模式
          </button>
          <button
            id="quiz-input-keypad"
            onClick={() => setInputMode('keypad')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              inputMode === 'keypad' ? 'bg-white shadow-xs text-amber-950' : 'text-stone-500'
            }`}
          >
            数字小键盘
          </button>
        </div>
      </div>

      {/* Main Question Card with Capybara Companion */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm relative overflow-hidden">
        {/* Top Header inside card */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-black text-xs border border-amber-300">
              第 {questionCount} 题
            </span>
            <span className="text-xs font-bold text-amber-800">
              {currentQuestion.type === 'multiply' ? '✖️ 乘法看图算' : '➗ 除法平均分'}
            </span>
          </div>

          <button
            id="btn-quiz-read-aloud"
            onClick={handleReadQuestion}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs transition-colors border border-amber-300 shadow-2xs"
          >
            <Volume2 className="w-4 h-4 text-amber-800" />
            <span>🔊 读题</span>
          </button>
        </div>

        {/* Capybara Mascot Cheer Banner */}
        <div className="mb-5 p-4 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center gap-4">
          <CapybaraMascot
            size="sm"
            mood={isAnswered ? (isCorrect ? 'celebrate' : 'thinking') : 'calm'}
            customization={userStats.capyCustomization}
            interactive={true}
          />
          <div className="flex-1">
            <div className="text-xs font-bold text-amber-800 flex items-center gap-1">
              <span>水豚陪读小助手</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <p className="text-sm font-black text-amber-950 mt-0.5">
              {capyBubble}
            </p>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="text-center my-3">
          <h2 className="text-lg sm:text-xl font-black text-amber-950 tracking-tight mb-2">
            {currentQuestion.promptText}
          </h2>
          <div className="inline-block px-5 py-2 rounded-2xl bg-amber-100/90 border-2 border-amber-300 font-mono text-2xl sm:text-3xl font-black text-amber-950 tracking-wider shadow-2xs">
            {currentQuestion.type === 'multiply' ? (
              <span>
                {currentQuestion.num1} × {currentQuestion.num2} = <span className="text-orange-600">?</span>
              </span>
            ) : (
              <span>
                {currentQuestion.num1} ÷ {currentQuestion.num2} = <span className="text-orange-600">?</span>
              </span>
            )}
          </div>
        </div>

        {/* VISUAL ILLUSTRATION STAGE */}
        <div className="my-6 p-4 sm:p-6 bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-200">
          {currentQuestion.type === 'multiply' ? (
            <div>
              <div className="text-center text-xs font-bold text-amber-900 mb-3">
                🍽️ 看图数一数：一共有 {currentQuestion.num1} 盘，每盘 {currentQuestion.num2} 个{currentQuestion.theme.singular}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {Array.from({ length: currentQuestion.num1 }).map((_, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 bg-white rounded-2xl border-2 border-amber-200 flex flex-col items-center shadow-xs min-w-[105px]"
                  >
                    <div className="flex flex-wrap items-center justify-center gap-1.5 my-1">
                      {Array.from({ length: currentQuestion.num2 }).map((_, iIdx) => (
                        <span key={iIdx} className="text-3xl select-none transform hover:scale-125 transition-transform cursor-pointer" onClick={() => sound.playPop()}>
                          {currentQuestion.theme.emoji}
                        </span>
                      ))}
                    </div>
                    <span className="text-2xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md mt-1 border border-amber-200">
                      {currentQuestion.num2} {currentQuestion.theme.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-xs font-black text-amber-950 bg-white px-4 py-1 rounded-full border border-amber-300 shadow-2xs">
                  🧺 一共有 {currentQuestion.num1} {currentQuestion.theme.unit}{currentQuestion.theme.name}：
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3 max-w-lg mx-auto">
                  {Array.from({ length: currentQuestion.num1 }).map((_, iIdx) => (
                    <span key={iIdx} className="text-3xl select-none cursor-pointer hover:scale-125 transition-transform" onClick={() => sound.playPop()}>
                      {currentQuestion.theme.emoji}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-amber-200">
                <div className="text-center text-xs font-bold text-amber-900 mb-2">
                  🍽️ 平均分到这 {currentQuestion.num2} 个盘子里，每个盘子分几个？
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {Array.from({ length: currentQuestion.num2 }).map((_, pIdx) => (
                    <div
                      key={pIdx}
                      className="w-20 h-16 sm:w-24 sm:h-20 bg-white rounded-2xl border-2 border-dashed border-amber-300 flex flex-col items-center justify-center shadow-xs"
                    >
                      <span className="text-xs font-black text-amber-800">盘子 {pIdx + 1}</span>
                      <span className="text-lg font-black text-amber-300">?</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* INPUT INTERACTION AREA */}
        {!isAnswered ? (
          <div>
            {inputMode === 'choice' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    id={`quiz-opt-${opt}`}
                    onClick={() => {
                      sound.playPop();
                      setSelectedOption(opt);
                      handleCheckAnswer(opt);
                    }}
                    className="py-4 px-3 rounded-2xl bg-amber-100/80 hover:bg-amber-200 border-2 border-amber-300 hover:border-amber-500 text-amber-950 font-black text-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="max-w-xs mx-auto space-y-3">
                <div className="w-full bg-amber-50/60 border-2 border-amber-300 rounded-2xl p-3 text-center text-2xl font-mono font-black text-amber-950 min-h-[56px] flex items-center justify-center">
                  {typedInput || <span className="text-amber-400/80 text-base font-bold">点击下方数字</span>}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                    <button
                      key={digit}
                      id={`numpad-${digit}`}
                      onClick={() => {
                        sound.playPop();
                        if (typedInput.length < 3) {
                          setTypedInput((prev) => prev + digit);
                        }
                      }}
                      className="py-3 rounded-2xl bg-white border-2 border-amber-200 hover:bg-amber-50 font-black text-xl text-amber-950 shadow-2xs active:scale-95 transition-transform"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    id="numpad-clear"
                    onClick={() => {
                      sound.playPop();
                      setTypedInput('');
                    }}
                    className="py-3 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 font-bold text-sm flex items-center justify-center active:scale-95"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                  <button
                    id="numpad-0"
                    onClick={() => {
                      sound.playPop();
                      if (typedInput.length > 0 && typedInput.length < 3) {
                        setTypedInput((prev) => prev + '0');
                      }
                    }}
                    className="py-3 rounded-2xl bg-white border-2 border-amber-200 hover:bg-amber-50 font-black text-xl text-amber-950 shadow-2xs active:scale-95"
                  >
                    0
                  </button>
                  <button
                    id="numpad-submit"
                    disabled={!typedInput}
                    onClick={() => {
                      if (typedInput) {
                        handleCheckAnswer(parseInt(typedInput));
                      }
                    }}
                    className="py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black text-base shadow-xs active:scale-95 border-2 border-amber-600"
                  >
                    确认
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* RESULT FEEDBACK AND NEXT BUTTON */
          <div className="space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
            {isCorrect ? (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <h3 className="font-black text-emerald-950 text-base">回答正确！真厉害！⭐ +1</h3>
                  <p className="text-xs text-emerald-800 font-bold">{currentQuestion.repeatedAdditionText}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-3 shadow-xs">
                <XCircle className="w-8 h-8 text-orange-600 shrink-0" />
                <div className="text-left">
                  <h3 className="font-black text-orange-950 text-base">
                    加油，正确答案是 <span className="text-lg font-black text-orange-600">{currentQuestion.answer}</span>
                  </h3>
                  <p className="text-xs text-orange-800 font-bold">{currentQuestion.repeatedAdditionText}</p>
                </div>
              </div>
            )}

            {/* Hint Box */}
            {showHint && !isCorrect && (
              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl max-w-lg mx-auto text-left space-y-1.5 text-xs text-amber-950 font-medium">
                <div className="font-black flex items-center gap-1.5 text-amber-900">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>💡 水豚的小妙招：</span>
                </div>
                {currentQuestion.type === 'multiply' ? (
                  <p>
                    算式 {currentQuestion.num1} × {currentQuestion.num2} 就是把 {currentQuestion.num1} 个 {currentQuestion.num2} 加在一起（
                    {Array(currentQuestion.num1).fill(currentQuestion.num2).join(' + ')} = {currentQuestion.answer}）哦！
                  </p>
                ) : (
                  <p>
                    算式 {currentQuestion.num1} ÷ {currentQuestion.num2}，可以想乘法口诀：几乘 {currentQuestion.num2} 等于 {currentQuestion.num1} 呢？想一想，{currentQuestion.answer} × {currentQuestion.num2} = {currentQuestion.num1}！
                  </p>
                )}
              </div>
            )}

            {/* Next Question Button */}
            <div className="pt-2">
              <button
                id="btn-next-question"
                onClick={() => {
                  sound.playPop();
                  setQuestionCount((c) => c + 1);
                  nextQuestion();
                }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-base shadow-md shadow-amber-300 transition-all hover:scale-102 active:scale-95 border-2 border-amber-600 cursor-pointer"
              >
                <span>下一题 🐾</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
