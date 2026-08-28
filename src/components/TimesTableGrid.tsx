import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Volume2, Sparkles } from 'lucide-react';
import { CapybaraMascot } from './CapybaraMascot';

interface TimesFact {
  a: number;
  b: number;
  product: number;
  rhyme: string;
}

const CHINESE_NUMS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function getRhyme(a: number, b: number): string {
  const p = a * b;
  const aStr = CHINESE_NUMS[a];
  const bStr = CHINESE_NUMS[b];
  if (p < 10) {
    return `${aStr}${bStr}得${CHINESE_NUMS[p]}`;
  } else if (p === 10) {
    return `${aStr}${bStr}一十`;
  } else if (p < 20) {
    return `${aStr}${bStr}十几`.replace('几', CHINESE_NUMS[p % 10] || '');
  } else {
    const tens = Math.floor(p / 10);
    const units = p % 10;
    return `${aStr}${bStr}${CHINESE_NUMS[tens]}十${units > 0 ? CHINESE_NUMS[units] : ''}`;
  }
}

export const TimesTableGrid: React.FC = () => {
  const [selectedFact, setSelectedFact] = useState<TimesFact | null>({
    a: 2,
    b: 3,
    product: 6,
    rhyme: '二三得六',
  });
  const [tableLimit, setTableLimit] = useState<number>(5); // 1~5 for grade 1 standard, or 1~9 for advanced

  const handleSelectFact = (a: number, b: number) => {
    sound.playPop();
    const product = a * b;
    const rhyme = getRhyme(a, b);
    setSelectedFact({ a, b, product, rhyme });
  };

  const handleSpeakFact = () => {
    if (!selectedFact) return;
    const text = `口诀：${selectedFact.rhyme}。${selectedFact.a}乘${selectedFact.b}等于${selectedFact.product}。对应除法算式是：${selectedFact.product}除以${selectedFact.a}等于${selectedFact.b}，${selectedFact.product}除以${selectedFact.b}等于${selectedFact.a}！`;
    sound.speak(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12" id="times-table-tab">
      {/* Top Controls Bar */}
      <div className="bg-white/95 rounded-3xl p-5 border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center text-2xl font-bold shadow-2xs">
            📜
          </div>
          <div>
            <h2 className="text-base font-black text-amber-950">卡皮巴拉口诀与除法图解表</h2>
            <p className="text-xs text-amber-800/80 font-bold">点击任意算式查看水豚实物图解与乘除好朋友</p>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-950">范围：</span>
          <div className="flex bg-amber-50 p-1 rounded-2xl border border-amber-200">
            <button
              id="table-range-5"
              onClick={() => {
                sound.playPop();
                setTableLimit(5);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
                tableLimit === 5
                  ? 'bg-amber-500 text-white shadow-2xs border border-amber-600'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              🌱 一年级基础 (1~5表)
            </button>
            <button
              id="table-range-9"
              onClick={() => {
                sound.playPop();
                setTableLimit(9);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ${
                tableLimit === 9
                  ? 'bg-amber-500 text-white shadow-2xs border border-amber-600'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              🚀 九九全表 (1~9表)
            </button>
          </div>
        </div>
      </div>

      {/* Selected Fact Visual Breakdown Stage */}
      {selectedFact && (
        <div className="bg-gradient-to-b from-amber-50/80 to-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 bg-amber-200 text-amber-950 font-black text-sm rounded-full border border-amber-300">
                ⭐️ {selectedFact.rhyme}
              </span>
              <span className="text-xs text-amber-800 font-bold">水豚口诀图解卡</span>
            </div>
            <button
              id="btn-speak-table-fact"
              onClick={handleSpeakFact}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-xs transition-transform active:scale-95 border border-amber-600"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 听口诀朗读</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Visual plates */}
            <div className="p-4 bg-white rounded-2xl border-2 border-amber-200 shadow-2xs flex flex-col items-center justify-center">
              <span className="text-xs font-black text-amber-950 mb-2">
                🍊 水豚果盘：{selectedFact.a} 盘，每盘 {selectedFact.b} 颗金桔
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3 my-2">
                {Array.from({ length: selectedFact.a }).map((_, p) => (
                  <div key={p} className="p-2 bg-amber-50 rounded-xl border border-dashed border-amber-300 flex gap-1 items-center">
                    {Array.from({ length: selectedFact.b }).map((_, i) => (
                      <span key={i} className="text-2xl select-none" onClick={() => sound.playPop()}>🍊</span>
                    ))}
                  </div>
                ))}
              </div>
              <span className="text-xs font-black text-amber-800 mt-1">
                一共 {selectedFact.product} 颗金桔
              </span>
            </div>

            {/* Repeated Addition & Multiplication */}
            <div className="p-4 bg-orange-50/80 rounded-2xl border-2 border-orange-200 shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-black text-orange-950">✖️ 乘法与连加：</span>
              <div className="my-2 space-y-1">
                <div className="text-xs text-orange-900 font-bold">
                  连加：{Array(selectedFact.a).fill(selectedFact.b).join(' + ')} = <span className="font-black text-orange-600">{selectedFact.product}</span>
                </div>
                <div className="text-base font-mono font-black text-orange-950">
                  算式：{selectedFact.a} × {selectedFact.b} = <span className="text-lg text-orange-600">{selectedFact.product}</span>
                </div>
              </div>
              <p className="text-2xs text-orange-800 font-bold">表示 {selectedFact.a} 个 {selectedFact.b} 相加</p>
            </div>

            {/* Division Twin Facts */}
            <div className="p-4 bg-emerald-50/80 rounded-2xl border-2 border-emerald-200 shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-black text-emerald-950">➗ 乘除好朋友（除法算式）：</span>
              <div className="my-2 space-y-1.5 font-mono text-sm font-black text-emerald-950">
                <div className="p-1.5 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  {selectedFact.product} ÷ {selectedFact.a} = <span className="text-emerald-600 font-black">{selectedFact.b}</span>
                </div>
                <div className="p-1.5 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  {selectedFact.product} ÷ {selectedFact.b} = <span className="text-emerald-600 font-black">{selectedFact.a}</span>
                </div>
              </div>
              <p className="text-2xs text-emerald-800 font-bold">记住一句口诀，立刻搞定两道除法！</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of times table formulas */}
      <div className="bg-white/95 rounded-3xl p-6 border-2 border-amber-200 shadow-sm overflow-x-auto">
        <div className="space-y-3 min-w-[560px]">
          {Array.from({ length: tableLimit }).map((_, rowIdx) => {
            const row = rowIdx + 1;
            return (
              <div key={row} className="flex gap-2">
                {Array.from({ length: row }).map((_, colIdx) => {
                  const col = colIdx + 1;
                  const isSelected = selectedFact?.a === col && selectedFact?.b === row;
                  const rhyme = getRhyme(col, row);

                  return (
                    <button
                      key={col}
                      id={`fact-${col}-${row}`}
                      onClick={() => handleSelectFact(col, row)}
                      className={`flex-1 p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-102 font-black'
                          : 'bg-amber-50/50 hover:bg-amber-100 border-amber-200 text-amber-950 hover:border-amber-400 font-bold'
                      }`}
                    >
                      <div className="text-xs font-black leading-tight">{rhyme}</div>
                      <div className={`text-2xs font-mono mt-0.5 ${isSelected ? 'text-amber-100' : 'text-amber-800'}`}>
                        {col}×{row}={col * row}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
