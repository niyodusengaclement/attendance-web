<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header } from "vue3-easy-data-table"

definePageMeta({
    layout: "admin",
});
const http = useHttpRequest()
const config = useRuntimeConfig()
const token = localStorage.getItem("token")
const search = ref("");
const lists = ref([]);
const showForm = ref(false)
const loading = ref(false)

const menu = ref(false)
const endDateMenu = ref(false)
const productPerformance = ref([])
const startDate = ref(new Date())
startDate.value.setDate(startDate.value.getDate() - 30);
const endDate = ref(new Date())
const formattedStartDate = ref(startDate.value.toISOString().split('T')[0]);
const formattedEndDate = ref(endDate.value.toISOString().split('T')[0]);
watch(startDate, () => {
    formattedStartDate.value = startDate.value.toISOString().split('T')[0];
});
watch(endDate, () => {
    formattedEndDate.value = endDate.value.toISOString().split('T')[0];
});
const maxDate = ref(new Date().toISOString().split('T')[0])

const headers: Header[] = [
    { text: "Date", value: "created_at", sortable: true },
    { text: "Order ID", value: "reference_code", sortable: true },
    { text: "Client name", value: "customer_name", sortable: true },
    { text: "Client Phone", value: "phone_number", sortable: true },
    { text: "Delivery fee", value: "delivery_fee", sortable: true },
    { text: "Total Amount", value: "total_amount", sortable: true },
    { text: "Shop name", value: "shop_name", sortable: true },
    { text: "Driver", value: "driver", sortable: true },
    { text: "Payment Method", value: "payment_mode", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
]
const user = JSON.parse(localStorage.getItem("logger"))

const statusStr = (status: string) => {
    if (status == "1") {
        return "Open";
    } else if (status == "2") {
        return "On Delivery";
    } else if (status == "3") {
        return "Arrived";
    } else if (status == "4") {
        return "Cancelled";
    } else {
        return "Closed";
    }
}

const statusClr = (status: string) => {
    if (status == "1") {
        return "success";
    } else if (status == "2") {
        return "secondary";
    } else if (status == "3") {
        return "success";
    } else if (status == "4") {
        return "error";
    } else {
        return "error";
    }
}

function getSalesReport() {
    loading.value = true
    http.fetch("getSalesReport/0", {
        method: "post",
        body: {
            startDate: formattedStartDate.value,
            endDate: formattedEndDate.value
        }
    })
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
    getSalesReport()
})

const download = computed(() => {
    return config.public.apiUrl + "getSalesReport/1/" + token
})
</script>
<template>
    <v-row>
        <v-row justify="end" class="mx-1 mb-1">
            <v-col cols="6">
                <v-card class="my-4 p-0">
                    <v-row>
                        <v-col cols="12" lg="5" class="p-0 m-0">
                            <div class="text-center">
                                <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="indigo" block flat v-bind="props">
                                            {{ `Start Date: ${formattedStartDate}` }}
                                        </v-btn>
                                    </template>

                                    <v-card min-width="300">
                                        <v-date-picker v-model="startDate" :max="maxDate" hide-header show-adjacent-months
                                            @update:model-value="endDate = new Date()"></v-date-picker>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" variant="text" @click="menu = false">
                                                Close
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </div>
                        </v-col>
                        <span class="divider">-</span>
                        <v-col cols="12" lg="4" class="p-0 m-0">
                            <div class="text-center">
                                <v-menu v-model="endDateMenu" :close-on-content-click="false" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="indigo" block v-bind="props" flat>
                                            {{ `Start Date: ${formattedEndDate}` }}
                                        </v-btn>
                                    </template>

                                    <v-card min-width="300">
                                        <v-date-picker v-model="endDate" :max="maxDate" :min="formattedStartDate"
                                            show-adjacent-months hide-header></v-date-picker>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" variant="text" @click="endDateMenu = false">
                                                Close
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="12" lg="2" class="p-0 m-0">
                            <v-btn color="success" block @click="getSalesReport()" :loading="loading">
                                Filter
                            </v-btn>
                        </v-col>

                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-col cols="12">
            <UiParentCard parent-title="Dashboard" title="Sales Report">
                <v-row class="mb-4">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="search" variant="outlined" density="compact" label="Search for Title"
                            prepend-inner-icon="mdi-magnify" single-line hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col class="flex" cols="12" md="2">
                        <form :action="download" method="post" target="_blank">
                            <input type="hidden" name="startDate" v-model="formattedStartDate">
                            <input type="hidden" name="endDate" v-model="formattedEndDate">
                            <v-btn prepend-icon="mdi-microsoft-excel" color="success" class="mx-2" variant="tonal"
                                type="submit">
                                Export
                            </v-btn>
                        </form>
                    </v-col>
                </v-row>
                <ClientOnly>
                    <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
                        table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading" :items="lists">
                        <template #item-status="item">
                            <v-chip size="small" :color="statusClr(item.status)"> {{ statusStr(item.status) }} </v-chip>
                        </template>
                        <template #item-actions="item">
                            <v-btn variant="outlined" size="small" color="info"> <v-icon>mdi-view-headline</v-icon>
                                view</v-btn>
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
