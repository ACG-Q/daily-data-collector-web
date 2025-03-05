<script lang="ts" setup>
import {GITHUB_OWNER, GITHUB_REPO_NAME} from "@/config";
import {computed, ref} from "vue";

const TECH_STACK = [
  'Vue 3 Composition API',
  'TypeScript 5+',
  'Vue Router 4',
  'Pinia 2+',
  'Axios 1.3+'
]
const showEgg = ref(false)
const hoverCount = ref(0)
const clickCount = ref(0)
const startTime = ref(0)
const timer = ref()

// 生成随机数
const aiPower = computed(() => Math.floor(Math.random() * 5 + 1))
// 动态生成彩蛋信息
const dynamicMessage = computed(() => {
  const messages = [
    `AI 生成了 ${aiPower.value} 个快乐因子！`,
    `咖啡因转换为代码效率 +${aiPower.value}00%`,
    `检测到 ${aiPower.value} 个未解决的 bug 🐛`,
    `AI 偷偷帮你写了 ${aiPower.value} 行代码`
  ]
  return messages[Math.floor(Math.random() * messages.length)]
})

// 触发彩蛋
const handleEggClick = () => {
  if (showEgg.value) return

  clickCount.value++

  if (startTime.value === 0) {
    startTime.value = Date.now()
    return
  }

  const isTimeout = Date.now() - startTime.value >= 1000
  const isTriggered = clickCount.value >= 3
  if (isTimeout) {
    // 超时后重置为新的计数周期
    startTime.value = Date.now()
    clickCount.value = 1
    return
  }

  if (isTriggered) {
    showEgg.value = true

    // 清除之前的定时器
    if (timer.value) clearTimeout(timer.value)

    // 设置新的自动关闭
    timer.value = setTimeout(() => {
      showEgg.value = false
      clickCount.value = 0
      startTime.value = 0
      timer.value = null
    }, 5000)

    console.log(
        '%c[彩蛋激活] 当前AI能量等级：%c' + aiPower.value + '%c🌟\n' +
        `%cGitHub: https://github.com/${GITHUB_OWNER}/${GITHUB_REPO_NAME}`,
        'color: #3b82f6;',
        'font-size: 2em; color: #f59e0b;',
        '',
        'color: #64748b;'
    )
  }
}
</script>

<template>
  <div class="about-container">
    <section class="about-section">
      <h1>关于数据采集系统</h1>

      <div class="content-card">
        <h2>项目简介</h2>
        <p class="description">本系统主要用于自动化收集和处理日常业务数据，支持多数据源接入和标准化输出。</p>
        <p class="description">当前版本聚焦于 GitHub Actions 相关数据的采集与分析。</p>
      </div>

      <div class="content-card">
        <h2>GitHub 项目</h2>
        <dl class="github-info">
          <div class="info-item">
            <dt>项目维护者</dt>
            <dd>{{ GITHUB_OWNER }}</dd>
          </div>
          <div class="info-item">
            <dt>代码仓库</dt>
            <dd>
              <a
                  :href="`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO_NAME}`"
                  class="github-link"
                  target="_blank"
              >
                {{ GITHUB_REPO_NAME }}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div class="content-card">
        <h2>技术架构</h2>
        <ul class="tech-list">
          <li v-for="(tech, index) in TECH_STACK" :key="index">
            {{ tech }}
          </li>
        </ul>
      </div>

      <div :class="{ 'egg-triggered': showEgg }"
           class="content-card secret-egg"
           @click="handleEggClick"
           @mouseover="hoverCount++">
        <h2>开发日志 <span class="emoji">📝</span></h2>

        <transition name="egg-bounce">
          <div v-if="showEgg" class="egg-content">
            <div class="egg-text">
              <span class="ai-effect">🤖×{{ aiPower }}</span>
              <p>{{ dynamicMessage }}</p>
              <div class="console-hint">(看看控制台有惊喜)</div>
            </div>
            <div class="particles">
              <span v-for="n in 30" :key="n" class="particle">💻</span>
            </div>
          </div>
        </transition>
      </div>

    </section>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: var(--space-lg) auto;
  padding: 0 var(--space-md);
}

.about-section h1 {
  font-size: 1.8rem;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--space-lg);
}

.content-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: var(--space-sm) 0;
}

.github-info {
  display: grid;
  gap: var(--space-md);
}

.info-item {
  display: flex;
  gap: var(--space-md);
  align-items: baseline;
}

.info-item dt {
  color: var(--text-primary);
  font-weight: 600;
  min-width: 100px;
}

.info-item dd {
  color: var(--text-secondary);
  margin: 0;
}

.github-link {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-hover);
    text-decoration: underline;
  }
}

.tech-list {
  display: grid;
  gap: var(--space-sm);
  padding-left: var(--space-md);

  li {
    color: var(--text-secondary);
    padding: var(--space-sm);
    background: var(--bg);
    border-radius: var(--radius-sm);

    &::before {
      content: "▹ ";
      color: var(--primary);
    }
  }
}

/* ==== 彩蛋 ==== */
.secret-egg {
  cursor: help;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);

  user-select: none;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.2)
  }
}

.egg-content {
  position: relative;
  z-index: 2;
}

.ai-effect {
  display: block;
  font-size: 2.5rem;
  animation: glow 1.5s ease-in-out infinite;
}

.egg-text {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-md);
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  animation: float 3s infinite linear;
  opacity: 0;
}

@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px #3b82f6);
  }
  50% {
    filter: drop-shadow(0 0 20px #3b82f6);
  }
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(720deg);
    opacity: 0;
  }
}

.console-hint {
  font-size: 0.8em;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  opacity: 0.7;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounceOut {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
