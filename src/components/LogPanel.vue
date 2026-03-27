<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const game = useGameStore()
</script>

<template>
  <div class="card log-panel">
    <div class="card-title">📝 日志</div>
    <div class="log-list">
      <div
        v-for="(log, index) in game.state.logs.slice(0, 20)"
        :key="index"
        class="log-item slide-in"
        :class="`log-${log.type}`"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        {{ log.text }}
      </div>
      <div v-if="game.state.logs.length === 0" class="log-empty">
        暂无日志...
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-panel {
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.log-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.log-item {
  padding: 8px 12px;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  line-height: 1.5;
  border-left: 3px solid transparent;
}

.log-item.log-info {
  border-left-color: var(--accent-blue);
}

.log-item.log-success {
  border-left-color: var(--success);
}

.log-item.log-warning {
  border-left-color: var(--warning);
}

.log-item.log-danger {
  border-left-color: var(--danger);
}

.log-empty {
  text-align: center;
  color: var(--text-muted);
  padding: 20px;
  font-size: 0.9rem;
}
</style>
