/**
 * 分类的名称映射
 * - windows: 🪟 Windows
 * - macos:  🍎 macOS
 * - ubuntu: 🐧 Ubuntu
 */
export const CATEGORY_MAPPING: Record<string, string> = {
    windows: '🪟 Windows',
    macos: '🍎 macOS',
    ubuntu: '🐧 Ubuntu',
    other: '🌐 Other'
}

/**
 * 仓库状态
 * - active: 活跃
 * - deprecated: 不活跃
 * - unknown: 未知
 * */
export const REPO_STATUS: Record<string, string> = {
    active: '活跃',
    deprecated: '不活跃',
    unknown: '未知'
}

/**
 * 仓库状态ICON
 * - active: ✅
 * - deprecated: ❌
 * - unknown: ℹ️
 * */
export const REPO_STATUS_ICON: Record<string, string> = {
    active: '✅',
    deprecated: '❌',
    unknown: 'ℹ️'
}





// 仓库所有者
export const GITHUB_OWNER = "ACG-Q";

// 仓库
export const GITHUB_REPO_NAME = "daily-data-collector";

// Raw URL
export const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO_NAME}/refs/heads/`;



// runnerImages 的数据源地址
export const RUNNER_IMAGES_URL = `${RAW_URL}/main/runner-images.json`;

// action versions 的数据源地址
export const ACTION_VERSIONS_URL = `${RAW_URL}/main/actions-versions.json`;

// 节假日数据来源地址
// https://github.com/ACG-Q/daily-data-collector/blob/main/holidays/holidays_2025.json
export const HOLIDAYS_URL = `${RAW_URL}/main/holidays/holidays_{year}.json`;


// 数据过期时间
export const EXPIRE_TIME = 1000 * 60 * 60 * 12; // 半天