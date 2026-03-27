<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const game = useGameStore()

function handleStart() {
  game.startNewGame()
}

function handleLoad() {
  if (game.loadGame()) {
    game.addLog('📂 读取存档成功！', 'success')
  }
}
</script>

<template>
  <div class="title-screen">
    <div class="title-content fade-in">
      <div class="title-icon">🎨</div>
      <h1 class="title-text">小画师模拟器</h1>
      <p class="title-subtitle">Little Artist Simulator</p>
      <p class="title-desc">
        扮演一名自媒体二次元小画师<br>
        在画技、金钱、精神与粉丝之间寻找平衡<br>
        开启属于你的创作之旅！
      </p>
      <div class="title-buttons">
        <button class="btn btn-primary btn-large" @click="handleStart">
          ✨ 开始新游戏
        </button>
        <button
          class="btn btn-large"
          :class="{ 'btn-disabled': !game.hasSaveData() }"
          @click="handleLoad"
        >
          📂 继续游戏
        </button>
      </div>
      <div class="title-footer">
        <span>v0.1 · 文字模拟经营</span>
      </div>
    </div>
    <div class="title-decorations">
      <span class="deco deco-1">✏️</span>
      <span class="deco deco-2">🖌️</span>
      <span class="deco deco-3">🎮</span>
      <span class="deco deco-4">💰</span>
      <span class="deco deco-5">⭐</span>
      <span class="deco deco-6">📱</span>
    </div>
  </div>
</template>

<style scoped>
.title-screen {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.title-content {
  text-align: center;
  z-index: 2;
  padding: 40px;
}

.title-icon {
  font-size: 5rem;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

.title-text {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.title-subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 24px;
  letter-spacing: 2px;
}

.title-desc {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 40px;
}

.title-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.btn-large {
  padding: 14px 40px;
  font-size: 1.1rem;
  min-width: 220px;
}

.title-footer {
  margin-top: 40px;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.title-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco {
  position: absolute;
  font-size: 2rem;
  opacity: 0.15;
  animation: float 4s ease-in-out infinite;
}
.deco-1 { top: 10%; left: 10%; animation-delay: 0s; }
.deco-2 { top: 20%; right: 15%; animation-delay: 0.5s; }
.deco-3 { bottom: 30%; left: 8%; animation-delay: 1s; }
.deco-4 { top: 40%; right: 8%; animation-delay: 1.5s; }
.deco-5 { bottom: 15%; right: 20%; animation-delay: 2s; }
.deco-6 { bottom: 20%; left: 20%; animation-delay: 2.5s; }

@media (max-width: 600px) {
  .title-text { font-size: 2rem; }
  .title-icon { font-size: 3.5rem; }
  .title-desc { font-size: 0.9rem; }
}
</style>
