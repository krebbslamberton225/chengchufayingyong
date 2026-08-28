import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, RefreshCw, ArrowRight, Trophy, Heart } from 'lucide-react';
import { CapybaraMascot } from './CapybaraMascot';

interface SharingGameProps {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

interface CapyFriend {
  id: string;
  name: string;
  avatar: string;
  favFoodEmoji: string;
  favFoodName: string;
}

const ALL_CAPY_FRIENDS: CapyFriend[] = [
  { id: 'capy1', name: '顶桔水豚', avatar: '🍊', favFoodEmoji: '🍊', favFoodName: '小金桔' },
  { id: 'capy2', name: '温泉水豚', avatar: '♨️', favFoodEmoji: '🍉', favFoodName: '西瓜片' },
  { id: 'capy3', name: '草料小水豚', avatar: '🌿', favFoodEmoji: '🥕', favFoodName: '胡萝卜' },
  { id: 'capy4', name: '泡澡小黄鸭', avatar: '🐥', favFoodEmoji: '🍪', favFoodName: '水豚饼干' },
  { id: 'capy5', name: '稳当小乌龟', avatar: '🐢', favFoodEmoji: '🍩', favFoodName: '小甜甜圈' },
  { id: 'capy6', name: '向阳水豚', avatar: '🌸', favFoodEmoji: '🍎', favFoodName: '红苹果' },
];

export const SharingGame: React.FC<SharingGameProps> = ({ userStats, setUserStats }) => {
  const [animalCount, setAnimalCount] = useState<number>(2); // 2, 3, or 4 animals
  const [itemsPerAnimal, setItemsPerAnimal] = useState<number>(3); // 2, 3, or 4 items each
  const [animals, setAnimals] = useState<CapyFriend[]>([]);
  const [foodEmoji, setFoodEmoji] = useState<string>('🍊');
  const [foodName, setFoodName] = useState<string>('小金桔');

  // Distribution State
  const [basketCount, setBasketCount] = useState<number>(6);
  const [animalPlates, setAnimalPlates] = useState<number[]>([]);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const totalFood = animalCount * itemsPerAnimal;

  // Initialize a new round
  const startNewRound = (customAnimalsCount?: number, customPerAnimal?: number) => {
    sound.playPop();
    const count = customAnimalsCount !== undefined ? customAnimalsCount : animalCount;
    const perAnimal = customPerAnimal !== undefined ? customPerAnimal : itemsPerAnimal;
    const total = count * perAnimal;

    const shuffled = [...ALL_CAPY_FRIENDS].sort(() => 0.5 - Math.random());
    const pickedAnimals = shuffled.slice(0, count);

    setAnimals(pickedAnimals);
    setFoodEmoji(pickedAnimals[0].favFoodEmoji);
    setFoodName(pickedAnimals[0].favFoodName);
    setBasketCount(total);
    setAnimalPlates(new Array(count).fill(0));
    setGameCompleted(false);
    setIsSuccess(false);
  };

  useEffect(() => {
    startNewRound(2, 3);
  }, []);

  // Give 1 food from basket to animal plate
  const handleGiveFood = (index: number) => {
    if (basketCount <= 0 || gameCompleted) return;
    sound.playPop();
    setBasketCount((prev) => prev - 1);
    setAnimalPlates((prev) => {
      const next = [...prev];
      next[index] = next[index] + 1;
      return next;
    });
  };

  // Return 1 food from animal plate back to basket
  const handleReturnFood = (index: number) => {
    if (animalPlates[index] <= 0 || gameCompleted) return;
    sound.playPop();
    setAnimalPlates((prev) => {
      const next = [...prev];
      next[index] = next[index] - 1;
      return next;
    });
    setBasketCount((prev) => prev + 1);
  };

  // Auto distribute equally
  const handleAutoDistribute = () => {
    sound.playPop();
    setBasketCount(0);
    setAnimalPlates(new Array(animalCount).fill(itemsPerAnimal));
  };

  // Check if distribution is done and equal
  useEffect(() => {
    if (basketCount === 0 && animalPlates.length > 0) {
      const first = animalPlates[0];
      const allEqual = first > 0 && animalPlates.every((c) => c === first);

      if (allEqual) {
        setIsSuccess(true);
        setGameCompleted(true);
        sound.playFanfare();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#F97316', '#EC4899', '#8B5CF6'],
        });

        setUserStats((prev) => ({
          ...prev,
          stars: prev.stars + 2,
          totalAnswered: prev.totalAnswered + 1,
          correctAnswered: prev.correctAnswered + 1,
          confidenceScore: Math.min(100, (prev.confidenceScore || 0) + 12),
        }));

        sound.speak(`太棒啦！${totalFood}个${foodName}平均分给${animalCount}只水豚好朋友，每只正好分到${first}个！`);
      } else {
        setIsSuccess(false);
        sound.playRetry();
      }
    }
  }, [basketCount, animalPlates]);

  const handleSpeakProblem = () => {
    const text = `桌上有 ${totalFood} 个${foodName}，请把它们平均分给 ${animalCount} 位水豚小伙伴，点击盘子把食物放上去，让大家分得一样多哦！`;
    sound.speak(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12" id="sharing-game-tab">
      {/* Top Setting Bar */}
      <div className="bg-white/95 rounded-3xl p-5 border-2 border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Animal Count Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-950">水豚伙伴数量：</span>
          <div className="flex bg-amber-50 p-1 rounded-2xl border border-amber-200">
            {[2, 3, 4].map((num) => (
              <button
                key={num}
                id={`game-animals-${num}`}
                onClick={() => {
                  setAnimalCount(num);
                  startNewRound(num, itemsPerAnimal);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                  animalCount === num
                    ? 'bg-amber-500 text-white shadow-2xs border border-amber-600'
                    : 'text-amber-900 hover:bg-amber-100'
                }`}
              >
                {num} 位水豚
              </button>
            ))}
          </div>
        </div>

        {/* Per Animal Target */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-950">每位分几个：</span>
          <div className="flex bg-orange-50 p-1 rounded-2xl border border-orange-200">
            {[2, 3, 4, 5].map((num) => (
              <button
                key={num}
                id={`game-per-animal-${num}`}
                onClick={() => {
                  setItemsPerAnimal(num);
                  startNewRound(animalCount, num);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                  itemsPerAnimal === num
                    ? 'bg-orange-500 text-white shadow-2xs border border-orange-600'
                    : 'text-orange-950 hover:bg-orange-100'
                }`}
              >
                {num} 个
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            id="btn-speak-sharing"
            onClick={handleSpeakProblem}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>🔊 读题目</span>
          </button>
          <button
            id="btn-reset-sharing"
            onClick={() => startNewRound()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-xs border border-amber-300 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重新开始</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-gradient-to-b from-amber-50/70 to-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm relative">
        {/* Goal Description Banner */}
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-200 text-amber-950 font-black text-xs mb-2 border border-amber-300">
            🐾 互动任务：卡皮巴拉温泉野餐平均分
          </div>
          <h2 className="text-lg sm:text-xl font-black text-amber-950">
            把野餐篮里的 <span className="text-orange-600 font-black">{totalFood}</span> 个{foodName}，平均分给{' '}
            <span className="text-orange-600 font-black">{animalCount}</span> 位水豚小伙伴！
          </h2>
          <p className="text-xs text-amber-800 font-bold mt-1">
            👉 点击水豚盘子即可放上{foodName}；点击盘中的食物可放回篮子。
          </p>
        </div>

        {/* Center Food Basket */}
        <div className="flex flex-col items-center justify-center p-5 bg-amber-100/70 rounded-3xl border-2 border-dashed border-amber-300 max-w-md mx-auto mb-8 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧺</span>
            <span className="font-black text-amber-950 text-sm">
              水豚野餐篮（还剩 {basketCount} 个{foodName}）
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 min-h-[50px] p-2">
            {basketCount > 0 ? (
              Array.from({ length: basketCount }).map((_, idx) => (
                <span
                  key={idx}
                  className="text-3xl sm:text-4xl select-none animate-in zoom-in duration-200 transform hover:scale-125 transition-transform cursor-pointer"
                  onClick={() => sound.playPop()}
                >
                  {foodEmoji}
                </span>
              ))
            ) : (
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                ✨ 篮子里的食物都分完啦！
              </span>
            )}
          </div>

          {basketCount > 0 && !gameCompleted && (
            <button
              id="btn-auto-share"
              onClick={handleAutoDistribute}
              className="mt-3 flex items-center gap-1.5 text-xs font-black text-amber-950 bg-white hover:bg-amber-100 px-3.5 py-1.5 rounded-xl border border-amber-300 shadow-2xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>水豚帮我一键平均分</span>
            </button>
          )}
        </div>

        {/* Capy Friends with Plates */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-center">
          {animals.map((animal, idx) => {
            const countOnPlate = animalPlates[idx] || 0;
            return (
              <div
                key={animal.id}
                onClick={() => handleGiveFood(idx)}
                className={`group cursor-pointer p-4 rounded-3xl bg-white border-2 transition-all flex flex-col items-center text-center shadow-xs hover:shadow-md ${
                  gameCompleted && isSuccess
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : 'border-amber-200 hover:border-amber-400'
                }`}
              >
                {/* Capy Friend Face */}
                <div className="relative mb-2">
                  <CapybaraMascot
                    size="sm"
                    mood={gameCompleted && isSuccess ? 'celebrate' : 'calm'}
                    customization={{
                      head: idx % 2 === 0 ? 'head_orange' : 'head_towel',
                      body: idx === 1 ? 'body_tub' : 'body_none',
                      companion: 'comp_none',
                      scene: 'scene_spring',
                    }}
                    interactive={false}
                  />
                </div>

                <span className="font-black text-amber-950 text-sm mb-1">{animal.name}</span>

                {/* Plate */}
                <div className="w-full min-h-[90px] rounded-2xl bg-amber-50/60 border-2 border-dashed border-amber-300 p-2 flex flex-col items-center justify-center my-1 relative">
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {Array.from({ length: countOnPlate }).map((_, fIdx) => (
                      <span
                        key={fIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReturnFood(idx);
                        }}
                        className="text-2xl sm:text-3xl select-none hover:scale-125 transition-transform"
                        title="点击放回篮子"
                      >
                        {foodEmoji}
                      </span>
                    ))}
                  </div>

                  {countOnPlate === 0 && (
                    <span className="text-2xs text-amber-800/60 font-bold">点击分给{animal.name}</span>
                  )}
                </div>

                {/* Counter */}
                <div className="mt-2 text-xs font-black text-amber-900 bg-amber-200/80 border border-amber-300 px-3 py-0.5 rounded-full">
                  分到 {countOnPlate} 个
                </div>
              </div>
            );
          })}
        </div>

        {/* SUCCESS / FEEDBACK CARD */}
        {gameCompleted && isSuccess && (
          <div className="mt-8 p-6 bg-white rounded-3xl border-2 border-emerald-400 shadow-md max-w-2xl mx-auto text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center gap-2 text-emerald-800">
              <Trophy className="w-7 h-7 text-amber-500" />
              <h3 className="text-xl font-black">太棒啦！水豚小伙伴们都分得一样多！⭐ +2</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Division Equation */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-300">
                <span className="text-xs font-black text-emerald-900">➗ 除法平均分算式：</span>
                <div className="text-lg font-mono font-black text-emerald-950 mt-1">
                  {totalFood} ÷ {animalCount} = <span className="text-xl text-emerald-600">{itemsPerAnimal}</span>
                </div>
                <p className="text-2xs text-emerald-800 font-bold mt-1">
                  {totalFood}个{foodName}平均分成{animalCount}份，每份{itemsPerAnimal}个
                </p>
              </div>

              {/* Multiplication Relationship */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300">
                <span className="text-xs font-black text-amber-900">✖️ 乘法好朋友：</span>
                <div className="text-lg font-mono font-black text-amber-950 mt-1">
                  {animalCount} × {itemsPerAnimal} = <span className="text-xl text-amber-600">{totalFood}</span>
                </div>
                <p className="text-2xs text-amber-800 font-bold mt-1">
                  {animalCount}个{itemsPerAnimal}相加正好等于{totalFood}
                </p>
              </div>
            </div>

            {/* Next Round Button */}
            <div>
              <button
                id="btn-sharing-next-round"
                onClick={() => {
                  sound.playPop();
                  const nextAnimals = Math.random() > 0.5 ? 3 : 2;
                  const nextPer = Math.floor(Math.random() * 3) + 2;
                  setAnimalCount(nextAnimals);
                  setItemsPerAnimal(nextPer);
                  startNewRound(nextAnimals, nextPer);
                }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-sm transition-transform active:scale-95 border-2 border-emerald-700 cursor-pointer"
              >
                <span>再玩一次 🐾</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* NOT EQUAL WARNING */}
        {basketCount === 0 && !isSuccess && (
          <div className="mt-8 p-4 bg-orange-50 rounded-2xl border-2 border-orange-300 max-w-lg mx-auto text-center space-y-2">
            <h4 className="font-black text-orange-950 text-sm">水豚们分得不一样多哦！</h4>
            <p className="text-xs text-orange-800 font-bold">
              水豚最讲究公平啦～点击盘子里的食物放回篮子重新分一分，让大家分得完全一样多吧！
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
