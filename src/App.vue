<script setup lang="ts">
import { useGameStore } from './stores/gameStore'
import TitleScreen from './components/TitleScreen.vue'
import GameScreen from './components/GameScreen.vue'
import EventScreen from './components/EventScreen.vue'
import MonthReport from './components/MonthReport.vue'
import EndingScreen from './components/EndingScreen.vue'

const game = useGameStore()
</script>

<template>
  <div class="app-container">
    <TitleScreen v-if="game.state.currentScreen === 'title'" />
    <GameScreen v-else-if="game.state.currentScreen === 'game'" />
    <EventScreen v-else-if="game.state.currentScreen === 'event'" />
    <MonthReport v-else-if="game.state.currentScreen === 'monthReport'" />
    <EndingScreen v-else-if="game.state.currentScreen === 'ending'" />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
