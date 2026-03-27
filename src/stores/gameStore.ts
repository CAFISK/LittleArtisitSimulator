import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  GameState, TimeSlot, Action, GameEvent, EventChoice,
  LogEntry, ScreenType, MonthStartStats, Ending
} from '../types'
import {
  MONTH_DAYS, MONTHLY_TOTAL_EXPENSE, SKILL_LEVELS, TIME_SLOT_LABELS
} from '../types'
import { checkRandomEvents, checkStoryEvent } from '../data/events'
import { checkEnding, getFinalEnding } from '../data/endings'

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function createInitialState(): GameState {
  return {
    day: 1,
    timeSlot: 'morning',
    month: 1,
    gameOver: false,
    currentScreen: 'title',

    money: 5000,
    skill: 10,
    mental: 80,
    stamina: 100,
    inspiration: 50,
    fans: 0,
    popularity: 0,
    social: 30,

    artStyle: { cute: 0, impasto: 0, celluloid: 0, realistic: 0, pixel: 0 },
    reputation: 50,
    procrastination: 0,
    haters: 0,

    activeCommissions: [],
    unlockedSkills: [],
    achievements: [],
    eventHistory: [],

    monthlyIncome: 0,
    monthlyExpense: 0,
    monthStartStats: null,

    currentEvent: null,
    ending: null,
    logs: [],
  }
}

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState>(createInitialState())

  // ===== Computed =====
  const skillLevel = computed(() => {
    return SKILL_LEVELS.find(l => state.value.skill >= l.min && state.value.skill <= l.max)
      || SKILL_LEVELS[0]
  })

  const timeSlotLabel = computed(() => TIME_SLOT_LABELS[state.value.timeSlot])

  const dayInMonth = computed(() => {
    let remaining = state.value.day
    for (let m = 0; m < 12; m++) {
      if (remaining <= MONTH_DAYS[m]) return remaining
      remaining -= MONTH_DAYS[m]
    }
    return remaining
  })

  const isGameOver = computed(() => state.value.gameOver)

  // ===== Actions =====

  function startNewGame() {
    Object.assign(state.value, createInitialState())
    state.value.currentScreen = 'game'
    state.value.monthStartStats = {
      skill: state.value.skill,
      fans: state.value.fans,
      mental: state.value.mental,
      money: state.value.money,
    }
    addLog('🎨 欢迎来到小画师模拟器！你是一名刚入行的二次元小画师，开始你的创作之旅吧！', 'info')
  }

  function addLog(text: string, type: LogEntry['type'] = 'info') {
    state.value.logs.unshift({ text, type })
    // Keep only last 50 logs
    if (state.value.logs.length > 50) {
      state.value.logs = state.value.logs.slice(0, 50)
    }
  }

  function applyEffects(effects: Array<{ attr: string, value: number }>) {
    for (const effect of effects) {
      const key = effect.attr as keyof GameState
      const current = state.value[key]
      if (typeof current === 'number') {
        let newVal = current + effect.value

        // Track income/expense
        if (key === 'money') {
          if (effect.value > 0) state.value.monthlyIncome += effect.value
          else state.value.monthlyExpense += Math.abs(effect.value)
        }

        // Clamp bounded attributes
        if (['skill', 'mental', 'stamina', 'inspiration', 'popularity', 'social'].includes(key)) {
          newVal = clamp(newVal, 0, 100)
        }
        if (['fans', 'haters', 'reputation'].includes(key)) {
          newVal = Math.max(0, newVal)
        }

        ;(state.value as any)[key] = newVal
      }
    }
  }

  function performAction(action: Action) {
    if (state.value.gameOver || state.value.currentScreen !== 'game') return

    // Check stamina
    if (action.staminaCost > state.value.stamina) {
      addLog('❌ 体力不足，无法执行这个行动！', 'danger')
      return
    }

    // Consume stamina
    state.value.stamina = Math.max(0, state.value.stamina - action.staminaCost)

    // Apply base effects
    applyEffects(action.effects)

    // Apply special effects
    if (action.specialEffect) {
      const special = action.specialEffect(state.value)
      applyEffects(special.effects)
      addLog(special.message, 'success')
    } else {
      addLog(`执行了「${action.name}」`, 'info')
    }

    // Advance time
    advanceTime()
  }

  function advanceTime() {
    const slots: TimeSlot[] = ['morning', 'afternoon', 'evening']
    const currentIndex = slots.indexOf(state.value.timeSlot)

    if (currentIndex < 2) {
      // Move to next time slot
      state.value.timeSlot = slots[currentIndex + 1]
    } else {
      // End of day - move to next day
      state.value.timeSlot = 'morning'
      state.value.day++

      // Daily recovery
      state.value.stamina = clamp(state.value.stamina + 30, 0, 100)

      // Popularity natural decay
      state.value.popularity = Math.max(0, state.value.popularity - 1)

      // Calculate current month
      let dayCount = 0
      for (let m = 0; m < 12; m++) {
        dayCount += MONTH_DAYS[m]
        if (state.value.day <= dayCount) {
          const newMonth = m + 1
          if (newMonth !== state.value.month) {
            // New month!
            handleMonthEnd()
            state.value.month = newMonth
          }
          break
        }
      }

      // Check for game end (365 days)
      if (state.value.day > 365) {
        handleGameEnd()
        return
      }
    }

    // Check for bad endings
    const badEnding = checkEnding(state.value)
    if (badEnding) {
      state.value.ending = badEnding
      state.value.gameOver = true
      state.value.currentScreen = 'ending'
      return
    }

    // Check for random events (only at start of time slot)
    if (Math.random() < 0.15) {
      const event = checkRandomEvents(state.value)
      if (event) {
        state.value.currentEvent = event
        state.value.currentScreen = 'event'
        return
      }
    }

    // Check for story events at the start of a new month
    const storyEvent = checkStoryEvent(state.value.month, state.value.eventHistory)
    if (storyEvent && dayInMonth.value <= 3 && state.value.timeSlot === 'morning') {
      state.value.currentEvent = storyEvent
      state.value.currentScreen = 'event'
    }
  }

  function handleMonthEnd() {
    // Deduct monthly expenses
    state.value.money -= MONTHLY_TOTAL_EXPENSE
    state.value.monthlyExpense += MONTHLY_TOTAL_EXPENSE

    addLog(`📅 月度结算：扣除房租+生活费+软件订阅 共 ${MONTHLY_TOTAL_EXPENSE} 元`, 'warning')

    // Passive income from fans
    const passiveIncome = Math.floor(state.value.fans * 0.01 + state.value.popularity * 2)
    if (passiveIncome > 0) {
      state.value.money += passiveIncome
      state.value.monthlyIncome += passiveIncome
      addLog(`💰 平台流量收益：+${passiveIncome} 元`, 'success')
    }

    // Show month report
    state.value.currentScreen = 'monthReport'
  }

  function closeMonthReport() {
    // Reset monthly tracking
    state.value.monthStartStats = {
      skill: state.value.skill,
      fans: state.value.fans,
      mental: state.value.mental,
      money: state.value.money,
    }
    state.value.monthlyIncome = 0
    state.value.monthlyExpense = 0
    state.value.currentScreen = 'game'
  }

  function handleEventChoice(choice: EventChoice) {
    applyEffects(choice.effects)
    addLog(choice.resultText, 'info')

    if (state.value.currentEvent) {
      state.value.eventHistory.push(state.value.currentEvent.id)
    }
    state.value.currentEvent = null
    state.value.currentScreen = 'game'

    // Check for bad endings after event
    const badEnding = checkEnding(state.value)
    if (badEnding) {
      state.value.ending = badEnding
      state.value.gameOver = true
      state.value.currentScreen = 'ending'
    }
  }

  function handleGameEnd() {
    const ending = getFinalEnding(state.value)
    state.value.ending = ending
    state.value.gameOver = true
    state.value.currentScreen = 'ending'
  }

  function goToTitle() {
    state.value.currentScreen = 'title'
  }

  // ===== Save / Load =====
  function saveGame() {
    try {
      localStorage.setItem('little-artist-save', JSON.stringify(state.value))
      addLog('💾 游戏已保存！', 'success')
      return true
    } catch {
      return false
    }
  }

  function loadGame(): boolean {
    try {
      const data = localStorage.getItem('little-artist-save')
      if (data) {
        const parsed = JSON.parse(data)
        Object.assign(state.value, parsed)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  function hasSaveData(): boolean {
    return !!localStorage.getItem('little-artist-save')
  }

  return {
    state,
    skillLevel,
    timeSlotLabel,
    dayInMonth,
    isGameOver,
    startNewGame,
    performAction,
    handleEventChoice,
    closeMonthReport,
    goToTitle,
    saveGame,
    loadGame,
    hasSaveData,
    addLog,
  }
})
