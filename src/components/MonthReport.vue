<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const game = useGameStore()

const monthStats = computed(() => {
  const start = game.state.monthStartStats
  if (!start) return null

  return {
    skill: { before: start.skill, after: game.state.skill, diff: game.state.skill - start.skill },
    fans: { before: start.fans, after: game.state.fans, diff: game.state.fans - start.fans },
    mental: { before: start.mental, after: game.state.mental, diff: game.state.mental - start.mental },
    money: { before: start.money, after: game.state.money, diff: game.state.money - start.money },
  }
})

function formatDiff(val: number): string {
  if (val > 0) return `↑${val}`
  if (val < 0) return `↓${Math.abs(val)}`
  return '→ 0'
}

function diffClass(val: number): string {
  if (val > 0) return 'diff-up'
  if (val < 0) return 'diff-down'
  return 'diff-neutral'
}
</script>

<template>
  <div class="report-overlay">
    <div class="report-modal fade-in">
      <div class="report-header">
        <span class="report-icon">📊</span>
        <h2>第{{ game.state.month }}月 月度报告</h2>
      </div>

      <div class="report-body">
        <!-- Income/Expense -->
        <div class="report-section">
          <div class="report-row">
            <span class="row-label">本月收入</span>
            <span class="row-value income">+{{ game.state.monthlyIncome.toLocaleString() }} 元</span>
          </div>
          <div class="report-row">
            <span class="row-label">本月支出</span>
            <span class="row-value expense">-{{ game.state.monthlyExpense.toLocaleString() }} 元</span>
          </div>
          <div class="report-row report-row-total">
            <span class="row-label">净收入</span>
            <span
              class="row-value"
              :class="game.state.monthlyIncome - game.state.monthlyExpense >= 0 ? 'income' : 'expense'"
            >
              {{ (game.state.monthlyIncome - game.state.monthlyExpense) >= 0 ? '+' : '' }}{{ (game.state.monthlyIncome - game.state.monthlyExpense).toLocaleString() }} 元
            </span>
          </div>
        </div>

        <!-- Stat Changes -->
        <div class="report-section" v-if="monthStats">
          <h3 class="section-title">属性变化</h3>
          <div class="stat-change">
            <span class="stat-label">🎨 画技</span>
            <span class="stat-values">
              {{ monthStats.skill.before }} → {{ monthStats.skill.after }}
              <span :class="diffClass(monthStats.skill.diff)">({{ formatDiff(monthStats.skill.diff) }})</span>
            </span>
          </div>
          <div class="stat-change">
            <span class="stat-label">👥 粉丝</span>
            <span class="stat-values">
              {{ monthStats.fans.before.toLocaleString() }} → {{ monthStats.fans.after.toLocaleString() }}
              <span :class="diffClass(monthStats.fans.diff)">({{ formatDiff(monthStats.fans.diff) }})</span>
            </span>
          </div>
          <div class="stat-change">
            <span class="stat-label">🧠 精神</span>
            <span class="stat-values">
              {{ monthStats.mental.before }} → {{ monthStats.mental.after }}
              <span :class="diffClass(monthStats.mental.diff)">({{ formatDiff(monthStats.mental.diff) }})</span>
            </span>
          </div>
          <div class="stat-change">
            <span class="stat-label">💰 余额</span>
            <span class="stat-values">
              ¥{{ monthStats.money.before.toLocaleString() }} → ¥{{ monthStats.money.after.toLocaleString() }}
            </span>
          </div>
        </div>

        <!-- Current Status Summary -->
        <div class="report-section">
          <h3 class="section-title">当前状态</h3>
          <div class="status-summary">
            <div class="summary-item">
              <span>💰</span>
              <span>¥{{ game.state.money.toLocaleString() }}</span>
            </div>
            <div class="summary-item">
              <span>🎨</span>
              <span>Lv.{{ game.skillLevel.level }} {{ game.skillLevel.title }}</span>
            </div>
            <div class="summary-item">
              <span>👥</span>
              <span>{{ game.state.fans.toLocaleString() }} 粉丝</span>
            </div>
            <div class="summary-item">
              <span>🔥</span>
              <span>热度 {{ game.state.popularity }}</span>
            </div>
          </div>
        </div>

        <button class="btn btn-primary btn-block" @click="game.closeMonthReport()">
          继续下个月 →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-overlay {
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

.report-modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.report-header {
  background: linear-gradient(135deg, var(--bg-card), var(--bg-secondary));
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.report-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 8px;
}

.report-header h2 {
  font-size: 1.3rem;
}

.report-body {
  padding: 24px;
}

.report-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.report-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.report-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.95rem;
}

.report-row-total {
  border-top: 1px dashed var(--border-color);
  margin-top: 8px;
  padding-top: 10px;
  font-weight: 700;
}

.row-label {
  color: var(--text-secondary);
}

.income { color: var(--success); }
.expense { color: var(--danger); }

.stat-change {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.9rem;
}

.stat-label {
  color: var(--text-secondary);
}

.diff-up { color: var(--success); font-weight: 600; }
.diff-down { color: var(--danger); font-weight: 600; }
.diff-neutral { color: var(--text-muted); }

.status-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.btn-block {
  width: 100%;
  margin-top: 8px;
}
</style>
