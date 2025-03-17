<template>
    <div class="bg-white py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl lg:mx-0">
                <h2 class="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Tus usuarios
                </h2>
                <p class="mt-6 text-lg/8 text-gray-600">Puedes modificar las opciones de usuarios desde aqui</p>
            </div>
            <ul role="list"
                class="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6">
                <li v-for="user in users" :key="user.name + user.email" v-tooltip.top="user.name">
                    <img class="mx-auto size-24 rounded-full"
                        :src="'https://ui-avatars.com/api/?name=' + user.name + '&background=10b981&color=fff&size=128'"
                        alt="" />
                    <h3 class="mt-6 truncate text-base/7 font-semibold tracking-tight text-gray-900">{{ user.name }}
                    </h3>
                    <div class="">
                        <p class="text-sm/6 text-gray-600">{{ user.email }}</p>
                        <p class="text-sm/6 text-gray-600">{{ user.rol }}</p>
                        <button @click="changeTypeUser(user.id)" class="cursor-pointer rounded-md px-1 border border-blue-300 hover:bg-blue-200">
                            <p class="text-sm/6 text-blue-600">Cambiar</p>
                        </button>
                    </div>
                    <div>
                        <p class="text-sm/6 text-gray-600">Citas: {{ user.citas.length }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);

onMounted(async () => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(apiUrl + '/users');
        users.value = response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});

async function changeTypeUser(id) {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response =await axios.get(`${apiUrl}/users/change/${id}`);
        const index = users.value.findIndex(user => user.id === id);
        if (index !== -1) {
            users.value[index] = response.data;
        }
    } catch (error) {
        console.error('Error changing user type:', error);
    }
}

</script>