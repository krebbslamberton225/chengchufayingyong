import React from 'react';
import { AppTab } from '../types';
import { Volume2, VolumeX, Mic, MicOff, Award, BookOpen, Target, Gift, Gamepad2, Shirt } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  stars: number;
  soundOn: boolean;
  setSoundOn: (val: boolean) => void;
  voiceOn: boolean;
  setVoiceOn: (val: boolean) => void;
  onOpenRewards: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stars,
  soundOn,
  setSoundOn,
  voiceOn,
  setVoiceOn,
  onOpenRewards,
}) => {
  const tabs = [
    { id: 'explorer' as AppTab, label: '水豚探索', icon: BookOpen, color: 'text-amber-800 bg-amber-50/80 hover:bg-amber-100 border-amber-200' },
    { id: 'practice' as AppTab, label: '自信闯关', icon: Target, color: 'text-orange-800 bg-orange-50/80 hover:bg-orange-100 border-orange-200' },
    { id: 'sharing-game' as AppTab, label: '分水产/水果', icon: Gift, color: 'text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 border-emerald-200' },
    { id: 'balloon-game' as AppTab, label: '泡泡戳戳乐', icon: Gamepad2, color: 'text-pink-800 bg-pink-50/80 hover:bg-pink-100 border-pink-200' },
    { id: 'table-chart' as AppTab, label: '口诀图解', icon: Award, color: 'text-yellow-800 bg-yellow-50/80 hover:bg-yellow-100 border-yellow-200' },
    { id: 'capy-room' as AppTab, label: '水豚衣帽间', icon: Shirt, color: 'text-amber-900 bg-amber-100/90 hover:bg-amber-200 border-amber-300' },
  ];

  return (
    <header className="w-full bg-[#FFFBF5]/95 backdrop-blur-md border-b-2 border-amber-200/80 sticky top-0 z-30 shadow-xs" id="app-navbar">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Capybara Cute Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => {
            sound.playCapySqueak();
            sound.speak('欢迎来到卡皮巴拉一年级乘除法乐园！');
          }}
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-sm border-2 border-amber-600 group-hover:scale-105 transition-transform">
            🍊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-amber-950 tracking-tight">卡皮巴拉数学乐园</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold border border-amber-300">
                一年级乘除法
              </span>
            </div>
            <p className="text-xs text-amber-800/80 font-bold hidden sm:block">
              心态放平 · 看图识乘除 · 暖心鼓励式学习
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => {
                  sound.playPop();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs md:text-sm font-black transition-all select-none whitespace-nowrap border-2 ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-300/60 scale-102'
                    : `${tab.color} text-amber-900`
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-800'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tools: Stars, Sound, Voice, Badges */}
        <div className="flex items-center gap-2">
          {/* Star Counter & Reward Modal Trigger */}
          <button
            id="btn-rewards-star-counter"
            onClick={() => {
              sound.playPop();
              onOpenRewards();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-100/90 border-2 border-amber-300 hover:bg-amber-200 transition-all shadow-xs group"
            title="查看我的小金星、奖状与自信心"
          >
            <span className="text-lg animate-bounce">⭐</span>
            <span className="font-black text-amber-950 text-sm">{stars}</span>
            <Award className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform ml-0.5" />
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              sound.setSoundEnabled(next);
              if (next) sound.playPop();
            }}
            className={`p-2 rounded-2xl border-2 transition-colors ${
              soundOn
                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                : 'bg-rose-50 text-rose-400 border-rose-200 hover:bg-rose-100'
            }`}
            title={soundOn ? '音效已开启' : '音效已静音'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Voice Toggle */}
          <button
            id="btn-toggle-voice"
            onClick={() => {
              const next = !voiceOn;
              setVoiceOn(next);
              sound.setVoiceEnabled(next);
              if (next) {
                sound.speak('卡皮巴拉语音伴读已开启');
              }
            }}
            className={`p-2 rounded-2xl border-2 transition-colors ${
              voiceOn
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-400 border-rose-200 hover:bg-rose-100'
            }`}
            title={voiceOn ? '水豚语音伴读已开启' : '语音已关闭'}
          >
            {voiceOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
