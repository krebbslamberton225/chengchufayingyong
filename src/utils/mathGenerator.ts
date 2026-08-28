import { VisualTheme, Question, DifficultyLevel, MathOperation } from '../types';

export const VISUAL_THEMES: VisualTheme[] = [
  { id: 'capy_orange', name: '水豚小金桔', emoji: '🍊', unit: '个', singular: '金桔' },
  { id: 'capy_watermelon', name: '大西瓜片', emoji: '🍉', unit: '块', singular: '西瓜' },
  { id: 'capy_carrot', name: '脆脆胡萝卜', emoji: '🥕', unit: '根', singular: '胡萝卜' },
  { id: 'capy_duck', name: '温泉小黄鸭', emoji: '🐥', unit: '只', singular: '小黄鸭' },
  { id: 'capy_cookie', name: '水豚小饼干', emoji: '🍪', unit: '块', singular: '饼干' },
  { id: 'capy_grass', name: '鲜嫩草料团', emoji: '🌿', unit: '团', singular: '草料' },
  { id: 'capy_donut', name: '甜甜圈泳圈', emoji: '🍩', unit: '个', singular: '泳圈' },
  { id: 'capy_apple', name: '甜甜红苹果', emoji: '🍎', unit: '个', singular: '苹果' },
  { id: 'capy_star', name: '闪亮小金星', emoji: '⭐', unit: '颗', singular: '金星' },
];

// Helper to shuffle array
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate distractors close to true answer
function generateDistractors(answer: number, count: number = 3): number[] {
  const options = new Set<number>([answer]);
  const candidates = [
    answer + 1,
    answer - 1,
    answer + 2,
    answer - 2,
    answer + 3,
    answer - 3,
    answer * 2,
    Math.max(1, Math.floor(answer / 2)),
  ].filter(n => n > 0 && n !== answer);

  const shuffled = shuffleArray(candidates);
  for (const cand of shuffled) {
    options.add(cand);
    if (options.size >= count + 1) break;
  }

  // Fallback if not enough
  let fallback = 1;
  while (options.size < count + 1) {
    if (!options.has(fallback) && fallback !== answer) {
      options.add(fallback);
    }
    fallback++;
  }

  return shuffleArray(Array.from(options));
}

export function generateQuestion(
  level: DifficultyLevel = 'easy',
  operation: MathOperation = 'both',
  fixedTheme?: VisualTheme
): Question {
  const theme = fixedTheme || VISUAL_THEMES[Math.floor(Math.random() * VISUAL_THEMES.length)];
  
  let chosenOp: 'multiply' | 'divide';
  if (operation === 'both') {
    chosenOp = Math.random() > 0.5 ? 'multiply' : 'divide';
  } else {
    chosenOp = operation;
  }

  if (chosenOp === 'multiply') {
    let groups = 2;
    let itemsPerGroup = 2;

    if (level === 'easy') {
      // Small numbers: 2-4 groups, 1-3 items (total <= 10)
      const pairs = [
        [2, 2], [2, 3], [3, 2], [2, 4], [4, 2],
        [3, 3], [5, 2], [2, 5], [1, 3], [1, 4], [3, 1]
      ];
      const picked = pairs[Math.floor(Math.random() * pairs.length)];
      groups = picked[0];
      itemsPerGroup = picked[1];
    } else if (level === 'medium') {
      // Medium: 2-5 groups, 2-5 items (total <= 20)
      const pairs = [
        [3, 4], [4, 3], [4, 4], [2, 6], [5, 3], [3, 5],
        [5, 4], [4, 5], [2, 7], [2, 8], [6, 2], [3, 6]
      ];
      const picked = pairs[Math.floor(Math.random() * pairs.length)];
      groups = picked[0];
      itemsPerGroup = picked[1];
    } else {
      // Hard: 2-6 groups, 2-6 items (total <= 36)
      const pairs = [
        [5, 5], [6, 3], [3, 7], [4, 6], [6, 4],
        [5, 6], [6, 5], [3, 8], [4, 7], [2, 9], [7, 3]
      ];
      const picked = pairs[Math.floor(Math.random() * pairs.length)];
      groups = picked[0];
      itemsPerGroup = picked[1];
    }

    const answer = groups * itemsPerGroup;
    const repeatedAddition = Array(groups).fill(itemsPerGroup).join(' + ') + ` = ${answer}`;

    return {
      id: 'q_' + Math.random().toString(36).substring(2, 9),
      type: 'multiply',
      num1: groups,
      num2: itemsPerGroup,
      answer,
      options: generateDistractors(answer),
      promptText: `有 ${groups} 盘${theme.name}，每盘有 ${itemsPerGroup} ${theme.unit}，一共有多少${theme.unit}？`,
      repeatedAdditionText: `${groups}个${itemsPerGroup}相加：${repeatedAddition}`,
      theme,
      storyContext: `${groups} × ${itemsPerGroup} = ?`
    };
  } else {
    // Division: total items divided by groups
    let groups = 2;
    let itemsPerGroup = 2;

    if (level === 'easy') {
      const pairs = [
        [4, 2], [6, 2], [6, 3], [8, 2], [8, 4], [10, 2], [10, 5], [9, 3]
      ];
      const picked = pairs[Math.floor(Math.random() * pairs.length)];
      const total = picked[0];
      groups = picked[1];
      itemsPerGroup = total / groups;
    } else if (level === 'medium') {
      const pairs = [
        [12, 2], [12, 3], [12, 4], [12, 6],
        [15, 3], [15, 5], [16, 4], [16, 2],
        [18, 2], [18, 3], [20, 4], [20, 5]
      ];
      const picked = pairs[Math.floor(Math.random() * pairs.length)];
      const total = picked[0];
      groups = picked[1];
      itemsPerGroup = total / groups;
    } else {
      const pairs = [
        [24, 4], [24, 6], [25, 5], [28, 4], [30, 5], [30, 6], [18, 6], [21, 3], [27, 3]
      ];
      const picked = pairs[Math.floor(Math.random() * pairs.length)];
      const total = picked[0];
      groups = picked[1];
      itemsPerGroup = total / groups;
    }

    const total = groups * itemsPerGroup;
    const answer = itemsPerGroup;

    return {
      id: 'q_' + Math.random().toString(36).substring(2, 9),
      type: 'divide',
      num1: total,
      num2: groups,
      answer,
      options: generateDistractors(answer),
      promptText: `把 ${total} ${theme.unit}${theme.name}平均分到 ${groups} 个盘子里，每个盘子有几个？`,
      repeatedAdditionText: `把 ${total} 平均分成 ${groups} 份，每份是 ${itemsPerGroup}`,
      theme,
      storyContext: `${total} ÷ ${groups} = ?`
    };
  }
}
