<template>
  <main class="home-container">
    <section class="hero-section">
      <h1>数据采集系统</h1>
      <p class="tagline">每日数据自动化收集工具</p>
    </section>

    <section class="features">
      <div class="feature-card">
        <h2>主要功能</h2>
        <ul>
          <li>定时数据收集</li>
          <li>数据格式转换</li>
          <li>异常数据检测</li>
          <li>多平台支持</li>
        </ul>
      </div>

      <div class="feature-card">
        <h2>技术实现</h2>
        <ul>
          <li>Vue 3 + TypeScript</li>
          <li>响应式布局</li>
          <li>REST API交互</li>
          <li>自动化构建</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: var(--space-lg) auto;
  padding: 0 var(--space-md);
}

.hero-section {
  text-align: center;
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--border);
}

.tagline {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-top: var(--space-sm);
}

.features {
  display: grid;
  gap: var(--space-lg);
  margin-top: var(--space-lg);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.feature-card {
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background: var(--card-bg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  h2 {
    color: var(--text-primary);
    font-size: 1.2rem;
    margin-bottom: var(--space-sm);
  }

  ul {
    list-style: none;
    padding-left: 0;

    li {
      padding: var(--space-sm) 0;
      color: var(--text-secondary);
      &::before {
        content: "• ";
        color: var(--primary);
      }
    }
  }
}
</style>
