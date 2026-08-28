import React, { useState } from 'react';
import { UserStats, Question } from '../types';
import { CAPY_BADGES } from '../utils/capyConstants';
import { sound } from '../utils/audio';
import { X, Award, Flame, Star, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { CapybaraMascot } from './CapybaraMascot';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  userStats,
  setUserStats,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'badges' | 'mistakes'>('badges');

  if (!isOpen) return null;

  const handleRetryMistake = (q: Question) => {
    sound.playCorrect();
    setUserStats((prev) => ({
      ...prev,
      stars: prev.stars + 1,
      confidenceScore: Math.min(100, (prev.confidenceScore || 0) + 10),
      mistakes: prev.mistakes.filter((m) => m.id !== q.id),
    }));
  };

  const accuracy =
    userStats.totalAnswered > 0
      ? Math.round((userStats.correctAnswered / userStats.totalAnswered) * 100)
      : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border-2 border-amber-300 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <CapybaraMascot
              size="sm"
              mood="celebrate"
              customization={userStats.capyCustomization}
              interactive={true}
            />
            <div>
              <h2 className="text-lg font-black text-amber-950">水豚勋章墙与成就</h2>
              <p className="text-xs font-bold text-amber-800/80">每一次努力都会让小水豚茁壮成长</p>
            </div>
          </div>

          <button
            id="btn-close-rewards-modal"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-2xl text-amber-800 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-900 font-black text-xs mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>小金星</span>
            </div>
            <div className="text-2xl font-black text-amber-950">{userStats.stars}</div>
          </div>

          <div className="p-3 bg-orange-50 rounded-2xl border-2 border-orange-200 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-950 font-black text-xs mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
              <span>答题总数</span>
            </div>
            <div className="text-2xl font-black text-orange-950">{userStats.totalAnswered}</div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-950 font-black text-xs mb-1">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>正确率</span>
            </div>
            <div className="text-2xl font-black text-emerald-950">{accuracy}%</div>
          </div>

          <div className="p-3 bg-rose-50 rounded-2xl border-2 border-rose-200 text-center">
            <div className="flex items-center justify-center gap-1 text-rose-950 font-black text-xs mb-1">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>最高连对</span>
            </div>
            <div className="text-2xl font-black text-rose-950">{userStats.bestStreak}</div>
          </div>
        </div>

        {/* Sub tabs */}
        <div className="flex border-b border-amber-200 mb-4">
          <button
            id="tab-sub-badges"
            onClick={() => setActiveSubTab('badges')}
            className={`pb-2.5 px-4 text-xs font-black transition-colors relative cursor-pointer ${
              activeSubTab === 'badges'
                ? 'text-amber-950 border-b-3 border-amber-500'
                : 'text-amber-800/60 hover:text-amber-950'
            }`}
          >
            🏅 卡皮巴拉荣誉勋章
          </button>
          <button
            id="tab-sub-mistakes"
            onClick={() => setActiveSubTab('mistakes')}
            className={`pb-2.5 px-4 text-xs font-black transition-colors relative flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'mistakes'
                ? 'text-amber-950 border-b-3 border-amber-500'
                : 'text-amber-800/60 hover:text-amber-950'
            }`}
          >
            <span>📝 水豚错题锦囊</span>
            {userStats.mistakes.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-2xs flex items-center justify-center font-black">
                {userStats.mistakes.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3">
          {activeSubTab === 'badges' ? (
            /* BADGES WALL */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAPY_BADGES.map((badge) => {
                const isUnlocked = userStats.stars >= badge.requiredStars;
                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                        : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl select-none ${
                        isUnlocked ? 'bg-white shadow-2xs border border-amber-300' : 'bg-stone-200'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-amber-950 truncate">{badge.title}</h4>
                        {isUnlocked ? (
                          <span className="text-2xs bg-amber-200 text-amber-950 font-black px-1.5 py-0.5 rounded-md border border-amber-300">
                            已解锁
                          </span>
                        ) : (
                          <span className="text-2xs bg-stone-200 text-stone-700 font-bold px-1.5 py-0.5 rounded-md">
                            需 {badge.requiredStars} ⭐️
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-amber-900/80 font-medium mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* MISTAKES NOTEBOOK */
            <div className="space-y-3">
              {userStats.mistakes.length === 0 ? (
                <div className="p-8 text-center bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200">
                  <span className="text-3xl mb-2 block">✨ 🐾</span>
                  <p className="text-sm font-black text-amber-950">太棒啦！目前没有错题记录</p>
                  <p className="text-xs text-amber-800/80 font-bold mt-1">在做题时遇到不会的题目，水豚会自动帮你收录到这里温习哦！</p>
                </div>
              ) : (
                userStats.mistakes.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl bg-amber-50/60 border-2 border-amber-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-black text-amber-950 text-sm">{q.promptText}</div>
                      <div className="text-xs font-mono font-black text-orange-600 mt-1">
                        正确答案：{q.answer} ({q.repeatedAdditionText})
                      </div>
                    </div>

                    <button
                      id={`btn-retry-mistake-${q.id}`}
                      onClick={() => handleRetryMistake(q)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-2xs whitespace-nowrap border border-amber-600 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>已掌握 (+1⭐️)</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
