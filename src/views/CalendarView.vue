<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import dayjs, {Dayjs} from 'dayjs';
import {DayType, useCalendarStore} from "@/stores/calendar-data.ts";
import LoadingState from "@/components/LoadingState.vue";
import EmptyState from "@/components/EmptyState.vue";

const currentDate = ref<Dayjs>(dayjs());
const store = useCalendarStore();
const fetchCalendarData = store.fetchCalendarData;
const calendarDay = computed(() => store.data)
const isLoading = computed(() => store.isLoading)

interface DayInfo {
  type: DayType;
  holidayName?: string;
  isAdjustment?: boolean;
}

// 使用Map存储日期信息
const dateInfoMap = computed(() => {
  const map = new Map<string, DayInfo>();
  calendarDay.value.forEach(day => {
    map.set(day.date, {
      type: day.type,
      holidayName: day.holidayName,
      isAdjustment: day.type === DayType.AdjustedWorkday
    });
  });
  return map;
});

watch(() => currentDate.value.year(), () => {
  fetchCalendarData(currentDate.value.year());
}, {
  immediate: true
})

// 当前月日期数组
const currentMonthDays = computed(() => {
  const days: Dayjs[] = [];
  const monthStart = currentDate.value.startOf('month');
  const daysInMonth = monthStart.daysInMonth();
  const startDayOfWeek = monthStart.day() === 0 ? 6 : monthStart.day() - 1;

  // 上月补白
  for (let i = startDayOfWeek; i > 0; i--) {
    days.push(monthStart.subtract(i, 'day'));
  }

  // 本月日期
  for (let i = 0; i < daysInMonth; i++) {
    days.push(monthStart.add(i, 'day'));
  }

  // 下月补白
  const totalCells = 6 * 7;
  const remaining = totalCells - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(monthStart.endOf('month').add(i, 'day'));
  }

  return days;
});

// 日期信息获取
const getDateInfo = (date: Dayjs): DayInfo => {
  return dateInfoMap.value.get(date.format('YYYY-MM-DD')) || {type: DayType.Workday};
};

// 时间切换
const changeMonth = (offset: number) => {
  currentDate.value = currentDate.value.add(offset, 'month');
};

const setToday = () => {
  currentDate.value = dayjs();
};

// 年份选择相关
const showYearSelector = ref(false);
const years = computed(() => {
  const currentYear = currentDate.value.year();
  return Array.from({length: 12}, (_, i) => currentYear - 5 + i);
});
</script>

<template>
  <div class="calendar-container">
    <!-- 控制栏 -->
    <div class="calendar-controls">
      <button class="nav-button" @click="changeMonth(-1)">&lt;</button>

      <div class="date-display">
        <span class="year-month" @click="showYearSelector = !showYearSelector">
          {{ currentDate.format('YYYY年MM月') }}
        </span>
        <button class="today-button" @click="setToday">今天</button>
      </div>

      <button class="nav-button" @click="changeMonth(1)">&gt;</button>
    </div>

    <LoadingState v-if="isLoading" :loading-text="'正在加载日历数据...'"/>

    <EmptyState v-else-if="!calendarDay || calendarDay.length===0" :empty-text="'暂无可用日历数据'"/>

    <template v-else>
      <!-- 年份选择 -->
      <div v-if="showYearSelector" class="year-selector">
        <button
            v-for="year in years"
            :key="year"
            class="year-button"
            :class="{ active: year === currentDate.year() }"
            @click="currentDate = currentDate.year(year); showYearSelector = false"
        >
          {{ year }}
        </button>
      </div>

      <!-- 日历主体 -->
      <div class="calendar-grid">
        <div
            v-for="day in ['一', '二', '三', '四', '五', '六', '日']"
            :key="day"
            class="calendar-header"
        >
          {{ day }}
        </div>

        <div
            v-for="(date, index) in currentMonthDays"
            :key="index"
            :class="[
          'calendar-cell',
          getDateInfo(date).type,
          {
            'current-month': date.month() === currentDate.month(),
            'today': date.month() === currentDate.month() && date.isSame(dayjs(), 'day'),
            'selected': date.month() === currentDate.month() && date.isSame(dayjs(), 'day'),
            'adjusted': getDateInfo(date).isAdjustment // 新增调休类
          }
        ]"
        >
          <div class="date-info">
            <span class="day">{{ date.date() }}</span>
            <span v-if="date.isSame(dayjs(), 'day')" class="today-marker">今</span>
            <!-- 新增调休标记 -->
            <span v-if="getDateInfo(date).isAdjustment" class="adjustment-marker">调</span>
          </div>
          <div class="holiday-container">
            <template v-if="getDateInfo(date).holidayName">
              <span class="holiday-icon">🎉</span>
              <span class="holiday-info">
              {{ getDateInfo(date).holidayName }}
            </span>
            </template>
          </div>
        </div>
      </div>
    </template>


  </div>
</template>

<style scoped>
.calendar-container {
  --cell-size: 100px;

  max-width: calc(var(--cell-size) * 7 + 14px);
  margin: var(--space-md) auto;
  padding: var(--space-md);
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}

/* 控制栏 */
.calendar-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  padding: var(--space-sm);
  gap: var(--space-md);

  button {
    flex: 0 0 auto;
    padding: var(--space-xs) var(--space-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--card-bg);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--bg-secondary);
    }
  }
}

.year-month {
  font: 500 1.2rem/1.5 system-ui;
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-md);

  &:hover {
    background: var(--bg-secondary);
  }
}

/* 日历网格 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.calendar-header {
  padding: var(--space-sm);
  text-align: center;
  background: var(--bg-secondary);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* 日期单元格 */
.calendar-cell {
  min-height: var(--cell-size);
  padding: var(--space-sm);
  background: var(--card-bg);
  position: relative;
  transition: all 0.2s;

  &:not(.current-month) {
    background: var(--bg-secondary);
    color: var(--disabled);

    .day {
      opacity: 0.6;
    }
  }

  &.today {
    background: var(--active-bg);
  }

  &.selected {
    box-shadow: inset 0 0 0 2px var(--primary);
  }

  &::after {
    /* 类型指示条 */
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 4px;
    height: 30px;
    transform: translateY(-50%);
    background: var(--info);
  }

  .date-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-xs);

    > span {
      padding: 2px 4px;
      border-radius: var(--radius-sm);
      font-size: 0.7rem;

      &.today-marker {
        background: var(--primary);
        color: #fff;
      }

      &.adjustment-marker {
        background: var(--warning);
        color: #fff;
      }
    }
  }
}

/* 日期类型 */
.workday {
  &::after {
    background: var(--success);
  }
}

.holiday {
  background: repeating-linear-gradient(
      45deg,
      rgba(var(--danger-rgb), 0.1) 0 10px,
      rgba(var(--danger-rgb), 0.05) 10px 20px
  );

  &::after {
    background: var(--danger);
  }
}


/* 调休背景 */
.adjusted {
  background: repeating-linear-gradient(
      45deg,
      rgba(var(--warning-rgb), 0.1) 0 10px,
      rgba(var(--warning-rgb), 0.05) 10px 20px
  );

  &::after {
    background: var(--warning);
  }
}

.year-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.year-button {
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #f8f9fa;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.year-button:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.year-button.active {
  background: #2196f3;
  color: #fff;
}

@media (max-width: 768px) {
  .year-selector {
    grid-template-columns: repeat(2, 1fr);
  }

  .year-button {
    font-size: 0.9rem;
    padding: 8px;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  :root {
    --cell-size: 70px;
  }

  .calendar-container {
    margin: var(--space-sm);
    padding: var(--space-sm);
  }

  .holiday-icon {
    display: none;
  }

  .holiday-info {
    font-size: 0.6rem;
  }

  .date-remark {
    display: none;
  }

  .adjustment-marker {
    position: absolute;
    top: 2px;
    right: 2px;
    padding: 1px 3px;
  }
}
</style>