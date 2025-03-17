import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuth = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
    }),
    actions: {
        async login(email, password) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.post(apiUrl + '/auth/login',
                    { email, password },
                );
                this.user = response.data.user;
                this.token = response.data.token;
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            } catch (error) {
                console.error(error.response.data.error);
                throw error.response.data.error;
            }
        },
        async register(name, email, password) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.post(apiUrl + '/auth/register', { name, email, password });
                this.user = response.data.user;
                this.token = response.data.token;
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            } catch (error) {
                console.error(error.response.data.error);
                throw error.response.data.error;
            }
        },
        async logout() {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                await axios.post(apiUrl + '/auth/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            } catch (error) {
                console.error('Error during logout:', error);
            } finally {
                this.user = null;
                this.token = null;
                delete axios.defaults.headers.common['Authorization'];
            }
        }
    }
});