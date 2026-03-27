<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const game = useGameStore()

const ending = computed(() => game.state.ending)

const typeLabel = computed(() => {
  if (!ending.value) return ''
  const map: Record<string, { label: string, class: string }> = {
    good: { label: '🌟 好结局', class: 'type-good' },
    normal: { label: '😐 普通结局', class: 'type-normal' },
    bad: { label: '💀 坏结局', class: 'type-bad' },
    hidden: { label: '🥚 隐藏结局', class: 'type-hidden' },
  }
  return map[ending.value.type] || { label: '结局', class: '' }
})

const finalStats = computed(() => [
  { icon: '💰', label: '最终金钱', value: `¥${game.state.money.toLocaleString()}` },
  { icon: '🎨', label: '最终画技', value: `${game.state.skill}/100` },
  { icon: '👥', label: '最终粉丝', value: game.state.fans.toLocaleString() },
  { icon: '🧠', label: '最终精神', value: `${game.state.mental}/100` },
  { icon: '🔥', label: '最终热度', value: `${game.state.popularity}/100` },
  { icon: '😊', label: '最终社交', value: `${game.state.social}/100` },
])
</script>

<template>
  <div class="ending-screen" v-if="ending">
    <div class="ending-content fade-in">
      <div class="ending-badge" :class="typeLabel.class">
        {{ typeLabel.label }}
      </div>

      <div class="ending-icon">{{ ending.icon }}</div>
      <h1 class="ending-title">{{ ending.title }}</h1>

      <div class="ending-description">
        {{ ending.description }}
      </div>

      <div class="ending-stats">
        <h3>📊 最终数据</h3>
        <div class="stats-grid">
          <div v-for="stat in finalStats" :key="stat.label" class="final-stat">
            <span class="fs-icon">{{ stat.icon }}</span>
            <span class="fs-label">{{ stat.label }}</span>
            <span class="fs-value">{{ stat.value }}</span>
          </div>
        </div>
      </div>

      <div class="ending-actions">
        <button class="btn btn-primary btn-large" @click="game.startNewGame()">
          🔄 再来一局
        </button>
        <button class="btn btn-large" @click="game.goToTitle()">
          🏠 返回标题
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ending-screen {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 20px;
}

.ending-content {
  max-width: 550px;
  width: 100%;
  text-align: center;
}

.ending-badge {
  display: inline-block;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.type-good { background: rgba(34, 197, 94, 0.2); color: var(--success); border: 1px solid var(--success); }
.type-normal { background: rgba(234, 179, 8, 0.2); color: var(--warning); border: 1px solid var(--warning); }
.type-bad { background: rgba(239, 68, 68, 0.2); color: var(--danger); border: 1px solid var(--danger); }
.type-hidden { background: rgba(168, 85, 247, 0.2); color: var(--accent-purple); border: 1px solid var(--accent-purple); }

.ending-icon {
  font-size: 5rem;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

.ending-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ending-description {
  font-size: 1rem;
  line-height: 2;
  color: var(--text-secondary);
  margin-bottom: 32px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.ending-stats {
  margin-bottom: 32px;
}

.ending-stats h3 {
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.final-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.fs-icon { font-size: 1.3rem; }
.fs-label { font-size: 0.75rem; color: var(--text-muted); }
.fs-value { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }

.ending-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-large {
  padding: 14px 32px;
  font-size: 1.05rem;
}

@media (max-width: 500px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .ending-title {
    font-size: 1.6rem;
  }
  .ending-actions {
    flex-direction: column;
  }
}
</style>
