<template>
    <v-row>
        <!-- STOCK BALANCE -->
        <v-col cols="12" :md="state != 1 ? 8 : 12">
            <UiParentCard title="Stock Requests">
                <v-card-text>
                    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
                        <v-tab :value="1">All Requests
                            <v-chip size="small" class="ma-1"> {{ lists.length ?? 0 }} </v-chip>
                        </v-tab>
                    </v-tabs>
                    <v-container>
                        <v-card class="mx-auto bg-gray" flat color="grey-lighten-4">
                            <v-row>
                                <v-col cols="12" md="8">
                                    <v-row>
                                        <v-col cols="12" md="7">
                                            <v-text-field variant="outlined" v-model="search" :loading="loading"
                                                outlined density="compact" label="Search by product name"
                                                prepend-inner-icon="mdi-magnify" single-line hide-details
                                                @click:prepend-inner="onSearchData">
                                            </v-text-field></v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-container>
                    <v-window v-model="tab">
                        <v-window-item v-for="n in 3" :key="n" :value="n">
                            <v-container fluid>
                                <ClientOnly>
                                    <EasyDataTable empty-message="No Order found" :search-value="search"
                                        theme-color="#5d87ff" table-class-name="eztable" :headers="headers"
                                        buttons-pagination :loading="loading" :items="lists">
                                        <template #item-image_url="item">
                                            <v-img :src="image_URL + item.photo" height="50" width="50"
                                                class="rounded-lg"></v-img>
                                        </template>
                                        <template #item-status="item">
                                            <v-chip size="small" variant="outlined" :color="statusClr(item.status)">
                                                {{ statusStr(item.status) }}
                                            </v-chip>
                                        </template>
                                        <template #item-ReferenceNo="item">
                                            <div class="text-primary">#{{ item.ReferenceNo }}</div>
                                        </template>

                                        <template #item-actions="item">
                                            <div class="row">
                                                <v-btn size="small" flat variant="outlined" color="info" class="mx-1"
                                                    @click="selectedRequest = item; state = 2; requestProducts()"> View
                                                </v-btn>
                                                <v-btn size="small" v-if="item.status == '2' && logger.category == '2'"
                                                    flat variant="outlined" color="success" class="mx-1"
                                                    @click="approveReceive(item.id)">
                                                    Approve Receive
                                                </v-btn>
                                            </div>
                                        </template>
                                    </EasyDataTable>
                                </ClientOnly>
                            </v-container>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </UiParentCard>
        </v-col>
        <v-col cols="12" md="4" v-if="state == 2">
            <v-card elevation="10" class="rounded-lg">
                <v-card-text>
                    <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
                        <div class="d-flex justify-between pb-2">
                            <div class="h4 font-bold">Request details</div>
                            <!-- <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn> -->
                        </div>

                        <v-list-item class="w-100 my-4">
                            <template v-slot:prepend>
                                <v-avatar color="grey-darken-3"
                                    image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-avatar>
                            </template>

                            <v-list-item-title>{{
            selectedRequest.shop_name
        }}</v-list-item-title>

                            <v-list-item-subtitle class="text-13">Date:
                                {{
                selectedRequest.date
            }}</v-list-item-subtitle>
                        </v-list-item>
                    </div>

                    <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
                        <div class="d-flex justify-between pb-2">
                            <div class="h4 font-bold">Products</div>
                            <!-- <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn> -->
                        </div>

                        <div class="w-100 my-4 space-y-4" v-for="(item, i) in products" :key="i">
                            <div class="flex justify-between">
                                <div class="text-muted text-small">{{ item.product }}</div>
                                <div class="text-dark font-medium text-small">{{ item.quantity }} {{
            (item.stock_quantity ?
                                    ' / ' + item.stock_quantity : '') }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="logger.category == '1'" class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
                        <div class="d-flex justify-between pb-2">
                            <div class="h4 font-bold">Actions</div>
                            <!-- <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn> -->
                        </div>

                        <div class="w-100 my-4 space-y-4">
                            <div class="flex justify-end">
                                <v-btn size="small" flat variant="outlined" color="error" class="mx-1"
                                    @click="changeRequestStatus(3)">
                                    Reject
                                </v-btn>
                                <v-btn size="small" flat variant="outlined" color="success" class="mx-1"
                                    @click="changeRequestStatus(2)"> Approve
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Field, useValidation } from "vue3-form-validation";
import { rules } from "~/utils/rules";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { Header, Item } from "vue3-easy-data-table";
import { useHttpRequest } from "~~/composables/useHttpRequest";
definePageMeta({ layout: "admin" });
const config = useRuntimeConfig();
const API_URL = config.public.apiUrl;
const http = useHttpRequest();
const instance = getCurrentInstance();

let token: string | null;
let logger = ref("");
if (process.client) {
    token = localStorage.getItem("token");
    logger.value = JSON.parse(localStorage.getItem("logger"));
}
const image_URL = config.public.imageURL;
const state = ref(1);
const lists = ref([]);
const loading = ref(false);
const tab = ref(null);
const selectedRequest = ref("");
const search = ref("");
const products = ref([])

onMounted(() => {
    loadStockRequest();
});
const headers: Header[] = [
    { text: "ID", value: "id", sortable: true },
    { text: "Shop", value: "shop_name", sortable: true },
    { text: "Date", value: "date", sortable: true },
    { text: "Status", value: "status", sortable: true },
    { text: "Actions", value: "actions", width: 220 },
];

function loadStockRequest(type = '') {
    loading.value = true;
    http
        .fetch("get_stock_request", {
            method: "POST",
            body: {
                type
            }
        })
        .then((data: any) => {
            lists.value = data.data;
            instance?.proxy?.$forceUpdate();
        })
        .catch(data => {
            useToast().error(data.data.message);
        })
        .finally(() => (loading.value = false));
}

const statusStr = (status: any) => {
    if (status == '1') {
        return "COMPLETED";
    } else if (status == '2') {
        return "Delivery waiting";
    } else if (status == '0') {
        return "Pending";
    } else {
        return "Rejected";
    }
};

const statusClr = (status: any) => {
    if (status == '1') {
        return "success";
    } else if (status == '2') {
        return "primary";
    } else if (status == '0') {
        return "warning";
    } else {
        return "error";
    }
};
const onSearchData = () => {
    loading.value = true;

    setTimeout(() => {
        loading.value = false;
    }, 2000);
};


function requestProducts() {
    http.fetch("get_stock_request_details", {
        method: "post",
        body: {
            request: selectedRequest.value.id
        }
    })
        .then(res => {
            products.value = res.data;
            instance?.proxy?.$forceUpdate();
        }).catch(err => {
            useToast().error(err.data.message)
        })
}

function changeRequestStatus(status: any) {
    http.fetch("admin_change_stock_request_status", {
        method: "post",
        body: {
            id: selectedRequest.value.id,
            status
        }
    })
        .then(res => {
            state.value = 1
            selectedRequest.value = ''
            products.value = []
            useToast().success(res.message)
            loadStockRequest()
            instance?.proxy?.$forceUpdate();
        }).catch(err => {
            useToast().error(err.data.message)
        })
}

function approveReceive(id: any) {
    http.fetch("confirm_stock_received", {
        method: "post",
        body: {
            id,
            products: products.value
        }
    })
        .then(res => {
            state.value = 1
            selectedRequest.value = ''
            products.value = []
            useToast().success(res.message)
            loadStockRequest()
            instance?.proxy?.$forceUpdate();
        }).catch(err => {
            useToast().error(err.data.message)
        })
}
</script>