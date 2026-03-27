<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const game = useGameStore()

const stats = computed(() => [
  {
    key: 'money',
    icon: '💰',
    label: '金钱',
    value: game.state.money,
    display: `¥${game.state.money.toLocaleString()}`,
    max: null,
    colorClass: 'stat-money',
    fillClass: 'fill-money',
  },
  {
    key: 'skill',
    icon: '🎨',
    label: `画技 (${game.skillLevel.title})`,
    value: game.state.skill,
    display: `${game.state.skill}/100`,
    max: 100,
    colorClass: 'stat-skill',
    fillClass: 'fill-skill',
  },
  {
    key: 'mental',
    icon: '🧠',
    label: '精神状态',
    value: game.state.mental,
    display: `${game.state.mental}/100`,
    max: 100,
    colorClass: 'stat-mental',
    fillClass: 'fill-mental',
    warning: game.state.mental < 30,
  },
  {
    key: 'stamina',
    icon: '❤️',
    label: '体力',
    value: game.state.stamina,
    display: `${game.state.stamina}/100`,
    max: 100,
    colorClass: 'stat-stamina',
    fillClass: 'fill-stamina',
    warning: game.state.stamina < 20,
  },
  {
    key: 'inspiration',
    icon: '🌟',
    label: '灵感',
    value: game.state.inspiration,
    display: `${game.state.inspiration}/100`,
    max: 100,
    colorClass: 'stat-inspiration',
    fillClass: 'fill-inspiration',
  },
  {
    key: 'fans',
    icon: '👥',
    label: '粉丝',
    value: game.state.fans,
    display: game.state.fans >= 10000
      ? `${(game.state.fans / 10000).toFixed(1)}万`
      : game.state.fans.toLocaleString(),
    max: null,
    colorClass: 'stat-fans',
    fillClass: 'fill-fans',
  },
  {
    key: 'popularity',
    icon: '🔥',
    label: '热度',
    value: game.state.popularity,
    display: `${game.state.popularity}/100`,
    max: 100,
    colorClass: 'stat-popularity',
    fillClass: 'fill-popularity',
  },
  {
    key: 'social',
    icon: '😊',
    label: '社交',
    value: game.state.social,
    display: `${game.state.social}/100`,
    max: 100,
    colorClass: 'stat-social',
    fillClass: 'fill-social',
  },
])
</script>

<template>
  <div class="card status-panel">
    <div class="card-title">📊 状态面板</div>
    <div class="stats-grid">
      <div
        v-for="stat in stats"
        :key="stat.key"
        class="stat-item"
        :class="{ 'stat-warning': stat.warning }"
      >
        <div class="stat-header">
          <span class="stat-icon">{{ stat.icon }}</span>
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value" :class="stat.colorClass">{{ stat.display }}</span>
        </div>
        <div v-if="stat.max" class="progress-bar">
          <div
            class="progress-fill"
            :class="stat.fillClass"
            :style="{ width: `${(stat.value / stat.max) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-panel {
  background: var(--bg-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  padding: 8px 12px;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  transition: var(--transition);
}

.stat-item.stat-warning {
  border-color: var(--danger);
  animation: pulse 2s ease-in-out infinite;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 0.85rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-label {
  flex: 1;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.stat-value {
  font-weight: 700;
  font-size: 0.9rem;
}

@media (max-width: 500px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
