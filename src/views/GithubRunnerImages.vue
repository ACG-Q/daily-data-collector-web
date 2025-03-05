<script lang="ts" setup>
import {useRunnerImagesStore} from "@/stores/github-runner-images.ts";
import {CATEGORY_MAPPING} from "@/config";
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import LoadingState from "@/components/LoadingState.vue";
import EmptyState from "@/components/EmptyState.vue";

// 保存 url 参数
const route = useRoute()
const paramType = computed(() => route.query.type as string ?? "html")

const store = useRunnerImagesStore()
const fetchActionsVersion = store.fetchRunnerImages;
const data = computed(() => store.data)
const isLoading = computed(() => store.isLoading)
const error = computed(() => store.error)

const showToast = ref(false)
const toastDom = ref<HTMLDivElement>()
const toastTime = ref<number>()

onMounted(() => {
  fetchActionsVersion();
})


// 转换 category 名称
const categoryName = (category: string) => {
  return CATEGORY_MAPPING[category] ?? 'Other';
}

// code 复制
const copyCode = (code: string) => {
  navigator.clipboard.writeText(code).then(() => {
    if (toastTime.value) clearTimeout(toastTime.value)
    if (toastDom.value) {
      showToast.value = true
      toastDom.value.textContent = `Copied ${code}`;

      // 2 秒后隐藏 toast 元素
      toastTime.value = setTimeout(() => {
        showToast.value = false
        toastDom.value!.textContent = '';
      }, 2000)
    }
  }).catch((err) => {
    console.error('Failed to copy text:', err);
    if (toastDom.value) {
      showToast.value = true
      toastDom.value.textContent = 'Copy failed';
      toastTime.value = setTimeout(() => {
        showToast.value = false
        toastDom.value!.textContent = '';
      }, 2000)
    }
  });
}

</script>

<template>
  <div class="container">
    <!-- Loading State -->
    <LoadingState v-if="isLoading" :loading-text="'正在加载最新Runner OS版本数据...'"/>

    <!-- Empty State -->
    <EmptyState v-else-if="data?.labels.length === 0" :empty-text="'暂无可用版本数据'"/>

    <div v-else id="content">
      <h1 class="page-title">GitHub Runner Images</h1>
      <div id="output">
        <div v-if="paramType === 'json'">
          <pre>{{ JSON.stringify(data) }}</pre>
        </div>
        <div v-else-if="paramType === 'md'">
          <div v-for="(items, category) in data?.categories">
            <span>- **{{ categoryName(category) }}**: </span>
            <span v-for="item in items">{{ item.image }}({{ item.yamlLabels.join(", ") }})</span>
          </div>
          <br/>
          <div>- **Last updated**: {{ data?.updated }}</div>
        </div>
        <div v-else-if="paramType === 'txt'">
          <div v-for="(items, category) in data?.categories">
            <span>{{ categoryName(category) }}: </span>
            <span v-for="item in items">{{ item.image }}({{ item.yamlLabels.join(", ") }})</span>
          </div>
          <br/>
          <div>Last updated: {{ data?.updated }}</div>
        </div>
        <div v-else>
          <div>
            <template v-for="(items, category) in data?.categories">
              <!--  数据显示区域   -->
              <div v-show="items.length > 0" class="os-section">
                <h2>{{ categoryName(category) }}</h2>
                <div v-for="item in items" class="os-item">
                  <p><strong>Image:</strong>{{ item.image }}</p>
                  <p><strong>YAML Label:</strong><code v-for="yaml in item.yamlLabels" @click="copyCode(yaml)">{{
                      yaml
                    }}</code></p>
                </div>
              </div>
            </template>
          </div>
          <!--  来源显示区域  -->
          <div class="os-section">
            <p>Last updated: {{ data?.updated ?? "N/A" }}</p>
            <p>Data source: <a href="https://github.com/{{data?.source ?? 'actions/runner-images' }}"
                               target="_blank">{{ data?.source ?? 'actions/runner-images' }}</a></p>
          </div>
        </div>
      </div>
    </div>
    <div ref="toastDom" class="toast" :class="showToast ? 'show' : ''"></div>
  </div>
</template>

<style scoped>

.container {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.page-title {
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--space-xl);
}

h1 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.os-section {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-md);
}

.os-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.os-item {
  padding: 1rem;
  margin: 0.5rem 0;
  background: var(--bg);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.os-item p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.os-item p strong {
  color: var(--primary);
}

.os-item p code:not(:last-of-type) {
  margin-right: 0.25rem;
}

/* Toast 样式 */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: var(--bg);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-md);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 1000;
}

.toast.show {
  opacity: 1;
}

code {
  background: var(--bg);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--border);
  font-family: monospace;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
  user-select: none;
}

code:hover {
  background: var(--primary);
  color: var(--bg)
}
</style>