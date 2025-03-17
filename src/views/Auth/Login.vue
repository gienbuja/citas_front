<script setup>
import { ref,watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import ErrorMessage from '@/components/ErrorMessage.vue';

const email = ref('');
const password = ref('');
const auth = useAuth();
const router = useRouter();
const errorMessage = ref('');

const handleLogin = async () => {
    if (!email.value || !password.value) {
        errorMessage.value = 'Por favor, complete todos los campos';
        return;
    }
    try {
        await auth.login(email.value, password.value);
        router.push('/');
    } catch (error) {
        errorMessage.value = error;
    }
};

watch([email, password], () => {
    errorMessage.value = '';
});
</script>

<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <i class="fi fi-rr-car-mechanic text-primary text-6xl"></i>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido a el taller!</div>
                        <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
                    </div>

                    <div>
                        <label for="email1"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo
                            electronico</label>
                        <InputText id="email1" type="text" placeholder="Ingrese su correo"
                            class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1"
                            class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Digite su contraseña"
                            :toggleMask="true" class="mb-8" fluid :feedback="false"></Password>
                        <ErrorMessage v-if="errorMessage">{{ errorMessage }}</ErrorMessage>
                        <Button label="Ingresar" class="w-full" @click="handleLogin"></Button>
                        <p class="mt-6">¿No tienes cuenta? 
                            <RouterLink to="/register" class="font-bold" >
                                Regístrate aquí.
                            </RouterLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
