import React, { useState, useEffect } from 'react';
import { AppTab, UserStats } from './types';
import { Navbar } from './components/Navbar';
import { ConceptExplorer } from './components/ConceptExplorer';
import { PracticeQuiz } from './components/PracticeQuiz';
import { SharingGame } from './components/SharingGame';
import { BalloonGame } from './components/BalloonGame';
import { TimesTableGrid } from './components/TimesTableGrid';
import { CapybaraDressingRoom } from './components/CapybaraDressingRoom';
import { RewardModal } from './components/RewardModal';
import { CapybaraMascot } from './components/CapybaraMascot';
import { Volume2, Sparkles, Heart } from 'lucide-react';
import { sound } from './utils/audio';

const STORAGE_KEY = 'grade1_capy_math_stats_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('explorer');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [voiceOn, setVoiceOn] = useState<boolean>(true);
  const [showRewardsModal, setShowRewardsModal] = useState<boolean>(false);

  // Initialize stats from localStorage with full Capybara customization state
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      stars: 6, // Start with 6 welcome stars to dress up Capy!
      totalAnswered: 0,
      correctAnswered: 0,
      currentStreak: 0,
      bestStreak: 0,
      confidenceScore: 35,
      capyCustomization: {
        head: 'head_orange',
        body: 'body_none',
        companion: 'comp_duck',
        scene: 'scene_spring',
      },
      unlockedAccessories: [
        'head_none',
        'head_orange',
        'body_none',
        'comp_none',
        'comp_duck',
        'scene_spring',
      ],
      unlockedBadges: ['b1'],
      mistakes: [],
    };
  });

  // Save stats on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userStats));
    } catch {
      // ignore
    }
  }, [userStats]);

  return (
    <div className="min-h-screen bg-amber-50/40 text-amber-950 flex flex-col selection:bg-amber-200">
      {/* Background Decorative Soft Warm Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-emerald-100/30 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stars={userStats.stars}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        voiceOn={voiceOn}
        setVoiceOn={setVoiceOn}
        onOpenRewards={() => setShowRewardsModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* Child Friendly Welcome Banner for Grade 1 */}
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-md border-2 border-amber-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-xs flex items-center justify-center text-2xl shrink-0 border border-white/30">
              🐾
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
                <span>卡皮巴拉的小学一年级乘除乐园</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </h2>
              <p className="text-xs text-amber-100 font-bold">
                乘法是几个几相加，除法是把东西平均分！像水豚一样不慌不忙，快乐长信心～
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-banner-voice-welcome"
              onClick={() => {
                sound.speak('欢迎小朋友来到卡皮巴拉数学乐园！乘法就是几个几相加，除法就是把东西平均分。像水豚一样不慌不忙，你一定可以学得超棒！');
              }}
              className="px-4 py-2 rounded-2xl bg-white text-amber-950 font-black text-xs shadow-sm hover:bg-amber-50 transition-transform active:scale-95 flex items-center gap-1.5 border border-amber-200 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>🔊 听水豚乐园介绍</span>
            </button>
          </div>
        </div>

        {/* Tab Modules */}
        {activeTab === 'explorer' && <ConceptExplorer />}
        {activeTab === 'practice' && (
          <PracticeQuiz userStats={userStats} setUserStats={setUserStats} />
        )}
        {activeTab === 'sharing-game' && (
          <SharingGame userStats={userStats} setUserStats={setUserStats} />
        )}
        {activeTab === 'balloon-game' && (
          <BalloonGame userStats={userStats} setUserStats={setUserStats} />
        )}
        {activeTab === 'table-chart' && <TimesTableGrid />}
        {activeTab === 'capy-room' && (
          <CapybaraDressingRoom userStats={userStats} setUserStats={setUserStats} />
        )}
      </main>

      {/* Rewards & Badges Modal */}
      <RewardModal
        isOpen={showRewardsModal}
        onClose={() => setShowRewardsModal(false)}
        userStats={userStats}
        setUserStats={setUserStats}
      />

      {/* Footer */}
      <footer className="w-full py-4 border-t border-amber-200/60 bg-white/70 text-center text-xs text-amber-900/80 font-bold">
        <p className="flex items-center justify-center gap-1">
          <span>一年级数学启蒙 · 卡皮巴拉乘法与除法自信养成乐园 🐾</span>
        </p>
      </footer>
    </div>
  );
}
