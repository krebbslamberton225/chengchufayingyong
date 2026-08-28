import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { CAPY_CHEERS } from '../utils/capyConstants';

interface CapybaraMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'calm' | 'happy' | 'thinking' | 'celebrate';
  customization?: {
    head?: string;
    body?: string;
    companion?: string;
    scene?: string;
  };
  onClick?: () => void;
  showSpeechBubble?: boolean;
  bubbleText?: string;
  interactive?: boolean;
}

export const CapybaraMascot: React.FC<CapybaraMascotProps> = ({
  size = 'md',
  mood = 'calm',
  customization = { head: 'head_orange', body: 'body_none', companion: 'comp_none', scene: 'scene_spring' },
  onClick,
  showSpeechBubble = false,
  bubbleText,
  interactive = true,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [localBubble, setLocalBubble] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleClick = () => {
    sound.playCapySqueak();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500);

    const randomPraise = CAPY_CHEERS.clickMascot[Math.floor(Math.random() * CAPY_CHEERS.clickMascot.length)];
    setLocalBubble(randomPraise);
    setClickCount((c) => c + 1);

    if (onClick) onClick();
  };

  const scaleMap = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const currentBubble = bubbleText || localBubble;

  // Head item emoji/element
  const renderHeadAccessory = () => {
    const headId = customization?.head || 'head_orange';
    switch (headId) {
      case 'head_orange':
        return (
          <motion.div
            animate={{ y: [0, -2, 0], rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl filter drop-shadow-sm select-none z-20"
          >
            🍊
          </motion.div>
        );
      case 'head_towel':
        return (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="bg-white border border-stone-200 px-3 py-1 rounded-t-md shadow-xs text-xs font-bold text-stone-700">
              ♨️ 暖毛巾
            </div>
          </div>
        );
      case 'head_duck':
        return (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl select-none z-20"
          >
            🐥
          </motion.div>
        );
      case 'head_grad':
        return (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl select-none z-20">
            🎓
          </div>
        );
      case 'head_crown':
        return (
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl select-none z-20"
          >
            👑
          </motion.div>
        );
      case 'head_flower':
        return (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl select-none z-20">
            🌸
          </div>
        );
      case 'head_apple':
        return (
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2.8 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl select-none z-20"
          >
            🍎
          </motion.div>
        );
      default:
        return null;
    }
  };

  // Body accessory
  const renderBodyAccessory = () => {
    const bodyId = customization?.body || 'body_none';
    switch (bodyId) {
      case 'body_tub':
        return (
          <div className="absolute -bottom-2 -left-2 -right-2 bg-amber-800 border-2 border-amber-900 rounded-b-2xl h-10 flex items-center justify-around px-2 z-15 shadow-sm">
            <span className="text-[10px] text-amber-200 font-bold">♨️ 温泉</span>
            <span className="text-sm">💧</span>
          </div>
        );
      case 'body_donut':
        return (
          <div className="absolute -bottom-2 -left-3 -right-3 bg-pink-400 border-2 border-pink-500 rounded-full h-9 flex items-center justify-center z-15 shadow-sm text-sm">
            🍩 草莓泳圈
          </div>
        );
      case 'body_backpack':
        return (
          <div className="absolute top-8 -right-2 bg-emerald-700 text-emerald-100 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md z-10 border border-emerald-800">
            🐢
          </div>
        );
      case 'body_bib':
        return (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-amber-100 border border-amber-300 rounded-b-xl px-2 py-0.5 text-[10px] font-bold text-amber-800 z-15 shadow-xs">
            🥕 吃货
          </div>
        );
      case 'body_cape':
        return (
          <div className="absolute top-4 -left-3 w-4 h-16 bg-red-500 rounded-l-md shadow-md z-0 transform -rotate-12">
            ⭐
          </div>
        );
      default:
        return null;
    }
  };

  // Companion
  const renderCompanion = () => {
    const compId = customization?.companion || 'comp_none';
    switch (compId) {
      case 'comp_ducky':
        return (
          <motion.div
            animate={{ x: [0, 4, 0], y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="absolute -bottom-1 -right-6 text-2xl select-none z-20"
          >
            🦆
          </motion.div>
        );
      case 'comp_turtle':
        return (
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -bottom-1 -left-6 text-2xl select-none z-20"
          >
            🐢
          </motion.div>
        );
      case 'comp_bird':
        return (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="absolute top-1 -right-4 text-xl select-none z-20"
          >
            🐦
          </motion.div>
        );
      case 'comp_butterfly':
        return (
          <motion.div
            animate={{ x: [0, 6, -3, 0], y: [0, -6, 2, 0] }}
            transition={{ repeat: Infinity, duration: 3.5 }}
            className="absolute -top-2 -right-5 text-xl select-none z-20"
          >
            🦋
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none" id="capybara-mascot-wrapper">
      {/* Speech Bubble */}
      <AnimatePresence>
        {(showSpeechBubble || currentBubble) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-14 z-30 max-w-xs bg-amber-50 border-2 border-amber-300 text-amber-950 font-bold px-3 py-1.5 rounded-2xl shadow-lg text-xs md:text-sm text-center pointer-events-none whitespace-pre-line"
          >
            {currentBubble}
            {/* Bubble arrow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-amber-300" />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-5 border-x-transparent border-t-5 border-t-amber-50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Capybara Character Graphic */}
      <motion.div
        className={`relative ${scaleMap[size]} cursor-pointer flex items-center justify-center transition-transform`}
        animate={
          isBouncing
            ? { scale: [1, 1.18, 0.95, 1.05, 1], rotate: [0, -5, 5, -2, 0] }
            : mood === 'celebrate'
            ? { y: [0, -8, 0], rotate: [-3, 3, -3] }
            : { y: [0, -2, 0] }
        }
        transition={{
          repeat: mood === 'celebrate' ? Infinity : 0,
          duration: mood === 'celebrate' ? 0.8 : 0.4,
          ease: 'easeInOut',
        }}
        onClick={interactive ? handleClick : undefined}
        whileHover={interactive ? { scale: 1.06 } : undefined}
        whileTap={interactive ? { scale: 0.94 } : undefined}
        title={interactive ? '点我摸摸水豚，放松一下！🐾' : undefined}
      >
        {/* Head Accessory */}
        {renderHeadAccessory()}

        {/* Capybara SVG Illustration */}
        <div className="w-full h-full relative flex items-center justify-center">
          <svg
            viewBox="0 0 160 140"
            className="w-full h-full filter drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background hot spring steam if in onsen */}
            {customization?.scene === 'scene_spring' && (
              <g opacity="0.4">
                <path d="M40 30 Q45 20 40 10 Q35 0 40 -10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M120 30 Q125 20 120 10 Q115 0 120 -10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {/* Back Ears */}
            <circle cx="42" cy="42" r="9" fill="#78350F" />
            <circle cx="42" cy="42" r="5" fill="#92400E" />
            <circle cx="118" cy="42" r="9" fill="#78350F" />
            <circle cx="118" cy="42" r="5" fill="#92400E" />

            {/* Main Capybara Body */}
            <rect
              x="30"
              y="36"
              width="100"
              height="82"
              rx="38"
              fill="#A16207" /* warm capybara brown */
              stroke="#78350F"
              strokeWidth="4"
            />

            {/* Belly / Cheeks warm gradient highlight */}
            <ellipse cx="80" cy="85" rx="38" ry="26" fill="#CA8A04" opacity="0.45" />

            {/* Snout Area - iconic square-rounded capybara nose */}
            <rect
              x="52"
              y="54"
              width="56"
              height="44"
              rx="18"
              fill="#B45309"
              stroke="#78350F"
              strokeWidth="3.5"
            />

            {/* Nose Nostrils */}
            <ellipse cx="73" cy="68" rx="3.5" ry="5" fill="#451A03" />
            <ellipse cx="87" cy="68" rx="3.5" ry="5" fill="#451A03" />
            <path d="M75 76 Q80 81 85 76" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

            {/* Eyes - chill, relaxed zen slit or round happy eyes */}
            {mood === 'happy' || mood === 'celebrate' ? (
              // Happy curved eyes
              <g stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M48 58 Q55 52 62 58" />
                <path d="M98 58 Q105 52 112 58" />
              </g>
            ) : mood === 'thinking' ? (
              // Thinking round eyes looking up
              <g>
                <circle cx="55" cy="56" r="4.5" fill="#451A03" />
                <circle cx="53" cy="54" r="1.5" fill="#FFFFFF" />
                <circle cx="105" cy="56" r="4.5" fill="#451A03" />
                <circle cx="103" cy="54" r="1.5" fill="#FFFFFF" />
              </g>
            ) : (
              // Calm relaxed capybara eyes
              <g stroke="#451A03" strokeWidth="3.5" strokeLinecap="round">
                <line x1="48" y1="58" x2="62" y2="58" />
                <line x1="98" y1="58" x2="112" y2="58" />
              </g>
            )}

            {/* Cute Rosy Cheeks */}
            <circle cx="44" cy="74" r="7" fill="#F87171" opacity="0.6" />
            <circle cx="116" cy="74" r="7" fill="#F87171" opacity="0.6" />

            {/* Paws */}
            <ellipse cx="58" cy="116" rx="10" ry="7" fill="#78350F" />
            <ellipse cx="102" cy="116" rx="10" ry="7" fill="#78350F" />
          </svg>
        </div>

        {/* Body Accessory */}
        {renderBodyAccessory()}

        {/* Companion */}
        {renderCompanion()}
      </motion.div>

      {/* Interactive Helper Prompt */}
      {interactive && size !== 'sm' && (
        <span className="text-[11px] font-bold text-amber-800/80 mt-1 hover:text-amber-900 transition-colors">
          🐾 摸摸水豚 (+自信)
        </span>
      )}
    </div>
  );
};
