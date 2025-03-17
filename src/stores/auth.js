import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

export const useAuth = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async login(email, password) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.post(apiUrl + '/auth/login', { email, password });
                this.user = response.data.user;
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
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
                localStorage.setItem('token', this.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            } catch (error) {
                console.error(error.response.data.error);
                throw error.response.data.error;
            }
        },
        async logout() {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                await axios.get(apiUrl + '/auth/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                router.push('/login');
            } catch (error) {
                console.error(error);
                throw error.response.data.error;
            } finally {
                this.user = null;
                this.token = null;
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            }
        },
        async initialize() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const apiUrl = import.meta.env.VITE_API_URL;
                    const response = await axios.get(apiUrl + '/me');
                    this.user = response.data.user;
                    router.push('/');
                } catch (error) {
                    console.error(error);
                    this.logout();
                    throw error.response.data.error;
                }
            }
        }
    }
});