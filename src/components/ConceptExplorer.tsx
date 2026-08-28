import React, { useState } from 'react';
import { VISUAL_THEMES } from '../utils/mathGenerator';
import { VisualTheme } from '../types';
import { Volume2, Sparkles, RefreshCw, HelpCircle, Heart } from 'lucide-react';
import { sound } from '../utils/audio';
import { CapybaraMascot } from './CapybaraMascot';

interface ConceptExplorerProps {
  onGainConfidence?: (amount: number) => void;
  capyCustomization?: {
    head: string;
    body: string;
    companion: string;
    scene: string;
  };
}

export const ConceptExplorer: React.FC<ConceptExplorerProps> = ({
  onGainConfidence,
  capyCustomization,
}) => {
  const [mode, setMode] = useState<'multiply' | 'divide'>('multiply');
  const [selectedTheme, setSelectedTheme] = useState<VisualTheme>(VISUAL_THEMES[0]);

  // Multiplication state
  const [multGroups, setMultGroups] = useState<number>(3); // 几个盘子/小水豚
  const [multItemsPerGroup, setMultItemsPerGroup] = useState<number>(2); // 每盘几个

  // Division state
  const [divTotal, setDivTotal] = useState<number>(8); // 一共几个
  const [divGroups, setDivGroups] = useState<number>(4); // 分成几盘
  const [isDistributing, setIsDistributing] = useState<boolean>(false);
  const [distributedCount, setDistributedCount] = useState<number>(8);
  const [mascotBubble, setMascotBubble] = useState<string>('看！乘法就是把好几盘一样的美味打包～🐾');

  const multTotal = multGroups * multItemsPerGroup;
  const divItemsPerGroup = Math.floor(divTotal / divGroups);
  const divRemainder = divTotal % divGroups;

  // Speak explanation for Multiplication
  const handleSpeakMult = () => {
    const text = `有 ${multGroups} 个水豚小盘子，每盘有 ${multItemsPerGroup} 个${selectedTheme.singular}。连加算式是：${Array(multGroups).fill(multItemsPerGroup).join('加')}等于${multTotal}。乘法算式是：${multItemsPerGroup}乘${multGroups}等于${multTotal}。表示${multGroups}个${multItemsPerGroup}相加！`;
    sound.speak(text);
    setMascotBubble(`乘法是算连加的超级快车！${multGroups}个${multItemsPerGroup}等于${multTotal}！🍊`);
    if (onGainConfidence) onGainConfidence(5);
  };

  // Speak explanation for Division
  const handleSpeakDiv = () => {
    let text = `一共有 ${divTotal} 个${selectedTheme.singular}，平均分到 ${divGroups} 个小盘子里。`;
    if (divRemainder === 0) {
      text += `每个盘子正好分到 ${divItemsPerGroup} 个${selectedTheme.singular}。除法算式是：${divTotal}除以${divGroups}等于${divItemsPerGroup}！因为${divGroups}乘${divItemsPerGroup}等于${divTotal}，所以${divTotal}除以${divGroups}等于${divItemsPerGroup}。`;
      setMascotBubble(`平均分太公平啦！每只小水豚都能分到 ${divItemsPerGroup} 个！🍉`);
    } else {
      text += `每个盘子分到 ${divItemsPerGroup} 个，还剩下 ${divRemainder} 个分不匀哦！`;
      setMascotBubble(`还剩下 ${divRemainder} 个分不匀，挑个能整除的数字再试一次吧～✨`);
    }
    sound.speak(text);
    if (onGainConfidence) onGainConfidence(5);
  };

  // Trigger step by step distribution animation
  const handleDistributeStep = () => {
    sound.playPop();
    setIsDistributing(true);
    setDistributedCount(0);
    setMascotBubble('正在一个一个分发中...好期待呀！💧');

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setDistributedCount(count);
      sound.playPop();
      if (count >= divTotal) {
        clearInterval(interval);
        setIsDistributing(false);
        sound.playCorrect();
        setMascotBubble(`分好啦！每盘 ${divItemsPerGroup} 个，超公平！🎉`);
        if (onGainConfidence) onGainConfidence(5);
      }
    }, 150);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-8" id="concept-explorer-tab">
      {/* Top Capybara Guide Banner */}
      <div className="bg-amber-100/90 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CapybaraMascot
            size="sm"
            mood="happy"
            customization={capyCustomization}
            interactive={false}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                卡皮巴拉概念小讲堂
              </span>
            </div>
            <p className="text-sm font-black text-amber-950 mt-0.5">
              {mascotBubble}
            </p>
          </div>
        </div>

        {/* Theme Fruit / Item Switcher */}
        <div className="flex items-center gap-2 bg-white/90 border border-amber-200 px-3 py-1.5 rounded-2xl shadow-2xs">
          <span className="text-xs font-bold text-amber-900 whitespace-nowrap">换道具：</span>
          <div className="flex gap-1.5 overflow-x-auto py-0.5">
            {VISUAL_THEMES.slice(0, 6).map((theme) => (
              <button
                key={theme.id}
                id={`theme-btn-${theme.id}`}
                onClick={() => {
                  sound.playPop();
                  setSelectedTheme(theme);
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-transform ${
                  selectedTheme.id === theme.id
                    ? 'bg-amber-200 ring-2 ring-amber-500 scale-110'
                    : 'bg-amber-50/60 hover:bg-amber-100 opacity-80 hover:opacity-100'
                }`}
                title={theme.name}
              >
                {theme.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Switch Mode Tabs */}
      <div className="flex p-1.5 bg-amber-100/80 rounded-2xl border-2 border-amber-300 w-fit mx-auto shadow-xs">
        <button
          id="tab-concept-multiply"
          onClick={() => {
            sound.playPop();
            setMode('multiply');
            setMascotBubble('乘法就是把几个相同的组加在一起！试着拉动滑块看看～🍊');
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${
            mode === 'multiply'
              ? 'bg-amber-500 text-white shadow-md border-2 border-amber-600 scale-102'
              : 'text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          <span>✖️ 乘法探索 (几个几相加)</span>
        </button>
        <button
          id="tab-concept-divide"
          onClick={() => {
            sound.playPop();
            setMode('divide');
            setMascotBubble('除法就是把大家心爱的果实平均分一分，谁也不多谁也不少！🍉');
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${
            mode === 'divide'
              ? 'bg-amber-500 text-white shadow-md border-2 border-amber-600 scale-102'
              : 'text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          <span>➗ 除法探索 (公平平均分)</span>
        </button>
      </div>

      {/* MULTIPLICATION EXPLORER */}
      {mode === 'multiply' && (
        <div className="space-y-6">
          {/* Sliders Card */}
          <div className="bg-white/95 rounded-3xl p-6 border-2 border-amber-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Group Count Slider */}
              <div className="bg-amber-50/90 p-4 rounded-2xl border-2 border-amber-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                    <span>🍽️</span> 盘子数量（几个组）：
                  </span>
                  <span className="text-xl font-black text-amber-700 bg-white px-3 py-0.5 rounded-xl border border-amber-300 shadow-2xs">
                    {multGroups} 盘
                  </span>
                </div>
                <input
                  id="slider-mult-groups"
                  type="range"
                  min="1"
                  max="6"
                  value={multGroups}
                  onChange={(e) => {
                    setMultGroups(parseInt(e.target.value));
                    sound.playPop();
                  }}
                  className="w-full h-3.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-amber-800 font-extrabold mt-1 px-1">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
              </div>

              {/* Items Per Group Slider */}
              <div className="bg-orange-50/90 p-4 rounded-2xl border-2 border-orange-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-orange-950 flex items-center gap-1.5">
                    <span>{selectedTheme.emoji}</span> 每盘放几个{selectedTheme.singular}：
                  </span>
                  <span className="text-xl font-black text-orange-700 bg-white px-3 py-0.5 rounded-xl border border-orange-300 shadow-2xs">
                    {multItemsPerGroup} {selectedTheme.unit}
                  </span>
                </div>
                <input
                  id="slider-mult-items"
                  type="range"
                  min="1"
                  max="6"
                  value={multItemsPerGroup}
                  onChange={(e) => {
                    setMultItemsPerGroup(parseInt(e.target.value));
                    sound.playPop();
                  }}
                  className="w-full h-3.5 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-orange-800 font-extrabold mt-1 px-1">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Display Stage */}
          <div className="bg-gradient-to-b from-amber-50/80 to-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-amber-950">🐾 水豚实物小餐台</span>
                <span className="text-xs bg-amber-200 text-amber-900 font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                  {multGroups} 个 {multItemsPerGroup}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  id="btn-speak-mult"
                  onClick={handleSpeakMult}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-transform active:scale-95 border border-amber-600"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>🔊 听讲解 (+5自信)</span>
                </button>
                <button
                  id="btn-random-mult"
                  onClick={() => {
                    sound.playPop();
                    const g = Math.floor(Math.random() * 4) + 2;
                    const i = Math.floor(Math.random() * 4) + 2;
                    setMultGroups(g);
                    setMultItemsPerGroup(i);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 font-black text-xs border border-amber-300 transition-colors shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>随机换题</span>
                </button>
              </div>
            </div>

            {/* Visual Plates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[160px] p-4 bg-amber-100/40 rounded-2xl border-2 border-dashed border-amber-300">
              {Array.from({ length: multGroups }).map((_, plateIdx) => (
                <div
                  key={plateIdx}
                  className="relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-amber-200 shadow-xs transition-all hover:scale-102"
                >
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-2xs font-black text-amber-900 shadow-2xs">
                    第 {plateIdx + 1} 盘
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 my-3 min-h-[52px]">
                    {Array.from({ length: multItemsPerGroup }).map((_, itemIdx) => (
                      <span
                        key={itemIdx}
                        className="text-3xl select-none transform hover:scale-130 transition-transform cursor-pointer drop-shadow-sm"
                        title={`点击摸摸 ${selectedTheme.singular}`}
                        onClick={() => sound.playPop()}
                      >
                        {selectedTheme.emoji}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-black text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {multItemsPerGroup} {selectedTheme.unit}
                  </span>
                </div>
              ))}
            </div>

            {/* Step by Step Mathematical Translation */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1: Repeated Addition */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 mb-1">
                    <span className="w-5 h-5 rounded-full bg-amber-300 text-amber-950 flex items-center justify-center text-xs font-black">1</span>
                    <span>连加算式（数一数）</span>
                  </div>
                  <p className="text-xs text-amber-800 mb-2">把每一盘的加起来：</p>
                </div>
                <div className="text-center py-2 px-3 bg-white rounded-xl border border-amber-300 font-mono text-base font-black text-amber-950 tracking-wide shadow-2xs">
                  {Array(multGroups).fill(multItemsPerGroup).join(' + ')} = <span className="text-amber-600 text-lg">{multTotal}</span>
                </div>
              </div>

              {/* Step 2: Multiplication Formula */}
              <div className="p-4 rounded-2xl bg-orange-50/90 border-2 border-orange-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-orange-950 mb-1">
                    <span className="w-5 h-5 rounded-full bg-orange-300 text-orange-950 flex items-center justify-center text-xs font-black">2</span>
                    <span>乘法算式（更简便）</span>
                  </div>
                  <p className="text-xs text-orange-850 mb-2">{multGroups} 个 {multItemsPerGroup} 相加：</p>
                </div>
                <div className="text-center py-2 px-3 bg-white rounded-xl border border-orange-300 font-mono text-base font-black text-orange-950 tracking-wide shadow-2xs">
                  {multItemsPerGroup} × {multGroups} = <span className="text-orange-600 text-lg">{multTotal}</span>
                </div>
              </div>

              {/* Step 3: Grade 1 Explanation */}
              <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-300 text-emerald-950 flex items-center justify-center text-xs font-black">3</span>
                    <span>水豚口诀心法</span>
                  </div>
                  <p className="text-xs text-emerald-800 mb-2">乘法是连加的好帮手：</p>
                </div>
                <div className="py-2 px-3 bg-white rounded-xl border border-emerald-300 text-xs font-bold text-emerald-950 shadow-2xs">
                  <p className="font-black text-emerald-800">“{multGroups} 个 {multItemsPerGroup} 是 {multTotal}”</p>
                  <p className="text-2xs text-stone-600 mt-0.5">读作：{multItemsPerGroup} 乘 {multGroups} 等于 {multTotal}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIVISION EXPLORER */}
      {mode === 'divide' && (
        <div className="space-y-6">
          {/* Sliders Card */}
          <div className="bg-white/95 rounded-3xl p-6 border-2 border-amber-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total items slider */}
              <div className="bg-amber-50/90 p-4 rounded-2xl border-2 border-amber-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                    <span>🧺</span> 一共有多少个{selectedTheme.singular}：
                  </span>
                  <span className="text-xl font-black text-amber-700 bg-white px-3 py-0.5 rounded-xl border border-amber-300 shadow-2xs">
                    {divTotal} {selectedTheme.unit}
                  </span>
                </div>
                <input
                  id="slider-div-total"
                  type="range"
                  min="2"
                  max="18"
                  step="2"
                  value={divTotal}
                  onChange={(e) => {
                    setDivTotal(parseInt(e.target.value));
                    setDistributedCount(parseInt(e.target.value));
                    sound.playPop();
                  }}
                  className="w-full h-3.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-amber-800 font-black mt-1 px-1">
                  {[2, 4, 6, 8, 10, 12, 14, 16, 18].map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
              </div>

              {/* Group / plates count slider */}
              <div className="bg-emerald-50/90 p-4 rounded-2xl border-2 border-emerald-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                    <span>🍽️</span> 平均分到几个盘子（份数）：
                  </span>
                  <span className="text-xl font-black text-emerald-700 bg-white px-3 py-0.5 rounded-xl border border-emerald-300 shadow-2xs">
                    {divGroups} 盘
                  </span>
                </div>
                <input
                  id="slider-div-groups"
                  type="range"
                  min="2"
                  max="6"
                  value={divGroups}
                  onChange={(e) => {
                    setDivGroups(parseInt(e.target.value));
                    sound.playPop();
                  }}
                  className="w-full h-3.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-emerald-800 font-black mt-1 px-1">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visual Display Stage */}
          <div className="bg-gradient-to-b from-emerald-50/60 to-white rounded-3xl p-6 border-2 border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-emerald-950">🐾 公平平均分展示台</span>
                <span className="text-xs bg-emerald-200 text-emerald-950 font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                  把 {divTotal} 个{selectedTheme.singular} 平均分成 {divGroups} 份
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  id="btn-distribute-anim"
                  onClick={handleDistributeStep}
                  disabled={isDistributing}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-transform active:scale-95 disabled:opacity-50 border border-emerald-700"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ 动态分一分 (+5自信)</span>
                </button>
                <button
                  id="btn-speak-div"
                  onClick={handleSpeakDiv}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-transform active:scale-95 border border-amber-600"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>🔊 听讲解</span>
                </button>
              </div>
            </div>

            {/* Remaining alert if not divisible */}
            {divRemainder > 0 && (
              <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-2xl flex items-center gap-2 text-xs text-amber-900 font-bold">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  提示：{divTotal} 个{selectedTheme.singular}分给 {divGroups} 个盘子，每盘分 {divItemsPerGroup} 个，还剩下 <strong>{divRemainder}</strong> 个无法均分哦！建议选择能整除的数字体验更棒。
                </span>
              </div>
            )}

            {/* Visual Plates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[160px] p-4 bg-emerald-100/40 rounded-2xl border-2 border-dashed border-emerald-300">
              {Array.from({ length: divGroups }).map((_, plateIdx) => {
                let itemsInThisPlate = 0;
                for (let i = 0; i < distributedCount; i++) {
                  if (i % divGroups === plateIdx) {
                    itemsInThisPlate++;
                  }
                }

                return (
                  <div
                    key={plateIdx}
                    className="relative flex flex-col items-center justify-center p-4 rounded-2xl bg-white border-2 border-emerald-200 shadow-xs transition-all hover:scale-102"
                  >
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-2xs font-black text-emerald-900 shadow-2xs">
                      第 {plateIdx + 1} 盘
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 my-3 min-h-[52px]">
                      {Array.from({ length: itemsInThisPlate }).map((_, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="text-3xl select-none drop-shadow-sm cursor-pointer hover:scale-130 transition-transform"
                          onClick={() => sound.playPop()}
                        >
                          {selectedTheme.emoji}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-black text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      分到了 {itemsInThisPlate} {selectedTheme.unit}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Step by step Division Explanation */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 mb-1">
                    <span className="w-5 h-5 rounded-full bg-amber-300 text-amber-950 flex items-center justify-center text-xs font-black">1</span>
                    <span>分一分（平均分）</span>
                  </div>
                  <p className="text-xs text-amber-800 mb-2">每个盘子分得同样多：</p>
                </div>
                <div className="text-center py-2 px-3 bg-white rounded-xl border border-amber-300 text-xs font-black text-amber-950 shadow-2xs">
                  {divTotal} 个{selectedTheme.singular} ➔ {divGroups} 盘 ➔ 每盘 <span className="text-amber-600 text-base">{divItemsPerGroup}</span> 个
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-300 text-emerald-950 flex items-center justify-center text-xs font-black">2</span>
                    <span>除法算式</span>
                  </div>
                  <p className="text-xs text-emerald-800 mb-2">总数 ÷ 盘子数 = 每盘数量：</p>
                </div>
                <div className="text-center py-2 px-3 bg-white rounded-xl border border-emerald-300 font-mono text-base font-black text-emerald-950 tracking-wide shadow-2xs">
                  {divTotal} ÷ {divGroups} = <span className="text-emerald-600 text-lg">{divItemsPerGroup}</span>
                  {divRemainder > 0 && <span className="text-xs text-amber-700 font-normal"> 余{divRemainder}</span>}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/90 border-2 border-orange-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-orange-950 mb-1">
                    <span className="w-5 h-5 rounded-full bg-orange-300 text-orange-950 flex items-center justify-center text-xs font-black">3</span>
                    <span>乘除好朋友（口诀法）</span>
                  </div>
                  <p className="text-xs text-orange-850 mb-2">想乘法做除法：</p>
                </div>
                <div className="py-2 px-3 bg-white rounded-xl border border-orange-300 text-xs font-black text-orange-950 shadow-2xs">
                  <p className="font-black text-orange-800">想：( ) × {divGroups} = {divTotal}</p>
                  <p className="text-2xs text-stone-600 mt-0.5">因为 {divItemsPerGroup} × {divGroups} = {divTotal}，所以结果是 {divItemsPerGroup}！</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
