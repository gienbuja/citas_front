<template>
    <i :class="'fi fi-rr-car-mechanic text-primary text-'+size+'xl'"></i>
</template>

<script setup>

const props =defineProps({
        size:{
            default:'3'
        }
    })

</script>