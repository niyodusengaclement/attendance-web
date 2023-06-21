<script setup lang="ts">
import { ArrowNarrowRightIcon } from 'vue-tabler-icons';

const props = defineProps({
    parentTitle: String,
    title: String
});
</script>

// ===============================|| Ui Parent Card||=============================== //
<template>
    <div class="px-2">
        <div class="d-flex align-center">
            <h5 class="text-h5 mb-6 pl-2 pt-7 font-weight-light text-muted">{{ parentTitle }}</h5>
            <ChevronRightIcon :class="'text-muted mx-2 mt-1'" size="20" />
            <h5 class="text-h5 mb-6 text-primary pt-7">{{ title }}</h5>
        </div>
       
        <v-card elevation="10" class="withbg">
            <v-card-item class="pa-2">
                <div class="d-sm-flex align-center justify-space-between">
                   
                    <!-- <template v-slot:append> -->
                    <slot name="action"></slot>
                    <!-- </template> -->
                </div>

                <slot />
            </v-card-item>

        </v-card>
    </div>
</template>
