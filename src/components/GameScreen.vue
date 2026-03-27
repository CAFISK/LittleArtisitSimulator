<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { ACTIONS, getActionsByCategory } from '../data/actions'
import type { ActionCategory, Action } from '../types'
import { ACTION_CATEGORY_LABELS } from '../types'
import StatusPanel from './StatusPanel.vue'
import LogPanel from './LogPanel.vue'

const game = useGameStore()
const selectedCategory = ref<ActionCategory | null>(null)

const categories: ActionCategory[] = ['create', 'study', 'leisure', 'social']

const availableActions = computed(() => {
  if (!selectedCategory.value) return []
  return getActionsByCategory(game.state, selectedCategory.value)
})

const allCategoryActions = computed(() => {
  if (!selectedCategory.value) return []
  return ACTIONS.filter(a => a.category === selectedCategory.value)
})

function selectCategory(cat: ActionCategory) {
  selectedCategory.value = selectedCategory.value === cat ? null : cat
}

function doAction(action: Action) {
  game.performAction(action)
  selectedCategory.value = null
}

function isActionAvailable(action: Action): boolean {
  if (action.staminaCost > game.state.stamina) return false
  if (action.condition && !action.condition(game.state)) return false
  return true
}

function getUnavailableReason(action: Action): string {
  if (action.staminaCost > game.state.stamina) return `体力不足（需要${action.staminaCost}）`
  if (action.condition && !action.condition(game.state)) {
    if (action.id === 'commission_personal') return '需要粉丝≥500'
    if (action.id === 'commission_commercial') return '需要画技≥31'
    if (action.id === 'online_course') return '金钱不足'
    if (action.id === 'artist_meetup') return '金钱不足'
    if (action.id === 'collab') return '需要社交值≥30'
    return '条件不满足'
  }
  return ''
}

function handleSave() {
  game.saveGame()
}
</script>

<template>
  <div class="screen">
    <!-- Header -->
    <div class="game-header card">
      <div class="header-top">
        <div class="date-info">
          <span class="month-badge">第{{ game.state.month }}月</span>
          <span class="day-text">第{{ game.dayInMonth }}天</span>
          <span class="time-badge" :class="`time-${game.state.timeSlot}`">
            {{ game.timeSlotLabel }}
          </span>
        </div>
        <button class="btn btn-sm" @click="handleSave">💾 保存</button>
      </div>
      <div class="header-progress">
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${(game.state.day / 365) * 100}%`, background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-pink))' }"
          ></div>
        </div>
        <span class="progress-label">{{ game.state.day }}/365天</span>
      </div>
    </div>

    <!-- Status Panel -->
    <StatusPanel />

    <!-- Action Selection -->
    <div class="card">
      <div class="card-title">🎯 今天{{ game.timeSlotLabel }}做什么？</div>

      <!-- Category Buttons -->
      <div class="category-grid">
        <button
          v-for="cat in categories"
          :key="cat"
          class="category-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectCategory(cat)"
        >
          <span class="cat-icon">{{ ACTION_CATEGORY_LABELS[cat].icon }}</span>
          <span class="cat-label">{{ ACTION_CATEGORY_LABELS[cat].label }}</span>
        </button>
      </div>

      <!-- Action List -->
      <div v-if="selectedCategory" class="action-list fade-in">
        <div
          v-for="action in allCategoryActions"
          :key="action.id"
          class="action-item"
          :class="{ disabled: !isActionAvailable(action) }"
          @click="isActionAvailable(action) && doAction(action)"
        >
          <div class="action-header">
            <span class="action-icon">{{ action.icon }}</span>
            <span class="action-name">{{ action.name }}</span>
            <span class="action-cost" v-if="action.staminaCost > 0">
              ❤️ -{{ action.staminaCost }}
            </span>
          </div>
          <div class="action-desc">{{ action.description }}</div>
          <div v-if="!isActionAvailable(action)" class="action-locked">
            🔒 {{ getUnavailableReason(action) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Log Panel -->
    <LogPanel />
  </div>
</template>

<style scoped>
.game-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.month-badge {
  background: var(--accent-pink);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.day-text {
  font-size: 1rem;
  color: var(--text-secondary);
}

.time-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.time-morning { background: #f59e0b33; color: #f59e0b; }
.time-afternoon { background: #3b82f633; color: #3b82f6; }
.time-evening { background: #8b5cf633; color: #8b5cf6; }

.btn-sm {
  padding: 6px 14px;
  font-size: 0.85rem;
}

.header-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-progress .progress-bar {
  flex: 1;
}

.progress-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.category-btn:hover {
  border-color: var(--accent-blue);
  background: var(--bg-card);
}

.category-btn.active {
  border-color: var(--accent-pink);
  background: rgba(233, 69, 96, 0.15);
}

.cat-icon {
  font-size: 1.5rem;
}

.cat-label {
  font-size: 0.85rem;
  font-weight: 500;
}

/* Action List */
.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-item {
  padding: 14px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
}

.action-item:hover:not(.disabled) {
  border-color: var(--accent-blue);
  background: var(--bg-card);
  transform: translateX(4px);
}

.action-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.action-icon {
  font-size: 1.2rem;
}

.action-name {
  font-weight: 600;
  flex: 1;
}

.action-cost {
  font-size: 0.8rem;
  color: var(--accent-pink);
  background: rgba(233, 69, 96, 0.15);
  padding: 2px 8px;
  border-radius: 10px;
}

.action-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  padding-left: 28px;
}

.action-locked {
  font-size: 0.8rem;
  color: var(--danger);
  padding-left: 28px;
  margin-top: 4px;
}

@media (max-width: 600px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
