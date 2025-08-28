import { API_CONFIG } from "~/config/api";
import type { ParticipantsList } from "~/features/participants/types";

class ParticipantsService {
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

    async getParticipants(filters?: { search?: string }): Promise<ParticipantsList[]> {
        let endpoint = 'participants';
        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<ParticipantsList[]>(endpoint);
    }

}

export const participantsService = new ParticipantsService();