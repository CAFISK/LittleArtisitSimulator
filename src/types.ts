// ===== Game State Types =====

export type TimeSlot = 'morning' | 'afternoon' | 'evening'

export type ArtStyleType = 'cute' | 'impasto' | 'celluloid' | 'realistic' | 'pixel'

export type ActionCategory = 'create' | 'study' | 'leisure' | 'social'

export interface GameState {
  // Basic info
  day: number           // Current day (1~365)
  timeSlot: TimeSlot
  month: number         // Current month (1~12)
  gameOver: boolean
  currentScreen: ScreenType

  // Main attributes
  money: number
  skill: number
  mental: number
  stamina: number
  inspiration: number
  fans: number
  popularity: number
  social: number

  // Hidden attributes
  artStyle: Record<ArtStyleType, number>
  reputation: number
  procrastination: number
  haters: number

  // Status
  activeCommissions: Commission[]
  unlockedSkills: string[]
  achievements: string[]
  eventHistory: string[]

  // Monthly tracking
  monthlyIncome: number
  monthlyExpense: number
  monthStartStats: MonthStartStats | null

  // Current event
  currentEvent: GameEvent | null

  // Ending
  ending: Ending | null

  // Log messages for the day
  logs: LogEntry[]
}

export interface MonthStartStats {
  skill: number
  fans: number
  mental: number
  money: number
}

export interface Commission {
  id: string
  name: string
  type: 'personal' | 'commercial'
  deadline: number      // Remaining days
  payment: number
  progress: number      // 0~100
  difficulty: number
  revisions: number
}

export interface GameEvent {
  id: string
  title: string
  description: string
  choices: EventChoice[]
  icon: string
}

export interface EventChoice {
  text: string
  effects: AttrEffect[]
  resultText: string
}

export interface AttrEffect {
  attr: keyof Pick<GameState, 'money' | 'skill' | 'mental' | 'stamina' | 'inspiration' | 'fans' | 'popularity' | 'social' | 'reputation' | 'procrastination' | 'haters'>
  value: number
  isPercentage?: boolean
}

export interface Action {
  id: string
  name: string
  category: ActionCategory
  icon: string
  staminaCost: number
  description: string
  effects: AttrEffect[]
  condition?: (state: GameState) => boolean
  specialEffect?: (state: GameState) => { effects: AttrEffect[], message: string }
}

export interface Ending {
  id: string
  title: string
  icon: string
  type: 'good' | 'normal' | 'bad' | 'hidden'
  description: string
  condition: (state: GameState) => boolean
}

export interface LogEntry {
  text: string
  type: 'info' | 'success' | 'warning' | 'danger'
}

export type ScreenType = 'title' | 'game' | 'event' | 'monthReport' | 'ending' | 'charCreate'

// ===== Constants =====

export const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export const MONTHLY_RENT = 1500
export const MONTHLY_LIVING = 1000
export const MONTHLY_SOFTWARE = 200
export const MONTHLY_TOTAL_EXPENSE = MONTHLY_RENT + MONTHLY_LIVING + MONTHLY_SOFTWARE

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '上午',
  afternoon: '下午',
  evening: '晚上'
}

export const ART_STYLE_LABELS: Record<ArtStyleType, string> = {
  cute: '萌系',
  impasto: '厚涂',
  celluloid: '赛璐璐',
  realistic: '写实',
  pixel: '像素风'
}

export const SKILL_LEVELS = [
  { min: 0, max: 15, title: '涂鸦小白', level: 1 },
  { min: 16, max: 30, title: '入门画手', level: 2 },
  { min: 31, max: 50, title: '进阶画师', level: 3 },
  { min: 51, max: 70, title: '实力画师', level: 4 },
  { min: 71, max: 85, title: '大触', level: 5 },
  { min: 86, max: 100, title: '神仙画师', level: 6 },
]

export const ACTION_CATEGORY_LABELS: Record<ActionCategory, { label: string, icon: string }> = {
  create: { label: '创作', icon: '🎨' },
  study: { label: '学习', icon: '📚' },
  leisure: { label: '休闲', icon: '🎮' },
  social: { label: '社交', icon: '👥' },
}
