<template>
    <div>
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300"
                    enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                    leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-900/80" />
                </TransitionChild>

                <div class="fixed inset-0 flex">
                    <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                        enter-from="-translate-x-full" enter-to="translate-x-0"
                        leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                        leave-to="-translate-x-full">
                        <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                                enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                                leave-to="opacity-0">
                                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                        <span class="sr-only">Close sidebar</span>
                                        <i class="fi fi-sr-circle-xmark text-3xl text-primary"></i>
                                    </button>
                                </div>
                            </TransitionChild>
                            <!-- Sidebar component, swap this element with another sidebar if you like -->
                            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                                <div class="flex h-16 shrink-0 items-center">
                                    <CompanyLogo></CompanyLogo>
                                    <!-- <i class="fi fi-rr-car-mechanic text-primary text-3xl"></i> -->
                                </div>
                                <nav class="flex flex-1 flex-col">
                                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" class="-mx-2 space-y-1">
                                                <template v-for="item in navigation" :key="item.name">
                                                    <li v-if="item.visible == null ? true : item.visible">
                                                        <RouterLink :to="item.href"
                                                            :class="[route.path === item.href ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                                            <i :class="[route.path === item.href ? 'text-primary' : 'text-gray-400 group-hover:text-primary', 'size-6 shrink-0 flex items-center', item.icon]"
                                                                aria-hidden="true" />
                                                            {{ item.name }}
                                                        </RouterLink>
                                                    </li>
                                                </template>
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Static sidebar for desktop -->
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                <div class="flex h-16 shrink-0 items-center">
                    <CompanyLogo></CompanyLogo>
                </div>
                <nav class="flex flex-1 flex-col">
                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" class="-mx-2 space-y-1">
                                <template v-for="item in navigation" :key="item.name">
                                    <li v-if="item.visible == null ? true : item.visible">
                                        <RouterLink :to="item.href"
                                            :class="[route.path === item.href ? 'bg-gray-50 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                            <i :class="[route.path === item.href ? 'text-primary' : 'text-gray-400 group-hover:text-primary', 'size-6 shrink-0 flex items-center', item.icon]"
                                                aria-hidden="true" />
                                            {{ item.name }}
                                        </RouterLink>
                                    </li>
                                </template>
                            </ul>
                        </li>
                        <li class="-mx-6 mt-auto">
                            <a href="#"
                                class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50">
                                <img class="size-8 rounded-full bg-gray-50"
                                    :src="'https://ui-avatars.com/api/?name=' + auth.user.name + '&background=10b981&color=fff&size=128'"
                                    alt="" />
                                <span class="sr-only">Your profile</span>
                                <span aria-hidden="true"> {{ auth.user.name.split(' ')[0] }}</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
            <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
                <span class="sr-only">Open sidebar</span>
                <i class="fi fi-sr-apps text-primary"></i>
            </button>
            <div class="flex-1 text-sm/6 font-semibold text-gray-900">{{ route.name }}</div>
            <a href="#">
                <span class="sr-only">Your profile</span>
                <img class="size-8 rounded-full bg-gray-50"
                    :src="'https://ui-avatars.com/api/?name=' + auth.user.name + '&background=10b981&color=fff&size=128'"
                    alt="" />
            </a>
        </div>

        <main class="py-10 lg:pl-72 lg:h-screen">
            <div class="px-4 sm:px-6 lg:px-8 lg:h-full">
                <div class="h-full lg:border lg:border-gray-200 lg:rounded-md lg:p-1">
                    <RouterView />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import CompanyLogo from '@/components/CompanyLogo.vue';
import { useAuth } from '@/stores/auth';
import { RouterView, useRoute } from 'vue-router'


const sidebarOpen = ref(false)
const auth = useAuth();
const route = useRoute();
const navigation = ref([
    { name: 'Dashboard', href: '/', icon: 'fi fi-sr-chart-tree-map' },
    { name: 'Citas', href: '/pages/dates', icon: 'fi fi-rr-calendar-lines' },
    { name: 'Usuarios', href: '/pages/users', visible: auth.user.rol == 'Admin', icon: 'fi fi-ss-users-alt' },
])

</script>