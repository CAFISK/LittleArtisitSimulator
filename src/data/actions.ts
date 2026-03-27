import type { Action, GameState } from './types'

// Helper: random integer in [min, max]
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const ACTIONS: Action[] = [
  // ===== Create =====
  {
    id: 'practice',
    name: '日常练习',
    category: 'create',
    icon: '✏️',
    staminaCost: 20,
    description: '安安静静画一张练习，稳步提升画技',
    effects: [
      { attr: 'skill', value: 2 },
      { attr: 'inspiration', value: -5 },
    ],
    specialEffect: (state) => {
      const bonus = randInt(1, 3)
      return {
        effects: [{ attr: 'skill', value: bonus }],
        message: `认真练习了一番，画技提升了 ${bonus} 点`
      }
    }
  },
  {
    id: 'fanart',
    name: '画同人图',
    category: 'create',
    icon: '🌸',
    staminaCost: 30,
    description: '画一张热门作品的同人图，蹭蹭热度',
    effects: [
      { attr: 'skill', value: 1 },
    ],
    specialEffect: (state) => {
      const fanGain = Math.floor((state.skill * 0.5 + state.popularity * 0.3) * (0.8 + Math.random() * 0.4))
      const popGain = randInt(3, 8)
      return {
        effects: [
          { attr: 'fans', value: Math.max(fanGain, 1) },
          { attr: 'popularity', value: popGain },
        ],
        message: `同人图发出去了！涨了 ${Math.max(fanGain, 1)} 个粉丝`
      }
    }
  },
  {
    id: 'original',
    name: '画原创作品',
    category: 'create',
    icon: '🎨',
    staminaCost: 35,
    description: '倾注心血画一张原创作品，高风险高回报',
    effects: [
      { attr: 'skill', value: 2 },
      { attr: 'inspiration', value: -10 },
    ],
    specialEffect: (state) => {
      const isHit = Math.random() < (state.inspiration / 100) * 0.6 + 0.1
      if (isHit) {
        const fanGain = Math.floor(state.skill * 2 * (0.8 + Math.random() * 0.4))
        return {
          effects: [
            { attr: 'fans', value: fanGain },
            { attr: 'popularity', value: randInt(5, 15) },
          ],
          message: `原创作品大受好评！涨了 ${fanGain} 个粉丝！`
        }
      }
      return {
        effects: [],
        message: '原创作品发出去了...但是没什么人看，好惨 😢'
      }
    }
  },
  {
    id: 'commission_personal',
    name: '画个人约稿',
    category: 'create',
    icon: '💌',
    staminaCost: 30,
    description: '接一单个人约稿，赚点零花钱',
    effects: [],
    condition: (state) => state.fans >= 500,
    specialEffect: (state) => {
      const payment = Math.floor(state.skill * 8 + state.fans * 0.01)
      return {
        effects: [
          { attr: 'money', value: payment },
          { attr: 'mental', value: -5 },
        ],
        message: `完成了一单约稿，收入 ${payment} 元`
      }
    }
  },
  {
    id: 'commission_commercial',
    name: '接商业稿件',
    category: 'create',
    icon: '💼',
    staminaCost: 40,
    description: '接一单商业稿件，收入高但甲方可能很折磨',
    effects: [],
    condition: (state) => state.skill >= 31,
    specialEffect: (state) => {
      const payment = Math.floor(state.skill * 20 + 500)
      const mentalLoss = randInt(10, 20)
      const needRevision = Math.random() < 0.4
      if (needRevision) {
        return {
          effects: [
            { attr: 'money', value: payment },
            { attr: 'mental', value: -(mentalLoss + 10) },
            { attr: 'reputation', value: 2 },
          ],
          message: `商稿完成！收入 ${payment} 元。但甲方要求改了3版，精神受到暴击...`
        }
      }
      return {
        effects: [
          { attr: 'money', value: payment },
          { attr: 'mental', value: -mentalLoss },
          { attr: 'reputation', value: 3 },
        ],
        message: `商稿顺利完成！收入 ${payment} 元，甲方很满意 ✨`
      }
    }
  },
  {
    id: 'rush',
    name: '赶稿（加班）',
    category: 'create',
    icon: '🔥',
    staminaCost: 50,
    description: 'Deadline就是第一生产力！疯狂赶稿',
    effects: [
      { attr: 'mental', value: -15 },
    ],
    specialEffect: (state) => {
      const payment = Math.floor(state.skill * 15 + 300)
      return {
        effects: [
          { attr: 'money', value: payment },
          { attr: 'stamina', value: -20 },
        ],
        message: `通宵赶稿完成！收入 ${payment} 元，但身体快撑不住了...`
      }
    }
  },

  // ===== Study =====
  {
    id: 'tutorial',
    name: '看教程学习',
    category: 'study',
    icon: '📖',
    staminaCost: 15,
    description: '看B站大佬的绘画教程，偷师学艺',
    effects: [
      { attr: 'inspiration', value: 5 },
    ],
    specialEffect: () => {
      const gain = randInt(2, 4)
      return {
        effects: [{ attr: 'skill', value: gain }],
        message: `看了一下午教程，画技提升了 ${gain} 点！`
      }
    }
  },
  {
    id: 'copy_master',
    name: '临摹大佬作品',
    category: 'study',
    icon: '🖼️',
    staminaCost: 25,
    description: '找一张大佬的图认真临摹，提升基本功',
    effects: [],
    specialEffect: () => {
      const gain = randInt(3, 5)
      return {
        effects: [{ attr: 'skill', value: gain }],
        message: `认真临摹了一张大佬的图，画技提升了 ${gain} 点！`
      }
    }
  },
  {
    id: 'learn_tool',
    name: '学习新工具',
    category: 'study',
    icon: '🔧',
    staminaCost: 20,
    description: '学习新的绘画软件或插件，提升效率',
    effects: [
      { attr: 'skill', value: 2 },
      { attr: 'inspiration', value: 3 },
    ],
  },
  {
    id: 'online_course',
    name: '参加线上课程',
    category: 'study',
    icon: '🎓',
    staminaCost: 20,
    description: '花钱报一个线上绘画课程，系统学习',
    effects: [
      { attr: 'skill', value: 5 },
      { attr: 'money', value: -500 },
    ],
    condition: (state) => state.money >= 500,
  },

  // ===== Leisure =====
  {
    id: 'browse_phone',
    name: '摸鱼刷手机',
    category: 'leisure',
    icon: '📱',
    staminaCost: 5,
    description: '刷刷微博看看热搜，说不定能发现灵感',
    effects: [
      { attr: 'mental', value: 10 },
      { attr: 'inspiration', value: 5 },
    ],
    specialEffect: (state) => {
      if (Math.random() < 0.3) {
        return {
          effects: [{ attr: 'popularity', value: 3 }],
          message: '刷手机时发现了一个热门话题，也许可以蹭一波热度！'
        }
      }
      return { effects: [], message: '摸了一会儿鱼，感觉精神好多了~' }
    }
  },
  {
    id: 'play_game',
    name: '打游戏',
    category: 'leisure',
    icon: '🎮',
    staminaCost: 10,
    description: '玩会儿游戏放松一下，说不定还能获得创作灵感',
    effects: [
      { attr: 'mental', value: 15 },
      { attr: 'inspiration', value: 10 },
    ],
  },
  {
    id: 'watch_anime',
    name: '看动画/漫画',
    category: 'leisure',
    icon: '📺',
    staminaCost: 10,
    description: '追番看漫画，补充二次元能量',
    effects: [
      { attr: 'mental', value: 10 },
      { attr: 'inspiration', value: 15 },
    ],
  },
  {
    id: 'walk',
    name: '出门散步',
    category: 'leisure',
    icon: '🚶',
    staminaCost: 0,
    description: '出门走走，呼吸新鲜空气',
    effects: [
      { attr: 'mental', value: 10 },
      { attr: 'stamina', value: 10 },
      { attr: 'inspiration', value: 5 },
    ],
  },
  {
    id: 'sleep',
    name: '睡觉休息',
    category: 'leisure',
    icon: '😴',
    staminaCost: 0,
    description: '好好睡一觉，恢复体力',
    effects: [
      { attr: 'mental', value: 5 },
    ],
    specialEffect: (state) => {
      return {
        effects: [{ attr: 'stamina', value: 100 - state.stamina }],
        message: '美美地睡了一觉，体力完全恢复了！'
      }
    }
  },

  // ===== Social =====
  {
    id: 'social_media',
    name: '社交平台互动',
    category: 'social',
    icon: '💬',
    staminaCost: 10,
    description: '在社交平台上和粉丝互动，维护关系',
    effects: [
      { attr: 'social', value: 5 },
      { attr: 'popularity', value: 5 },
    ],
    specialEffect: (state) => {
      const fanGain = Math.max(1, Math.floor(state.popularity * 0.2))
      return {
        effects: [{ attr: 'fans', value: fanGain }],
        message: `和粉丝互动了一番，涨了 ${fanGain} 个粉丝`
      }
    }
  },
  {
    id: 'artist_meetup',
    name: '参加画师聚会',
    category: 'social',
    icon: '🍻',
    staminaCost: 25,
    description: '和画师朋友们聚一聚，交流心得',
    effects: [
      { attr: 'social', value: 15 },
      { attr: 'inspiration', value: 10 },
      { attr: 'money', value: -200 },
    ],
    condition: (state) => state.money >= 200,
  },
  {
    id: 'livestream',
    name: '直播画画',
    category: 'social',
    icon: '📡',
    staminaCost: 30,
    description: '开一场绘画直播，和观众互动',
    effects: [
      { attr: 'social', value: 5 },
    ],
    specialEffect: (state) => {
      const fanGain = Math.floor(state.skill * 0.5 + state.fans * 0.01)
      const tipMoney = Math.floor(state.fans * 0.02 + state.skill * 2)
      return {
        effects: [
          { attr: 'fans', value: Math.max(fanGain, 3) },
          { attr: 'money', value: tipMoney },
          { attr: 'popularity', value: randInt(3, 8) },
        ],
        message: `直播结束！涨了 ${Math.max(fanGain, 3)} 个粉丝，收到 ${tipMoney} 元打赏`
      }
    }
  },
  {
    id: 'collab',
    name: '与画师联动',
    category: 'social',
    icon: '🤝',
    staminaCost: 20,
    description: '和其他画师一起搞联动创作',
    effects: [
      { attr: 'social', value: 10 },
    ],
    condition: (state) => state.social >= 30,
    specialEffect: (state) => {
      const fanGain = Math.floor(state.skill * 1.5 + 50)
      return {
        effects: [
          { attr: 'fans', value: fanGain },
          { attr: 'popularity', value: randInt(5, 10) },
        ],
        message: `联动作品发布！涨了 ${fanGain} 个粉丝`
      }
    }
  },
]

export function getAvailableActions(state: GameState): Action[] {
  return ACTIONS.filter(a => {
    if (a.staminaCost > state.stamina) return false
    if (a.condition && !a.condition(state)) return false
    return true
  })
}

export function getActionsByCategory(state: GameState, category: ActionCategory): Action[] {
  return getAvailableActions(state).filter(a => a.category === category)
}
