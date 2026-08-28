import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import { CapybaraMascot } from './CapybaraMascot';

interface BalloonGameProps {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

interface BalloonItem {
  id: string;
  equation: string;
  value: number;
  color: string;
  popped: boolean;
}

const BUBBLE_COLORS = [
  'bg-amber-300/85 border-amber-400 text-amber-950',
  'bg-orange-300/85 border-orange-400 text-orange-950',
  'bg-emerald-300/85 border-emerald-400 text-emerald-950',
  'bg-sky-300/85 border-sky-400 text-sky-950',
  'bg-pink-300/85 border-pink-400 text-pink-950',
  'bg-yellow-300/85 border-yellow-400 text-yellow-950',
];

export const BalloonGame: React.FC<BalloonGameProps> = ({ userStats, setUserStats }) => {
  const [targetNumber, setTargetNumber] = useState<number>(6);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [roundComplete, setRoundComplete] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const TARGET_CANDIDATES = [4, 6, 8, 9, 10, 12, 15, 16];

  const generateBalloons = (target: number) => {
    const correctCandidates: { eq: string; val: number }[] = [];
    for (let a = 1; a <= 9; a++) {
      if (target % a === 0) {
        const b = target / a;
        if (b <= 9) {
          correctCandidates.push({ eq: `${a} × ${b}`, val: target });
        }
      }
    }
    [2, 3].forEach((divisor) => {
      const dividend = target * divisor;
      if (dividend <= 36) {
        correctCandidates.push({ eq: `${dividend} ÷ ${divisor}`, val: target });
      }
    });

    const shuffledCorrect = correctCandidates.sort(() => 0.5 - Math.random());
    const pickedCorrect = shuffledCorrect.slice(0, Math.min(3, shuffledCorrect.length));

    const wrongCandidates: { eq: string; val: number }[] = [];
    const possibleFactors = [
      [2, 2], [2, 3], [3, 3], [2, 4], [4, 2], [2, 5], [5, 2],
      [3, 4], [4, 3], [4, 4], [5, 3], [2, 6], [6, 2],
      [8, 2], [10, 2], [12, 3], [14, 2], [16, 2], [18, 3]
    ];

    possibleFactors.forEach(([x, y]) => {
      const multVal = x * y;
      if (multVal !== target && multVal <= 24) {
        wrongCandidates.push({ eq: `${x} × ${y}`, val: multVal });
      }
      if (x % y === 0 && x / y !== target) {
        wrongCandidates.push({ eq: `${x} ÷ ${y}`, val: x / y });
      }
    });

    const shuffledWrong = wrongCandidates.sort(() => 0.5 - Math.random());
    const pickedWrong = shuffledWrong.slice(0, 6 - pickedCorrect.length);

    const all = [...pickedCorrect, ...pickedWrong].sort(() => 0.5 - Math.random());

    const bubbleItems: BalloonItem[] = all.map((item, idx) => ({
      id: `b_${idx}_${Math.random()}`,
      equation: item.eq,
      value: item.val,
      color: BUBBLE_COLORS[idx % BUBBLE_COLORS.length],
      popped: false,
    }));

    return bubbleItems;
  };

  const startNewGame = (customRound: number = 1) => {
    sound.playPop();
    const nextTarget = TARGET_CANDIDATES[(customRound - 1) % TARGET_CANDIDATES.length];
    setTargetNumber(nextTarget);
    setBalloons(generateBalloons(nextTarget));
    setRound(customRound);
    setRoundComplete(false);
    setFeedbackMsg(`找一找哪些温泉泡泡的得数等于 ${nextTarget} 呢？🍊`);
  };

  useEffect(() => {
    startNewGame(1);
  }, []);

  const handlePopBalloon = (balloon: BalloonItem) => {
    if (balloon.popped || roundComplete) return;

    if (balloon.value === targetNumber) {
      sound.playBalloonPop();
      setFeedbackMsg(`太准啦！${balloon.equation} = ${targetNumber} 🫧`);

      setBalloons((prev) =>
        prev.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b))
      );

      setScore((s) => s + 10);

      setTimeout(() => {
        const remainingCorrect = balloons.filter(
          (b) => b.value === targetNumber && b.id !== balloon.id && !b.popped
        );

        if (remainingCorrect.length === 0) {
          sound.playCorrect();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#10B981', '#F97316', '#EC4899', '#8B5CF6'],
          });

          setUserStats((prev) => ({
            ...prev,
            stars: prev.stars + 1,
            totalAnswered: prev.totalAnswered + 1,
            correctAnswered: prev.correctAnswered + 1,
            confidenceScore: Math.min(100, (prev.confidenceScore || 0) + 10),
          }));

          setRoundComplete(true);
        }
      }, 100);
    } else {
      sound.playRetry();
      setFeedbackMsg(`哎呀！${balloon.equation} = ${balloon.value}，不是 ${targetNumber} 哦，深吸一口气再找找看~`);
    }
  };

  const handleSpeakTarget = () => {
    sound.speak(`目标是数字 ${targetNumber}，请戳破得数等于 ${targetNumber} 的温泉泡泡！`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12" id="balloon-game-tab">
      {/* Top Banner */}
      <div className="bg-white/95 rounded-3xl p-5 border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-2xl font-bold shadow-2xs">
            🫧
          </div>
          <div>
            <h2 className="text-base font-black text-amber-950">水豚温泉泡泡戳戳乐</h2>
            <p className="text-xs text-amber-800/80 font-bold">锻炼乘除法速算眼力与反应力</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1 bg-amber-100/90 border border-amber-300 rounded-full text-xs font-black text-amber-950">
            第 {round} 关 · 积分: {score}
          </div>
          <button
            id="btn-balloon-speak"
            onClick={handleSpeakTarget}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>🔊 读目标</span>
          </button>
          <button
            id="btn-balloon-restart"
            onClick={() => startNewGame(1)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-xs border border-amber-300 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Game Stage */}
      <div className="bg-gradient-to-b from-amber-50/60 via-amber-100/30 to-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm relative min-h-[440px] flex flex-col justify-between overflow-hidden">
        {/* Capybara floating beside target */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <CapybaraMascot
              size="sm"
              mood={roundComplete ? 'celebrate' : 'calm'}
              customization={userStats.capyCustomization}
              interactive={true}
            />
            <div>
              <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-3 py-0.5 rounded-full border border-amber-300">
                🎯 当前目标得数
              </span>
              <div className="mt-1 inline-flex items-center justify-center px-7 py-2.5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-3xl sm:text-4xl shadow-md border-2 border-amber-600 tracking-wider">
                【 {targetNumber} 】
              </div>
            </div>
          </div>

          {feedbackMsg && (
            <p className="text-xs font-black text-amber-950 mt-1 min-h-[20px]">
              {feedbackMsg}
            </p>
          )}
        </div>

        {/* Floating Bubble Balloons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 my-6 max-w-2xl mx-auto w-full">
          {balloons.map((b) => (
            <div key={b.id} className="flex justify-center">
              {!b.popped ? (
                <button
                  id={`balloon-${b.id}`}
                  onClick={() => handlePopBalloon(b)}
                  className={`group relative w-28 h-32 sm:w-34 sm:h-38 rounded-full border-3 ${b.color} shadow-md hover:shadow-lg flex flex-col items-center justify-center p-3 cursor-pointer transition-all transform hover:-translate-y-2 active:scale-95 animate-in zoom-in duration-300`}
                >
                  {/* Bubble Reflection Highlight */}
                  <div className="absolute top-3 left-4 w-4 h-6 rounded-full bg-white/60 rotate-[-30deg]" />

                  {/* Math Equation */}
                  <span className="text-base sm:text-lg font-mono font-black tracking-wide drop-shadow-2xs select-none">
                    {b.equation}
                  </span>
                </button>
              ) : (
                <div className="w-28 h-32 sm:w-34 sm:h-38 flex items-center justify-center text-3xl animate-in zoom-in-50 duration-200">
                  <span className="animate-ping text-3xl">🫧✨</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ROUND COMPLETE CARD */}
        {roundComplete && (
          <div className="p-6 bg-white rounded-3xl border-2 border-amber-400 shadow-xl text-center space-y-3 max-w-md mx-auto animate-in zoom-in duration-200">
            <div className="text-3xl">🎉 ⭐️</div>
            <h3 className="text-lg font-black text-amber-950">
              第 {round} 关通关啦！+1 颗小金星 ⭐
            </h3>
            <p className="text-xs font-bold text-amber-800">
              水豚为你鼓掌：你已经完全掌握了数字 {targetNumber} 的乘除口诀！
            </p>
            <button
              id="btn-balloon-next-round"
              onClick={() => startNewGame(round + 1)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-transform active:scale-95 border-2 border-amber-600 cursor-pointer"
            >
              <span>进入第 {round + 1} 关 🐾</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
