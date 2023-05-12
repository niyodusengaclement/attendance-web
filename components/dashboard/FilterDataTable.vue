<script setup>

const props = defineProps({
    filters: Array,
    label: String
})
</script>
<template>
    <v-menu anchor="bottom end" origin="auto" min-width="300">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" elevation="0" color="secondary" block="full" variant="tonal" :ripple="false">
                {{ label }}
            </v-btn>
        </template>
        <v-card class="ma-1 pa-2 rounded-lg grid">
            <v-list>
                <v-list-item v-for="(item, index) in filters" :key="index" :value="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>
