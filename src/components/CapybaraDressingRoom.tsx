import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CapyAccessory, UserStats } from '../types';
import { CAPY_ACCESSORIES } from '../utils/capyConstants';
import { CapybaraMascot } from './CapybaraMascot';
import { sound } from '../utils/audio';
import { Sparkles, Check, Lock, Star, ShoppingBag, Palette } from 'lucide-react';

interface CapybaraDressingRoomProps {
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

export const CapybaraDressingRoom: React.FC<CapybaraDressingRoomProps> = ({
  stats,
  onUpdateStats,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'head' | 'body' | 'companion' | 'scene'>('head');
  const [previewCustomization, setPreviewCustomization] = useState(stats.capyCustomization);

  const categories: { id: 'head' | 'body' | 'companion' | 'scene'; label: string; icon: string }[] = [
    { id: 'head', label: '头顶装扮', icon: '🍊' },
    { id: 'body', label: '身体服饰', icon: '🪵' },
    { id: 'companion', label: '身旁伙伴', icon: '🐥' },
    { id: 'scene', label: '温泉场景', icon: '♨️' },
  ];

  const currentItems = CAPY_ACCESSORIES.filter((item) => item.category === selectedCategory);

  const isUnlocked = (itemId: string, cost: number) => {
    if (cost === 0) return true;
    return stats.unlockedAccessories?.includes(itemId);
  };

  const isEquipped = (item: CapyAccessory) => {
    return stats.capyCustomization[item.category] === item.id;
  };

  const handleEquip = (item: CapyAccessory) => {
    sound.playPop();
    const updatedCustomization = {
      ...stats.capyCustomization,
      [item.category]: item.id,
    };
    setPreviewCustomization(updatedCustomization);
    onUpdateStats({
      ...stats,
      capyCustomization: updatedCustomization,
    });
  };

  const handleUnlock = (item: CapyAccessory) => {
    if (stats.stars < item.cost) {
      sound.playRetry();
      sound.speak(`小金星还差 ${item.cost - stats.stars} 颗哦，多做几道题就能换啦！`);
      return;
    }

    sound.playFanfare();
    sound.speak(`太棒啦！成功解锁 ${item.name}！`);
    const newUnlocked = [...(stats.unlockedAccessories || []), item.id];
    const newStars = stats.stars - item.cost;
    const updatedCustomization = {
      ...stats.capyCustomization,
      [item.category]: item.id,
    };

    onUpdateStats({
      ...stats,
      stars: newStars,
      unlockedAccessories: newUnlocked,
      capyCustomization: updatedCustomization,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" id="capybara-dressing-room">
      {/* Title Header */}
      <div className="bg-amber-100/80 border-2 border-amber-300 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">♨️</span>
            <h2 className="text-2xl font-black text-amber-950">卡皮巴拉专属温泉衣帽间</h2>
          </div>
          <p className="text-sm font-bold text-amber-800 mt-1">
            用做题获得的小金星 ⭐，给你的水豚好朋友换上最萌的装扮吧！
          </p>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 px-5 py-2.5 rounded-2xl shadow-xs">
          <Star className="w-6 h-6 fill-amber-400 text-amber-500 animate-bounce" />
          <div>
            <div className="text-[11px] font-bold text-amber-800">当前可用金星</div>
            <div className="text-xl font-black text-amber-950">{stats.stars} 颗</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Stage: Real-time Capybara Preview & Hot Spring Backdrop */}
        <div className="lg:col-span-5 bg-gradient-to-b from-amber-100/90 to-amber-200/90 border-3 border-amber-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden min-h-[380px]">
          {/* Subtle onsen water rings */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            <div className="w-72 h-72 border-4 border-amber-500 rounded-full animate-ping" />
          </div>

          <div className="relative z-10 my-4">
            <CapybaraMascot
              size="lg"
              mood="happy"
              customization={stats.capyCustomization}
              showSpeechBubble
              bubbleText="水豚豚超级喜欢你挑的装扮～！🐾"
            />
          </div>

          <div className="relative z-10 mt-4 bg-white/90 border border-amber-300 rounded-2xl px-4 py-2 text-xs font-black text-amber-900 shadow-xs">
            ✨ 当前造型已在全应用生效！
          </div>
        </div>

        {/* Right Stage: Category Tabs & Wardrobe Grid */}
        <div className="lg:col-span-7 bg-white/95 border-2 border-amber-200 rounded-3xl p-6 shadow-sm space-y-5">
          {/* Category Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playPop();
                    setSelectedCategory(cat.id);
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-sm transition-all ${
                    active
                      ? 'bg-amber-500 text-white shadow-md scale-102 border-2 border-amber-600'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {currentItems.map((item) => {
              const unlocked = isUnlocked(item.id, item.cost);
              const equipped = isEquipped(item);
              const canAfford = stats.stars >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    equipped
                      ? 'bg-amber-100/70 border-amber-500 shadow-sm'
                      : unlocked
                      ? 'bg-stone-50 border-stone-200 hover:border-amber-300'
                      : 'bg-stone-100/70 border-stone-200 opacity-90'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm text-stone-900">{item.name}</h4>
                        {equipped && (
                          <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-extrabold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> 佩戴中
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 font-medium mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-200/80 flex items-center justify-between">
                    {unlocked ? (
                      equipped ? (
                        <span className="text-xs font-bold text-amber-700">正在展示中 ✨</span>
                      ) : (
                        <button
                          onClick={() => handleEquip(item)}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-98 flex items-center justify-center gap-1.5"
                        >
                          <Palette className="w-3.5 h-3.5" /> 换上这个
                        </button>
                      )
                    ) : (
                      <div className="w-full flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{item.cost} 颗金星</span>
                        </span>
                        <button
                          onClick={() => handleUnlock(item)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                            canAfford
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5" /> 解锁
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5" /> 还需 {item.cost - stats.stars} ⭐
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
