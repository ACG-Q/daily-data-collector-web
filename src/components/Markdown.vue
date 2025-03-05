<script setup>
import {computed} from 'vue'
import {marked} from 'marked'
import DOMPurify from 'dompurify'

// 配置marked
marked.setOptions({
  breaks: true // 启用自动换行
})

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

// 使用computed来优化性能，只有content变化时才更新htmlContent
const htmlContent = computed(() => {
  // 将Markdown转换为HTML并进行安全过滤
  const rawHtml = marked(props.content || '')
  return DOMPurify.sanitize(rawHtml)
})
</script>

<template>
  <div class="markdown-body" v-html="htmlContent"></div>
</template>

<style scoped>
.markdown-body {
  padding: var(--space-md);
  color: var(--text-primary);
}

/* 复用项目现有样式体系 */
.markdown-body :deep(pre) {
  background: var(--card-bg);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  margin: var(--space-md) 0;
}

.markdown-body :deep(code) {
  background-color: rgba(var(--primary-rgb), 0.1);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  color: var(--primary);
}

.markdown-body :deep(a) {
  color: var(--primary);
  transition: color 0.2s;
}

.markdown-body :deep(a:hover) {
  color: var(--primary-hover);
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--border);
  padding-left: var(--space-md);
  color: var(--text-secondary);
  margin: var(--space-md) 0;
}
</style>
