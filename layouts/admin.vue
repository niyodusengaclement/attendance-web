<script setup lang="ts">
import { RouterView } from 'vue-router';
const title = ref("Ecommerce Platform");
useHead({
    meta: [{ content: title }],
    titleTemplate: (titleChunk) => {
        return titleChunk
            ? `${titleChunk} - Ecommerce Platform`
            : "Ecommerce Platform";
    },
});
</script>

<template>
    <v-locale-provider>
        <v-app>
            <LayoutFullMain />
            <v-main>
                <v-container fluid class="page-wrapper">
                    <div class="maxWidth">
                        <RouterView />
                    </div>
                </v-container>
                <v-col class="text-center mt-2">
                    <p class="text-muted">Design and Developed by <a flat variant="text" href="https://adminmart.com/"
                            target="_blank" class="pl-1 text-success">Qonics Inc</a></p>
                </v-col>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
