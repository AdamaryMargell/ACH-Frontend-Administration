import { API_CONFIG } from "~/config/api";
import type { ParameterDetailResponse, ParameterListItem, ParameterSaveResponse } from "~/features/parameters/types";

class ParameterService {
    private baseURL = API_CONFIG.BASE_URL;

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        try {
            const url = `${this.baseURL}/${endpoint}`;

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en la solicitud:', error);
            throw error;
        }
    }

    async getParameters(filters?: { search?: string }): Promise<ParameterListItem[]> {
        let endpoint = 'parameters';

        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<ParameterListItem[]>(endpoint);
    }

    async getParameterByCode(code: string): Promise<ParameterDetailResponse> {
        if (!code) {
            throw new Error('User code is required')
        }
        return this.request<ParameterDetailResponse>(`parameters/${code}`)
    }

    async updateParameter(parameterData: { code: string; value: string }): Promise<ParameterSaveResponse> {
        console.log('Updating parameter with data:', parameterData);
        return this.request<ParameterSaveResponse>('parameters', {
            method: 'PATCH',
            body: JSON.stringify(parameterData)
        });
    }
}

export const parametersService = new ParameterService();