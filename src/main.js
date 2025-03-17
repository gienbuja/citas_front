import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuth } from '@/stores/auth';

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Tooltip from 'primevue/tooltip';


document.title = import.meta.env.VITE_APP_NAME

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.directive('tooltip', Tooltip);

const auth = useAuth();
await auth.initialize();

app.mount('#app')
