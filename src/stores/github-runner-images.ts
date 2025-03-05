import {defineStore} from "pinia";
import {RUNNER_IMAGES_URL} from "@/config";


interface ImageInfo {
    image: string;
    yamlLabels: string[];
}

interface Categories {
    ubuntu: ImageInfo[];
    windows: ImageInfo[];
    macos: ImageInfo[];
    other: ImageInfo[];
}

interface SystemImages {
    // 数据来源
    source: string;
    // 数据 - 标签数据 // 就是categories里面yamlLabels的集合
    labels: string[];
    // 数据 - 分类数据
    categories: Categories;
    // 更新时间
    updated: string;
}

interface RunnerImageData {
    data: SystemImages|null;
    isLoading: Boolean;
    error: Error | null;
}

// API请求逻辑
const fetchAPI = async (): Promise<SystemImages> => {
    const response = await fetch(RUNNER_IMAGES_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch runner images: ${response.statusText}`);
    }
    return response.json();
};

export const useRunnerImagesStore = defineStore("runnerImages", {
        state: (): RunnerImageData => ({
            data: null,
            isLoading: false,
            error: null,
        }),
        actions: {
            async fetchRunnerImages() {
                this.isLoading = true;
                try {
                    this.data = await fetchAPI();
                    this.error = null;
                } catch (err) {
                    this.error = err instanceof Error ? err : new Error('Unknown error occurred');
                    console.error("Error fetching runner images:", err);
                } finally {
                    this.isLoading = false
                }
            }
        }
    }
);