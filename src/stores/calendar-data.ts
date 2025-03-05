import { HOLIDAYS_URL } from "@/config";
import { defineStore } from "pinia";
import dayjs from "dayjs";

// 类型定义集中管理
interface HolidayDetails {
    dates: string[]; // YYYY-MM-DD 00:00:00
    work_days?: string[]; // 明确可选属性
}

interface ParsedHolidayData {
    [holidayName: string]: HolidayDetails;
}

export enum DayType {
    Workday = 'workday',
    Weekend = 'weekend',
    Holiday = 'holiday',
    AdjustedWorkday = 'adjusted_workday',
}

interface Holiday {
    year: number;
    title: string;
    link: string;
    content: string;
    parsed_data: ParsedHolidayData;
    publish_date: string;
}

interface CalendarDayType {
    date: string; // YYYY-MM-DD
    type: DayType;
    holidayName?: string;
}

interface CalendarData {
    isLoading: boolean;
    data: CalendarDayType[];
    error: Error | null;
}


/**
 * 格式化日期数组，将日期字符串转换为 YYYY-MM-DD 格式。
 * @param dates - 日期数组，包含多个日期字符串。
 */
const formatDateArray = (dates: string[]): string[] => {
    return dates.map(date => dayjs(date).format('YYYY-MM-DD'));
};

/**
 * 从指定的API获取某年的节假日数据，并返回最新的节假日信息。
 *
 * @param year - 需要获取节假日数据的年份。
 * @returns 返回一个包含最新节假日数据的 `Holiday` 对象。
 * @throws 如果请求失败、没有节假日数据或数据格式无效，将抛出错误。
 */
const fetchAPI = async (year: number): Promise<Holiday> => {
    const response = await fetch(HOLIDAYS_URL.replace('{year}', String(year)));
    if (!response.ok) {
        throw new Error(`Failed to fetch holidays: ${response.statusText}`);
    }

    const data: Holiday[] = await response.json();
    if (data.length === 0) {
        throw new Error('No holidays data available');
    }

    // 查找最新发布的节假日数据
    const latestHolidayData = data.reduce((latest, current) =>
        new Date(current.publish_date).getTime() > new Date(latest.publish_date).getTime()
            ? current
            : latest
    );

    // 校验并处理 parsed_data
    if (!latestHolidayData.parsed_data || typeof latestHolidayData.parsed_data !== 'object') {
        throw new Error('Invalid parsed_data format');
    }

    for (const [holidayName, holidayDetails] of Object.entries(latestHolidayData.parsed_data)) {
        if (!holidayDetails.dates || !Array.isArray(holidayDetails.dates)) {
            throw new Error(`Invalid dates format for holiday: ${holidayName}`);
        }

        // 格式化 dates
        holidayDetails.dates = formatDateArray(holidayDetails.dates);

        // 格式化 work_days（如果存在）
        if (holidayDetails.work_days && Array.isArray(holidayDetails.work_days)) {
            holidayDetails.work_days = formatDateArray(holidayDetails.work_days);
        }
    }

    return latestHolidayData;
};

/**
 * 定义日历数据的存储和操作
 */
export const useCalendarStore = defineStore('calendar', {
    state: (): CalendarData => ({
        isLoading: false,
        data: [],
        error: null,
    }),
    actions: {

        // 获取日历数据
        async fetchCalendarData(year: number) {
            this.isLoading = true;
            try {
                // 获取最新的节假日数据
                const holidayData = await fetchAPI(year);
                this.data = this.generateCalendarDays(year, holidayData.parsed_data);
                this.error = null;
            } catch (error) {
                this.error = error instanceof Error ? error : new Error('Failed to fetch calendar data');
                console.error('Failed to fetch calendar data:', error);
            } finally {
                this.isLoading = false;
            }
        },

        // 生成日历数据
        generateCalendarDays(year: number, holidayData: ParsedHolidayData): CalendarDayType[] {
            const calendarDays: CalendarDayType[] = [];
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);

            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                // YYYY-MM-DD
                // 使用dayjs获取日期字符串
                const dateString = dayjs(date).format('YYYY-MM-DD');
                const dayOfWeek = date.getDay();

                // 默认类型为工作日
                let type = DayType.Workday;
                let holidayName: string | undefined = undefined;

                // 检查是否是周末
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    type = DayType.Weekend;
                }

                // 检查是否是节假日
                for (const [holidayNameKey, holidayDetails] of Object.entries(holidayData)) {
                    if (holidayDetails.dates.includes(dateString)) {
                        type = DayType.Holiday;
                        holidayName = holidayNameKey;
                        break;
                    }
                }

                // 检查是否是调休工作日
                for (const [holidayNameKey, holidayDetails] of Object.entries(holidayData)) {
                    if (holidayDetails.work_days?.includes(dateString)) {
                        type = DayType.AdjustedWorkday;
                        holidayName = holidayNameKey;
                        break;
                    }
                }

                calendarDays.push({
                    date: dateString,
                    type,
                    holidayName,
                });
            }

            return calendarDays;
        },
    }
});