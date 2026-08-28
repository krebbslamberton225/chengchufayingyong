import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Trophy } from 'lucide-react';
import { sound } from '../utils/audio';

interface ConfidenceMeterProps {
  score: number; // 0 - 100
  streak: number;
  stars: number;
  onBoostClick?: () => void;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  streak,
  stars,
  onBoostClick,
}) => {
  const percentage = Math.min(100, Math.max(0, score));

  // Determine encouragement tier
  let tierLabel = '萌新起步 · 慢慢来';
  let tierEmoji = '🌱';
  let barGradient = 'from-amber-400 to-amber-500';

  if (percentage >= 80) {
    tierLabel = '超强自信 · 水豚数学大师';
    tierEmoji = '👑';
    barGradient = 'from-amber-400 via-orange-400 to-amber-600';
  } else if (percentage >= 50) {
    tierLabel = '从容不迫 · 乘除小达人';
    tierEmoji = '🍊';
    barGradient = 'from-emerald-400 to-teal-500';
  } else if (percentage >= 20) {
    tierLabel = '稳步提升 · 渐入佳境';
    tierEmoji = '🐾';
    barGradient = 'from-yellow-400 to-amber-400';
  }

  const handleCheer = () => {
    sound.playCorrect();
    sound.speak('深吸一口气，心态放平，你每一次尝试都算数！');
    if (onBoostClick) onBoostClick();
  };

  return (
    <div
      className="bg-amber-50/90 border-2 border-amber-200 rounded-3xl p-4 md:p-5 shadow-sm text-amber-950"
      id="confidence-meter-card"
    >
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-900">
            <Heart className="w-4 h-4 fill-amber-500 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-800 tracking-wide">
              卡皮巴拉自信蓄力池
            </div>
            <div className="text-sm font-black text-amber-950 flex items-center gap-1.5">
              <span>{tierEmoji}</span>
              <span>{tierLabel}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <span className="px-2.5 py-1 bg-orange-100 text-orange-800 border border-orange-200 rounded-full text-xs font-black animate-pulse flex items-center gap-1">
              🔥 连对 {streak} 题
            </span>
          )}
          <button
            onClick={handleCheer}
            className="px-3 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 transition-all active:scale-95 shadow-xs flex items-center gap-1"
            title="给孩子一句暖心鼓励"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>打气口号</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-5 bg-amber-200/70 rounded-full overflow-hidden p-0.5 border border-amber-300">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} relative shadow-inner`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Shimmer light effect */}
          <div className="absolute inset-0 bg-white/25 skew-x-12 animate-pulse" />
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-2 text-xs font-bold text-amber-800">
        <span className="flex items-center gap-1">
          <span>蓄力进度：</span>
          <span className="font-extrabold text-amber-900 text-sm">{percentage} %</span>
        </span>
        <span className="text-[11px] text-amber-700">
          答对 +10%，探索 +5%，点赞水豚 +2%
        </span>
      </div>
    </div>
  );
};
