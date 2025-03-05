import {defineStore} from "pinia";
import {ACTION_VERSIONS_URL, EXPIRE_TIME} from "@/config";

interface Action {
    repo: string; // 仓库/Action名称
    latest: string; // 最新的标签
    major: string; // 标签的主要版本
    description: string; // 仓库/Action描述
    status: "active" | "deprecated"; // 仓库状态
    releaseDate: string; // 仓库最新发布时间
    changelog: string; // 更新日志
    docsUrl: string; // 仓库地址
}

interface ActionsVersions {
    actions: Action[]; // 数据
    updated: string; // 更新时间
}

interface ActionVersionsData {
    data: ActionsVersions|null;
    isLoading: Boolean;
    error: Error | null;
}

// API请求逻辑
const fetchAPI = async (): Promise<ActionsVersions> => {
    const response = await fetch(ACTION_VERSIONS_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch actions versions: ${response.statusText}`);
    }
    return response.json();
};

export const useActionVersionsStore = defineStore("actionVersions", {
    state: (): ActionVersionsData => ({
        data: null, // 存储数据
        isLoading: false, // 加载状态
        error: null, // 错误信息
    }),
    actions: {
        // 检查数据是否过期
        isDataExpired(updated: string): boolean {
            return Date.now() - new Date(updated).getTime() >= EXPIRE_TIME;
        },

        // 获取数据
        async fetchActionsVersion() {
            // 如果数据存在且未过期，直接返回
            if (this.data?.updated && !this.isDataExpired(this.data.updated)) {
                return;
            }

            try {
                this.isLoading = true;
                this.data = await fetchAPI();
                this.error = null;
            } catch (err) {
                this.error = err instanceof Error ? err : new Error("Unknown error occurred");
                console.error("Error fetching actions versions:", err);
            } finally {
                this.isLoading = false;
            }
        },
    }
});
