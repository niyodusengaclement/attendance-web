<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header } from "vue3-easy-data-table"

definePageMeta({
    layout: "admin",
});
const http = useHttpRequest()
const search = ref("");
const lists = ref([]);
const showForm = ref(false)
const image_URL = useRuntimeConfig().public.imageURL;
const loading = ref(false)
const headers: Header[] = [
    { text: "image", value: "profile", sortable: true },
    { text: "Client name", value: "customer_name", sortable: true },
    { text: "Client Phone", value: "phone_number", sortable: true },
    { text: "Email", value: "email", sortable: true },
    { text: "complered Orders", value: "compleredOrders", sortable: true },
    { text: "All Oders", value: "allOders", sortable: true },
    { text: "Status", value: "status", width: 120 },
    // { text: "Actions", value: "actions", width: 120 },
]
const user = JSON.parse(localStorage.getItem("logger"))

const statusStr = (status: string) => {
    if (status == "1") {
        return "Active";
    }  else {
        return "Locked";
    }
}

const statusClr = (status: string) => {
    if (status == "1") {
        return "success";
    } else {
        return "error";
    }
}

function allClients() {
    loading.value = true
    http.fetch("allClients")
        .then(res => {
            lists.value = res
        })
        .catch(err => {
            console.log(err.response.message);

        })
        .finally(() => {
            loading.value = false
        })
}


onMounted(() => {
    allClients()
})

</script>
<template>
    <v-row>
        <v-col>
            <UiParentCard parent-title="Dashboard" title="Our Customers">
                <v-row class="mb-4">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="search" variant="outlined" density="compact" label="Search for Title"
                            prepend-inner-icon="mdi-magnify" single-line hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col class="flex" cols="12" md="2">
                        <v-btn prepend-icon="mdi-microsoft-excel" color="success" class="mx-2"
                            variant="tonal">
                            Export
                        </v-btn>
                    </v-col>
                </v-row>
                <ClientOnly>
                    <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
                        table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading" :items="lists">
                        <template #item-profile="item">
                            <v-avatar size="36px">
                                <v-img :src="image_URL + item.profile" class="rounded-lg"></v-img>
                            </v-avatar>
                            </template>
                        <template #item-status="item">
                            <v-chip size="small" :color="statusClr(item.status)"> {{ statusStr(item.status) }} </v-chip>
                        </template>
                        <template #empty-message>
                            <div class="d-flex justify-center align-center py-3">
                                <v-img src="/images/products/not_found.png" height="150"></v-img>
                            </div>
                            <p class="text-muted font-weight-light"> No Found</p>
                        </template>
                    </EasyDataTable>
                </ClientOnly>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
