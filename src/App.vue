<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const isNavExpanded = ref(false)
</script>

<template>
  <header>
    <div class="logo">
      <img src="./assets/logo.svg" alt="Vue logo" />
    </div>
    <nav>
      <button class="nav-toggle" @click="isNavExpanded = !isNavExpanded">...</button>
      <div class="nav-items" :class="{ 'expanded': isNavExpanded }">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/runner-images">Runner Images</RouterLink>
        <RouterLink to="/action-versions">Action Versions</RouterLink>
        <RouterLink to="/calender">Calender</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--card-bg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  flex-wrap: wrap;
}

.logo {
  height: 3rem;
  transition: transform 0.3s ease;

  img {
    height: 100%;
    &:hover {
      transform: scale(1.05);
    }
  }
}

nav {
  display: flex;
  gap: 2rem;
  margin-left: auto;
  align-items: center;

  .nav-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .nav-items {
    display: flex;
    gap: 2rem;

    &.expanded {
      display: flex;
    }
  }

  a {
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      color: var(--primary);
      background: rgba(var(--primary-rgb), 0.1);
    }

    &.router-link-active {
      color: var(--primary);
      box-shadow: inset 0 -2px 0 var(--primary);
    }
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
  header {
    padding: 1rem;
    justify-content: space-between;
  }

  nav {
    margin-left: 0;
    gap: 1rem;

    .nav-toggle {
      display: block;
    }

    .nav-items {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      right: 1rem;
      background: var(--card-bg);
      padding: 1rem;
      border-radius: 4px;
      box-shadow: var(--shadow-sm);

      &.expanded {
        display: flex;
      }
    }
  }
}
</style>