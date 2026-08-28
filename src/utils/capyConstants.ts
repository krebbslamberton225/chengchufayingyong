import { CapyAccessory, Badge } from '../types';

export const CAPY_ACCESSORIES: CapyAccessory[] = [
  // Head accessories
  { id: 'head_orange', name: '经典小金桔', category: 'head', icon: '🍊', cost: 0, unlocked: true, description: '卡皮巴拉的招牌顶顶金桔，稳如泰山！' },
  { id: 'head_towel', name: '温泉小毛巾', category: 'head', icon: '♨️', cost: 5, unlocked: false, description: '顶着热毛巾，泡澡最舒服啦～' },
  { id: 'head_duck', name: '头顶小黄鸭', category: 'head', icon: '🐥', cost: 8, unlocked: false, description: '嘎嘎嘎！小鸭子最喜欢坐卡皮巴拉头顶！' },
  { id: 'head_grad', name: '数学博士帽', category: 'head', icon: '🎓', cost: 15, unlocked: false, description: '乘除法小达人的专属学士帽！' },
  { id: 'head_crown', name: '亮晶晶皇冠', category: 'head', icon: '👑', cost: 25, unlocked: false, description: '自信满满的算术小王者！' },
  { id: 'head_flower', name: '向阳小红花', category: 'head', icon: '🌸', cost: 10, unlocked: false, description: '今天认真学习，奖励一朵大红花！' },
  { id: 'head_apple', name: '脆脆红苹果', category: 'head', icon: '🍎', cost: 12, unlocked: false, description: '香甜大苹果，平衡力一级棒！' },

  // Body accessories
  { id: 'body_none', name: '自然毛茸茸', category: 'body', icon: '🐾', cost: 0, unlocked: true, description: '原汁原味的超萌水豚皮毛！' },
  { id: 'body_tub', name: '温泉小木桶', category: 'body', icon: '🪵', cost: 6, unlocked: false, description: '随时随地舒服泡温泉～' },
  { id: 'body_donut', name: '甜甜圈泳圈', category: 'body', icon: '🍩', cost: 10, unlocked: false, description: '粉嫩草莓味泳圈，浮力满满！' },
  { id: 'body_backpack', name: '小乌龟书包', category: 'body', icon: '🎒', cost: 14, unlocked: false, description: '背上小书包，每天学一点乘除法！' },
  { id: 'body_bib', name: '吃货小围兜', category: 'body', icon: '🥕', cost: 8, unlocked: false, description: '准备好品尝草料与数学果实啦！' },
  { id: 'body_cape', name: '超人小披风', category: 'body', icon: '🦸', cost: 20, unlocked: false, description: '乘除小超人，算数超迅速！' },

  // Companion
  { id: 'comp_none', name: '安安静静', category: 'companion', icon: '🧘', cost: 0, unlocked: true, description: '沉浸在平静的乘除法世界里。' },
  { id: 'comp_ducky', name: '加油小水鸭', category: 'companion', icon: '🦆', cost: 8, unlocked: false, description: '在一旁呱呱为你加油鼓劲！' },
  { id: 'comp_turtle', name: '笃定小乌龟', category: 'companion', icon: '🐢', cost: 12, unlocked: false, description: '慢慢算不要急，准确第一名！' },
  { id: 'comp_bird', name: '唱歌小百灵', category: 'companion', icon: '🐦', cost: 15, unlocked: false, description: '答对题目就会欢快唱歌的小鸟！' },
  { id: 'comp_butterfly', name: '幸运小金蝶', category: 'companion', icon: '🦋', cost: 18, unlocked: false, description: '带来灵感与好运气的魔法蝴蝶！' },

  // Scene
  { id: 'scene_spring', name: '暖融融温泉', category: 'scene', icon: '♨️', cost: 0, unlocked: true, description: '咕嘟咕嘟冒热气的舒适天然温泉～' },
  { id: 'scene_grass', name: '青青小草甸', category: 'scene', icon: '🌿', cost: 10, unlocked: false, description: '满地鲜嫩青草与野花，随时野餐！' },
  { id: 'scene_pool', name: '夏日水上乐园', category: 'scene', icon: '🏖️', cost: 20, unlocked: false, description: '清凉扑通玩水，算题清爽不犯困！' },
];

export const BADGES_LIST: Badge[] = [
  {
    id: 'first_step',
    title: '卡皮初登场',
    description: '完成第 1 道乘除法题目',
    icon: '🐾',
    requiredStars: 1,
    capyQuote: '水豚向你递来一颗小金桔：迈出了超棒的第一步！',
  },
  {
    id: 'streak_3',
    title: '乘法连击手',
    description: '连续答对 3 道题',
    icon: '⚡',
    requiredStars: 3,
    capyQuote: '水豚头上的橘子稳如泰山：你的节奏感真棒！',
  },
  {
    id: 'star_collector',
    title: '金星收集家',
    description: '累计获得 10 颗小金星',
    icon: '⭐',
    requiredStars: 10,
    capyQuote: '哇！夜空都被你的小金星点亮啦！',
  },
  {
    id: 'sharing_master',
    title: '分物小暖心',
    description: '完成 5 道平均分除法题',
    icon: '🍉',
    requiredStars: 15,
    capyQuote: '把东西公平分给大家，你真是个大方聪明的好朋友！',
  },
  {
    id: 'times_table_hero',
    title: '乘法口诀小仙人',
    description: '累计获得 30 颗金星',
    icon: '👑',
    requiredStars: 30,
    capyQuote: '太不可思议了！一年级数学小霸王非你莫属！',
  },
  {
    id: 'super_confident',
    title: '自信卡皮超人',
    description: '自信心蓄力池达到 100 分',
    icon: '🌟',
    requiredStars: 50,
    capyQuote: '你现在的从容与自信，就像一尊闪闪发光的大水豚！',
  },
];

export const CAPY_CHEERS = {
  correct: [
    '太厉害啦！水豚头上的橘子都为你转了个圈！🍊✨',
    '思路好清晰！像卡皮巴拉一样稳稳拿分！🐾',
    '答得又快又准！给你颁发一枚脆脆胡萝卜！🥕',
    '哇塞！原来一年级的乘除法这么容易被你搞定！🎉',
    '你太棒了！自信心蓄力池正在咕嘟咕嘟冒泡泡！💖',
    '水豚泡着温泉给你鼓掌：啪唧啪唧！👏',
    '乘法就是几个几相加，你一眼就看出来啦！⭐',
    '除法平均分得超公平，每只小水豚都吃饱啦！🍉',
  ],
  encourage: [
    '没关系哦，卡皮巴拉摸摸头：深吸一口气，我们看图再数数！🌿',
    '做题就像剥橘子，慢慢来，下一题一定能行！🍊',
    '小挫折是一颗长智慧的种子，水豚陪你一起再试一次！🐾',
    '仔细看一看有几个圈圈，每个圈里有几个，你一定能找到答案！👀',
    '心态放平，像水豚一样从容，你已经非常勇敢啦！💪',
  ],
  clickMascot: [
    '噜噜～（水豚舒服地眯起了眼睛，自信心 +1）',
    '头顶的小金桔晃了晃：“小主人，今天数学你超厉害的！”',
    '水豚咬了一口脆胡萝卜：“慢慢算，不着急，你最棒啦！”',
    '“呼噜噜～乘法就是打包分组，除法就是分发礼物，很简单对不对？”',
    '“今天也在和卡皮巴拉一起快乐学数学呢，比心心！”',
  ],
};

export const CAPY_BADGES = BADGES_LIST;
