<template>
    <div class="h-full">
        <div class="grid grid-cols-2">
            <span class="border rounded-md p-1 border-gray-200">
                <h1 class="font-bold w-full text-center text-2xl">Citas por mes</h1>
                <Chart type="bar" :data="chartData" :options="chartOptions" />
            </span>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';
import Chart from 'primevue/chart';
const apiUrl = import.meta.env.VITE_API_URL;

onMounted(async () => {
    try {
        const response = await axios.get(`${apiUrl}/dashboard/mes`);
        chartData.value.labels = Object.keys(response.data).map(key => key.charAt(0).toUpperCase() + key.slice(1));
        chartData.value.datasets.push(
            {
                label: 'Citas',
                data: Object.values(response.data),

            }
        )
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

const chartData = ref({
    labels: [],
    datasets: [],
})

const chartOptions = {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1,
                callback: function (value) {
                    return Number.isInteger(value) ? value : null;
                }
            }
        }
    }
}

</script>