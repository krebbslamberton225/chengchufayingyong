export type AppTab = 'explorer' | 'practice' | 'sharing-game' | 'balloon-game' | 'table-chart' | 'capy-room';

export type MathOperation = 'multiply' | 'divide' | 'both';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface VisualTheme {
  id: string;
  name: string;
  emoji: string;
  unit: string;
  singular: string;
}

export interface Question {
  id: string;
  type: 'multiply' | 'divide';
  num1: number; // For multiply: groups; For divide: total items
  num2: number; // For multiply: items per group; For divide: number of groups (or items per group)
  answer: number;
  options: number[];
  promptText: string;
  repeatedAdditionText?: string;
  theme: VisualTheme;
  storyContext?: string;
}

export interface CapyAccessory {
  id: string;
  name: string;
  category: 'head' | 'body' | 'companion' | 'scene';
  icon: string;
  cost: number;
  unlocked: boolean;
  description: string;
}

export interface UserStats {
  stars: number;
  totalAnswered: number;
  correctAnswered: number;
  currentStreak: number;
  bestStreak: number;
  confidenceScore: number; // 0 - 100 confidence meter
  unlockedBadges: string[];
  mistakes: Question[];
  capyCustomization: {
    head: string; // accessory id
    body: string;
    companion: string;
    scene: string;
  };
  unlockedAccessories: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredStars: number;
  capyQuote: string;
}
