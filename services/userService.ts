import { API_CONFIG } from "~/config/api";
import type { UserDetailResponse, UserRequest, UserResponse, UserSaveResponse, UsersListResponse } from "~/features/users/types";

class UserService {
    public baseURL = API_CONFIG.BASE_URL;

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        try {
            const url = `${this.baseURL}/${endpoint}`;

            console.log('URL de solicitud:', url);

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
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error en la solicitud:', error);
            throw error;
        }
    }

    async getUsers(filters?: { search?: string }): Promise<UsersListResponse[]> {
        let endpoint = 'users';

        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<UsersListResponse[]>(endpoint);
    }

    async getUserByCode(code: string): Promise<UserDetailResponse> {
        if (!code) {
            throw new Error('User code is required')
        }
        return this.request<UserDetailResponse>(`users/${code}`)
    }

    async createUser(userData: UserRequest): Promise<UserSaveResponse> {
        console.log('Inserting user with data:', userData);
        return this.request<UserResponse>('users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async updateUser(userData: UserRequest): Promise<UserSaveResponse> {
        console.log('Updating user with data:', userData);
        return this.request<UserSaveResponse>('users', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async resetPasswordUser(code: string): Promise<UserSaveResponse> {
        if (!code) {
            throw new Error('User code is required')
        }
        return this.request<UserSaveResponse>(`users/${code}/reset-mail`, {
            method: 'PATCH'
        });
    }
}


export const userService = new UserService();