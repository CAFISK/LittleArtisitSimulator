import type { Ending, GameState } from '../types'

export const ENDINGS: Ending[] = [
  // ===== Good Endings =====
  {
    id: 'top_artist',
    title: '🏆 顶流画师',
    icon: '🏆',
    type: 'good',
    description: '你成为了圈内顶流画师！出版了个人画集，受邀参加各大活动，粉丝遍布全网。从一个涂鸦小白到万人追捧的大触，这一年的努力没有白费！',
    condition: (s) => s.skill > 85 && s.fans > 50000,
  },
  {
    id: 'business_mogul',
    title: '💼 商业大佬',
    icon: '💼',
    type: 'good',
    description: '你成立了自己的工作室，承接各种大型商业项目。从接小稿到管理团队，你用画笔画出了一条商业帝国之路！',
    condition: (s) => s.money > 100000 && s.skill > 60,
  },
  {
    id: 'game_artist',
    title: '🎮 游戏美术',
    icon: '🎮',
    type: 'good',
    description: '你被一家知名游戏公司签约，成为了主美！每天画自己喜欢的角色还能拿工资，这不就是梦想中的工作吗？',
    condition: (s) => s.skill > 70 && s.social > 60,
  },
  {
    id: 'popular_streamer',
    title: '📺 人气主播',
    icon: '📺',
    type: 'good',
    description: '你转型成为了人气绘画主播！每天直播画画，和粉丝互动，收入稳定还很开心。谁说画画不能当饭吃？',
    condition: (s) => s.fans > 30000 && s.social > 70,
  },
  {
    id: 'art_teacher',
    title: '🎓 绘画导师',
    icon: '🎓',
    type: 'good',
    description: '你开设了线上绘画学院，桃李满天下。把自己的经验传授给更多热爱画画的人，这种成就感比什么都珍贵。',
    condition: (s) => s.skill > 80 && s.social > 50,
  },

  // ===== Normal Endings =====
  {
    id: 'freelancer',
    title: '🖌️ 自由画师',
    icon: '🖌️',
    type: 'normal',
    description: '你成为了一名稳定的自由画师，虽然没有大火，但每天画自己喜欢的东西，接接约稿，生活自由自在。这样的日子，也挺好的。',
    condition: (s) => s.skill > 50 && s.money > 20000,
  },
  {
    id: 'part_time_artist',
    title: '👔 兼职画师',
    icon: '👔',
    type: 'normal',
    description: '你找了一份本职工作，业余时间继续画画。虽然不能全职画画有点遗憾，但至少生活有了保障，画画也没有放弃。',
    condition: (s) => s.skill > 30 && s.money < 10000 && s.mental > 30,
  },
  {
    id: 'growing',
    title: '🌱 慢慢成长',
    icon: '🌱',
    type: 'normal',
    description: '虽然还没有大火，但你在稳步成长中。粉丝在慢慢增加，画技在慢慢提升。未来可期，继续加油吧！',
    condition: (s) => s.skill > 40 && s.fans > 5000,
  },

  // ===== Bad Endings =====
  {
    id: 'mental_breakdown',
    title: '😵 精神崩溃',
    icon: '😵',
    type: 'bad',
    description: '长期的高压工作和网络暴力让你的精神彻底崩溃了。你不得不暂别画圈，去接受心理治疗。也许有一天你会回来，但现在，你需要好好照顾自己。',
    condition: (s) => s.mental < 10,
  },
  {
    id: 'bankrupt',
    title: '💸 破产',
    icon: '💸',
    type: 'bad',
    description: '入不敷出，银行卡余额见底。你不得不收拾行李回了老家。"画画能当饭吃吗？"亲戚的话在耳边回响...',
    condition: (s) => s.money < 0,
  },
  {
    id: 'quit',
    title: '🚪 退圈',
    icon: '🚪',
    type: 'bad',
    description: '对画画失去了热情，粉丝也寥寥无几。你默默注销了账号，退出了画圈。也许画画只是一个美好的梦吧...',
    condition: (s) => s.mental < 30 && s.fans < 100,
  },
  {
    id: 'cancelled',
    title: '🔥 社死',
    icon: '🔥',
    type: 'bad',
    description: '因为一系列争议事件，你在圈内彻底社死了。黑历史被扒了个底朝天，不得不换号重来。这一年的积累，全部归零...',
    condition: (s) => s.haters > 80 && s.reputation < 10,
  },

  // ===== Hidden Endings =====
  {
    id: 'cat_artist',
    title: '🐱 猫猫画师',
    icon: '🐱',
    type: 'hidden',
    description: '你发现自己画猫的时候特别有灵感，于是专注画猫，成为了知名的猫猫画师！每天被猫片包围，人生赢家！',
    condition: (s) => s.skill > 60 && s.fans > 10000 && s.inspiration > 70,
  },
]

export function checkEnding(state: GameState): Ending | null {
  // Check bad endings first (can trigger mid-game)
  const badEndings = ENDINGS.filter(e => e.type === 'bad')
  for (const ending of badEndings) {
    if (ending.condition(state)) {
      return ending
    }
  }
  return null
}

export function getFinalEnding(state: GameState): Ending {
  // Check hidden endings first
  const hidden = ENDINGS.filter(e => e.type === 'hidden')
  for (const ending of hidden) {
    if (ending.condition(state)) return ending
  }

  // Then good endings
  const good = ENDINGS.filter(e => e.type === 'good')
  for (const ending of good) {
    if (ending.condition(state)) return ending
  }

  // Then normal endings
  const normal = ENDINGS.filter(e => e.type === 'normal')
  for (const ending of normal) {
    if (ending.condition(state)) return ending
  }

  // Default ending
  return {
    id: 'default',
    title: '🌱 平凡的一年',
    icon: '🌱',
    type: 'normal',
    description: '这一年过得平平淡淡，没有大起大落。画技有所提升，也认识了一些朋友。虽然没有达成什么了不起的成就，但至少你还在画画的路上。明年继续加油吧！',
    condition: () => true,
  }
}
