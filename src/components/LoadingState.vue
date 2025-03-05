<script setup>
const { loadingText } = defineProps({
  loadingText: {
    type: String,
    default: '正在加载版本数据...'
  }
})
</script>

<template>
  <div class="loading-state">
    <div class="loader"></div>
    <span class="loading-text">{{ loadingText }}</span>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl) 0;
}

.loader {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>