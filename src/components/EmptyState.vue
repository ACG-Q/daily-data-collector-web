<script setup>
const { emptyText, emptyIcon } = defineProps({
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  emptyIcon: {
    type: String,
    default: '📭'
  }
})
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">{{ emptyIcon }}</div>
    <div class="empty-message">{{ emptyText }}</div>
  </div>
</template>

<style scoped>
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-xl) 0;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}
</style>