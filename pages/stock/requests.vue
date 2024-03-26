<template>
    <v-row>
        <v-col>
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
                                            <v-date-picker v-model="startDate" :max="maxDate" hide-header
                                                show-adjacent-months
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
                                <v-btn color="success" block @click="loadStockRequest(selectedStatus)"
                                    :loading="loading">
                                    Filter
                                </v-btn>
                            </v-col>

                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <!-- STOCK BALANCE -->
            <v-row>
                <v-col cols="12" :md="state != 1 ? 8 : 12">
                    <UiParentCard title="Stock Requests">
                        <v-card-text>
                            <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
                                <v-tab @click="loadStockRequest()" :value="1">All Requests
                                    <v-chip size="small" class="ma-1"> {{ parseInt(completed) + parseInt(waiting) +
                                        parseInt(pending) +
                                        parseInt(rejected) }} </v-chip>
                                </v-tab>
                                <v-tab @click="loadStockRequest('0')" :value="2">Pending
                                    <v-chip size="small" class="ma-1"> {{ pending }} </v-chip>
                                </v-tab>
                                <v-tab @click="loadStockRequest('2')" :value="3">Waiting Delivery
                                    <v-chip size="small" class="ma-1"> {{ waiting }} </v-chip>
                                </v-tab>
                                <v-tab @click="loadStockRequest('1')" :value="4">Completed
                                    <v-chip size="small" class="ma-1"> {{ completed }} </v-chip>
                                </v-tab>
                                <v-tab @click="loadStockRequest('3')" :value="5">Rejected
                                    <v-chip size="small" class="ma-1"> {{ rejected }} </v-chip>
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
                                <v-window-item v-for="n in 5" :key="n" :value="n">
                                    <v-container fluid>
                                        <ClientOnly>
                                            <EasyDataTable empty-message="No Order found" :search-value="search"
                                                theme-color="#5d87ff" table-class-name="eztable" :headers="headers"
                                                buttons-pagination :loading="loading" :items="lists">
                                                <template #item-image_url="item">
                                                    <v-img :src="image_URL + item.photo" height="50" width="50"
                                                        class="rounded-lg"></v-img>
                                                </template>
                                                <template #empty-message>
                                                    <div class="d-flex justify-center align-center py-3">
                                                        <v-img src="/images/products/not_found.png"
                                                            height="150"></v-img>
                                                    </div>
                                                    <p class="text-muted font-weight-light"> No Found</p>
                                                </template>
                                                <template #item-status="item">
                                                    <v-chip size="small" variant="outlined"
                                                        :color="statusClr(item.status)">
                                                        {{ statusStr(item.status) }}
                                                    </v-chip>
                                                </template>
                                                <template #item-ReferenceNo="item">
                                                    <div class="text-primary">#{{ item.ReferenceNo }}</div>
                                                </template>

                                                <template #item-actions="item">
                                                    <div class="row">
                                                        <v-btn size="small" flat variant="outlined" color="info"
                                                            class="mx-1"
                                                            @click="selectedRequest = item; state = 2; requestProducts()">
                                                            View
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
                                            ' / ' + item.stock_quantity : '') }}
                                            <v-btn color="error"
                                                v-if="logger.category == '2' && selectedRequest.status == '0'"
                                                class="mx-3" variant="tonal" size="small" icon="mdi-delete" flat
                                                :loading="removeLoading"
                                                @click="itemToDelete = item; isDeleteViewing = true"></v-btn>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200"
                                v-if="logger.category == '2' && selectedRequest.status == '2'">
                                <div class="d-flex justify-between pb-2">
                                    <div class="h4 font-bold">Delivered Products</div>
                                </div>
                                <div class="w-100 my-4 space-y-4" v-for="(item, i) in products" :key="i">
                                    <div class="flex justify-between">
                                        <div class="text-muted text-small">{{ item.product }}</div>
                                        <div class="w-1/2 text-dark font-medium text-small">
                                            <v-text-field variant="outlined" density="compact" label="Delivered items"
                                                v-model="item.delivered" color="primary"></v-text-field>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
                                <div class="d-flex justify-between pb-2">
                                    <div class="h4 font-bold">{{ selectedRequest.status == '0' ? 'Actions' : 'Status' }}
                                    </div>
                                </div>

                                <div v-if="selectedRequest.status == '0' && logger.category == '1'"
                                    class="w-100 my-4 space-y-4">
                                    <div class="flex justify-end">
                                        <v-btn size="small" flat variant="outlined" color="error" class="mx-1"
                                            @click="status = '3'; isViewing = true">
                                            Reject
                                        </v-btn>
                                        <v-btn size="small" flat variant="outlined" color="success" class="mx-1"
                                            @click="status = '2'; isViewing = true"> Approve
                                        </v-btn>
                                    </div>
                                </div>
                                <div v-else class="w-100 my-4 space-y-4">
                                    <div v-if="selectedRequest.status == '2' && logger.category == '2'">
                                        <v-btn size="small" flat variant="outlined" color="error" class="mx-1"
                                            @click="state = 1, products = []">
                                            cancel
                                        </v-btn>
                                        <v-btn size="small" flat variant="outlined" color="success" class="mx-1"
                                            @click="approveReceive(selectedRequest.id)"> Approve
                                        </v-btn>
                                    </div>
                                    <v-alert v-else :title="statusStr(selectedRequest.status)"
                                        :type="statusClr(selectedRequest.status)"></v-alert>
                                </div>

                                <v-dialog v-model="isViewing" persistent width="auto">
                                    <v-card width="450">
                                        <v-card-title color="success" class="text-h5 text-info pa-6">
                                            {{ status == '3' ? 'Reject ' : 'Approve ' }} {{ selectedRequest.shop_name +
                                        ' request'
                                            }}
                                        </v-card-title>
                                        <v-card-text>
                                            <label for="password" class="text-gray-700 text-sm">Password</label>
                                            <div x-data="{ show: true }" class="relative flex items-center mt-2">
                                                <input :type="show ? 'text' : 'password'" name="password" id="password"
                                                    v-model="password"
                                                    class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                                    placeholder="Confirm your password">
                                                <div
                                                    class="absolute right-2 bg-transparent cursor-pointer flex items-center justify-center text-gray-700">
                                                    <EyeIcon @click="toggle(true)" size="18" class="text-gray-400"
                                                        :class="show ? 'hidden' : ''" />
                                                    <EyeOffIcon @click="toggle(false)" size="18" class="text-gray-400"
                                                        :class="!show ? 'hidden' : ''" />
                                                </div>

                                            </div>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" variant="text" :loading="loading"
                                                class="mx-1" prepend-icon="mdi-close" @click="isViewing = false">
                                                Close
                                            </v-btn>
                                            <v-btn size="small" variant="text" @click="changeRequestStatus(status)"
                                                :color="status == '3' ? 'error' : 'success'">
                                                {{ status == '3' ? 'Reject' : 'Approve' }}</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                                <v-dialog v-model="isDeleteViewing" persistent width="auto">
                                    <v-card>
                                        <v-card-title class="text-h5"> Delete </v-card-title>
                                        <v-card-text>
                                            <div class="text-lg text-center justify-center">
                                                Are you want to delete
                                                <span class="font-bold"> {{ itemToDelete.product }} </span>
                                                from this request?
                                            </div>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="primary" variant="text" class="mx-1" prepend-icon="mdi-close"
                                                @click="isDeleting = false">
                                                Cancel
                                            </v-btn>
                                            <v-btn :loading="loading" elevation="10" variant="outlined"
                                                color="error" class="mx-1" prepend-icon="mdi-delete"
                                                @click="removeItem(itemToDelete.id)">
                                                Delete
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
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
const tab = ref(null);
const selectedRequest = ref("");
const search = ref("");
const products = ref([])
const selectedStatus = ref("")
const status = ref('')
const isViewing = ref(false)
const isDeleteViewing = ref(false)
const password = ref("")
const itemToDelete = ref("")
const loading = ref(false);

//Tabs chip values
const pending = ref(0);
const completed = ref(0);
const waiting = ref(0);
const rejected = ref(0);

//Date range pricker variables
const menu = ref(false)
const endDateMenu = ref(false)
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
const deliveredHeaders: Header[] = [
    { text: "ID", value: "id", sortable: true },
    { text: "product", value: "product", sortable: true },
    { text: "requested", value: "quantity", sortable: true },
    { text: "delivered", value: "delivered", width: 120 }
];

const show = ref(false)
function toggle(value: boolean) {
    show.value = value
}
function loadStockRequest(type = '') {
    loading.value = true;
    selectedStatus.value = type
    http
        .fetch("get_stock_request", {
            method: "POST",
            body: {
                type,
                startDate: formattedStartDate.value,
                endDate: formattedEndDate.value
            }
        })
        .then((data: any) => {
            lists.value = data.data;
            pending.value = data.pending;
            waiting.value = data.waiting;
            rejected.value = data.rejected;
            completed.value = data.completed;
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
        return "info";
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
    loading.value = true
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
        .finally(() => {
            loading.value = false
        })
}

function changeRequestStatus(status: any) {
    loading.value = true
    http.fetch("admin_change_stock_request_status", {
        method: "post",
        body: {
            id: selectedRequest.value.id,
            status,
            password: password.value
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
        .finally(() => {
            loading.value = false
        })
}

function approveReceive(id: any) {
    loading.value = true
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
        .finally(() => {
            loading.value = false
        })
}

function removeItem(id: any) {
    loading.value = true
    http.fetch("remove-request-item", {
        method: "post",
        body: {
            id,
            request: selectedRequest.value.id
        }
    })
        .then(res => {
            requestProducts()
            isDeleteViewing.value = false
            useToast().success(res.message)
        })
        .catch(err => {
            useToast().error(err.data.message)
        })
        .finally(() => {
            loading.value = false
        })
}
</script>