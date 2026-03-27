<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { EventChoice } from '../types'

const game = useGameStore()
const selectedChoice = ref<EventChoice | null>(null)
const showResult = ref(false)

const attrLabels: Record<string, string> = {
  money: '金钱',
  skill: '画技',
  mental: '精神',
  stamina: '体力',
  inspiration: '灵感',
  fans: '粉丝',
  popularity: '热度',
  social: '社交',
  reputation: '口碑',
  haters: '黑粉',
  procrastination: '拖稿',
}

function getAttrLabel(attr: string): string {
  return attrLabels[attr] || attr
}

function selectChoice(choice: EventChoice) {
  selectedChoice.value = choice
  showResult.value = true
}

function confirmChoice() {
  if (selectedChoice.value) {
    game.handleEventChoice(selectedChoice.value)
    selectedChoice.value = null
    showResult.value = false
  }
}
</script>

<template>
  <div class="event-overlay" v-if="game.state.currentEvent">
    <div class="event-modal fade-in">
      <div class="event-header">
        <span class="event-icon">{{ game.state.currentEvent.icon }}</span>
        <h2 class="event-title">{{ game.state.currentEvent.title }}</h2>
      </div>

      <div class="event-body">
        <p class="event-description">{{ game.state.currentEvent.description }}</p>

        <!-- Choice selection -->
        <div v-if="!showResult" class="event-choices">
          <button
            v-for="(choice, index) in game.state.currentEvent.choices"
            :key="index"
            class="choice-btn"
            @click="selectChoice(choice)"
          >
            <span class="choice-text">{{ choice.text }}</span>
            <div class="choice-effects">
              <span
                v-for="effect in choice.effects"
                :key="effect.attr"
                class="effect-tag"
                :class="effect.value > 0 ? 'effect-positive' : 'effect-negative'"
              >
                {{ effect.value > 0 ? '+' : '' }}{{ effect.value }}
                {{ getAttrLabel(effect.attr) }}
              </span>
            </div>
          </button>
        </div>

        <!-- Result -->
        <div v-else class="event-result fade-in">
          <div class="result-text">{{ selectedChoice?.resultText }}</div>
          <button class="btn btn-primary" @click="confirmChoice">
            继续 →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.event-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.event-modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  max-width: 550px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.event-header {
  background: linear-gradient(135deg, var(--bg-card), var(--bg-secondary));
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.event-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 12px;
}

.event-title {
  font-size: 1.4rem;
  font-weight: 700;
}

.event-body {
  padding: 24px;
}

.event-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 24px;
  text-align: center;
}

.event-choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.choice-btn {
  width: 100%;
  padding: 14px 18px;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
  font-family: inherit;
}

.choice-btn:hover {
  border-color: var(--accent-pink);
  background: rgba(233, 69, 96, 0.1);
  transform: translateX(4px);
}

.choice-text {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 6px;
}

.choice-effects {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.effect-tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
}

.effect-positive {
  background: rgba(34, 197, 94, 0.15);
  color: var(--success);
}

.effect-negative {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
}

.event-result {
  text-align: center;
}

.result-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 24px;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
}
</style>
