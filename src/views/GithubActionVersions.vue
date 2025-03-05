<script lang="ts" setup>
import {useActionVersionsStore} from '@/stores/github-actions-versions'
import {REPO_STATUS, REPO_STATUS_ICON} from "@/config";
import Markdown from "@/components/Markdown.vue";
import {computed, onMounted, ref} from "vue";
import LoadingState from "@/components/LoadingState.vue";
import EmptyState from "@/components/EmptyState.vue";

// Pinia store
const store = useActionVersionsStore();
const fetchActionsVersion = store.fetchActionsVersion
const actionVersions = computed(() => store.data)
const isLoading = computed(() => store.isLoading)
const error = computed(() => store.error)

const showToast = ref(false)
const toastDom = ref<HTMLElement | null>(null)
const toastTime = ref<number | null>(null)
const searchKeyword = ref('')

onMounted(() => {
  fetchActionsVersion();
})

// 新增计算属性
const filteredActions = computed(() => {
  if (!actionVersions || !actionVersions.value?.actions) return []
  return actionVersions.value?.actions.filter(action => {
    const search = searchKeyword.value.toLowerCase()
    return action.repo.toLowerCase().includes(search) ||
        action.latest.toLowerCase().includes(search)
  })
})

// Formatting utilities
const formatStatus = (status: string) => (REPO_STATUS[status] || REPO_STATUS["unknown"])

const getStatusIcon = (status: string) => (REPO_STATUS_ICON[status] || REPO_STATUS_ICON["unknown"])

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

const copyToClipboard = (version: string) => {
  navigator.clipboard.writeText(version)
      .then(() => {
        if (toastDom.value) {
          showToast.value = true
          toastDom.value.textContent = 'Action已复制';
          toastTime.value = setTimeout(() => {
            showToast.value = false
            toastDom.value!.textContent = '';
          }, 2000)
        }
      })
      .catch((error) => {
        console.error('复制失败：', error)
        if (toastDom.value) {
          showToast.value = true
          toastDom.value.textContent = '复制失败';
          toastTime.value = setTimeout(() => {
            showToast.value = false
            toastDom.value!.textContent = '';
          }, 2000)
        }
      })
}

</script>

<template>
  <div class="versions-container">
    <h1 class="page-title">GitHub Actions 版本列表</h1>

    <div class="search-container card-base">
      <input
          v-model="searchKeyword"
          class="search-input"
          placeholder="输入仓库名或版本号搜索..."
          type="text"
      >
    </div>

    <!-- Loading State -->
    <LoadingState v-if="isLoading" :loading-text="'正在加载版本数据...'"/>

    <!-- Empty State -->
    <EmptyState v-else-if="!actionVersions?.actions?.length" :empty-text="'暂无可用版本数据'"/>

    <!-- Data Display -->
    <div v-else class="version-grid">
      <article
          v-for="action in filteredActions"
          :key="action.repo"
          class="version-card"
      >
        <header class="card-header">
          <div class="title-group">
            <h3 class="repo-name">
              {{ action.repo }}
              <span class="version-tag">{{ action.latest }}</span>
            </h3>
            <div :class="action.status" class="status-badge">
              <span class="status-icon">{{ getStatusIcon(action.status) }}</span>
              {{ formatStatus(action.status) }}
            </div>
          </div>
          <time class="release-date">
            📅 {{ formatDate(action.releaseDate) }}
          </time>
        </header>

        <div class="card-body">
          <div class="compatibility-section">
            <h4 class="section-title">兼容环境</h4>
            <div class="env-tags">
              <span
                  v-for="env in ['ubuntu-latest', 'windows-latest', 'macos-latest']"
                  :key="env"
                  class="env-tag"
              >
                {{ env }}
              </span>
            </div>
          </div>

          <div v-if="action.changelog" class="changelog-section">
            <details>
              <summary class="changelog-summary">
                更新日志
              </summary>
              <Markdown :content="action.changelog" class="markdown-content"/>

            </details>
          </div>
        </div>

        <footer class="card-footer">
          <a
              :href="action.docsUrl"
              class="docs-link"
              rel="noopener"
              target="_blank"
          >
            📚 文档指南
          </a>
          <button
              aria-label="复制Action"
              class="copy-button"
              @click="copyToClipboard(`${action.repo}@v${action.major}`)"
          >
            📋 复制Action
          </button>
        </footer>
      </article>
    </div>
    <div ref="toastDom" :class="showToast ? 'toast show' : 'toast'"></div>
  </div>
</template>

<style scoped>
.versions-container {
  max-width: 1200px;
  margin: var(--space-lg) auto;
  padding: 0 var(--space-md);
}

.page-title {
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--space-xl);
}

.search-container {
  margin-bottom: var(--space-xl);
  padding: var(--space-md);
}

.search-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--card-bg);
  color: var(--text-primary);
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
  }
}

/* Version Grid */
.version-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}

.version-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.card-header {
  margin-bottom: var(--space-md);
}

.title-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.repo-name {
  font-size: 1.2rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.version-tag {
  font-size: 0.8em;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  padding: 0.25em 0.75em;
  border-radius: var(--radius-sm);
}

.status-badge {
  font-size: 0.85rem;
  padding: 0.25em 0.75em;
  border-radius: var(--radius-md);

  &.active {
    background: var(--active-bg);
    color: var(--active);
  }

  &.deprecated {
    background: var(--danger-bg);
    color: var(--danger);
  }
}

.release-date {
  color: var(--text-secondary);
  font-size: 0.85rem;
  display: block;
}

/* Compatibility Section */
.compatibility-section {
  margin-bottom: var(--space-md);
}

.section-title {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: var(--space-xs);
}

.env-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.env-tag {
  background: var(--bg);
  color: var(--text-secondary);
  padding: 0.25em 0.75em;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 0.85rem;
}

/* Changelog Section */
.changelog-summary {
  color: var(--primary);
  cursor: pointer;
  font-weight: 500;
}

.markdown-content {
  background: var(--bg);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  white-space: pre-wrap;
  margin-top: var(--space-xs);
  font-family: monospace;
  font-size: 0.9rem;
}


/* Card Footer */
.card-footer {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border);
}

.docs-link {
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em 1em;
  border-radius: var(--radius-md);
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}

.copy-button {
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--text-primary);
  border: none;
  padding: 0.5em 1em;
  border-radius: var(--radius-md);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(var(--primary-rgb), 0.2);
  }
}
</style>
