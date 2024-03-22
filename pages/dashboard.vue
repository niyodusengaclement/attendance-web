<script setup lang="ts">
/*Call Components*/
import SalesOverview from '@/components/dashboard/SalesOverview.vue';
import YearlyBreakup from '@/components/dashboard/YearlyBreakup.vue';
import MonthlyEarning from '@/components/dashboard/MonthlyEarnings.vue';
import RecentTransaction from '@/components/dashboard/RecentTransaction.vue';
import ProductPerformance from '@/components/dashboard/ProductPerformance.vue';
import ProductCards from '@/components/dashboard/ProductCards.vue';
import { TrendingUpIcon, TruckDeliveryIcon, ShoppingCartIcon, HistoryIcon, BuildingWarehouseIcon } from "vue-tabler-icons";
import { CircleIcon } from 'vue-tabler-icons';
definePageMeta({
    layout: "admin",
    // middleware: "auth",
});

const http = useHttpRequest()
const instance = getCurrentInstance();
const records = ref([])
const menu = ref(false)
const loading = ref(false)
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

function getDashboardData() {
    loading.value = true
    http.fetch("get_dashboard_data", {
        method: "post",
        body: {
            startDate: formattedStartDate.value,
            endDate: formattedEndDate.value
        }
    })
        .then(res => {
            records.value = res
        })
        .catch(() => {

        })
        .finally(() => {
            loading.value = false
        })
}
function loadOrders() {
    loading.value = true
    http.fetch("fetch_orders", {
        method: "post",
        body: {
            status: '0',
            startDate: formattedStartDate.value,
            endDate: formattedEndDate.value
        }
    })
        .then((data: any) => {
            if (data.status == 200) {
                productPerformance.value = data.records;

                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => {
            loading.value = false
        })
}
const recentTransaction = ref([]);
function getRecentTransaction() {
    http.fetch("getRecentTransaction", {
        method: "post",
        body: {
            startDate: formattedStartDate.value,
            endDate: formattedEndDate.value
        }
    })
        .then(res => {
            recentTransaction.value = res
            instance?.proxy?.$forceUpdate();
        })
}
function filterByDate() {
    getDashboardData()
    loadOrders()
}

onMounted(() => {
    getDashboardData()
    loadOrders()
    getRecentTransaction()
})
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row justify="end">
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
                                <v-btn color="success" block @click="filterByDate();" :loading="loading">
                                    Filter
                                </v-btn>
                            </v-col>

                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" lg="3">
                    <NuxtLink to="/orders?status=1">
                        <MonthlyEarning title="Completed" :amount="records?.completed" rate="+15.8" subtitle="Since last week"
                            :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[12, 45, 12, 72, 46, 10, 69]"
                            color="success" :icon="BuildingWarehouseIcon" />
                    </NuxtLink>
                </v-col>
                <v-col cols="12" lg="3">
                    <NuxtLink to="/orders?status=2">
                        <MonthlyEarning title="On Delivery" :amount="records?.inDelivery" rate="+15.8" subtitle="last week"
                            :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[5, 45, 12, 62, 56, 20, 65]"
                            color="warning" :icon="TruckDeliveryIcon" />
                    </NuxtLink>
                </v-col>
                <v-col cols="12" lg="3">
                    <NuxtLink to="/orders">
                        <MonthlyEarning title="Orders" :amount="records?.records" rate="+15.8" subtitle="Now today's "
                            :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[61, 8, 12, 78, 20, 55, 5]"
                            color="info" :icon="ShoppingCartIcon" />
                    </NuxtLink>
                </v-col>
                <v-col cols="12" lg="3">
                    <NuxtLink to="/orders?status=4">
                        <MonthlyEarning title="Cancelled" :amount="records?.cancelled" rate="+9.8" subtitle="last week"
                            :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[45, 10, 12, 40, 13, 52, 18]"
                            color="error" :icon="HistoryIcon" />
                    </NuxtLink>
                </v-col>
                <!-- Sales overview -->
                <v-col cols="12" lg="8">
                    <v-card elevation="10" class="">
                        <v-card-item class="pa-6">
                            <v-card-title class="text-h5 pt-sm-2 pb-7">Pending Orders</v-card-title>
                            <v-table class="month-table">
                                <thead>
                                    <tr>
                                        <th class="text-subtitle-1 font-weight-bold">Order Id</th>
                                        <th class="text-subtitle-1 font-weight-bold">Customer</th>
                                        <th class="text-subtitle-1 font-weight-bold">Price</th>
                                        <th class="text-subtitle-1 font-weight-bold">Date & Time</th>
                                        <th class="text-subtitle-1 font-weight-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in productPerformance" :key="item.name" class="month-item">
                                        <td>
                                            <p class="text-15 font-weight-medium">{{ item.reference_code }}</p>
                                        </td>
                                        <td>
                                            <div class="">
                                                <h6 class="text-subtitle-1 font-weight-bold">{{ item.first_name }}</h6>
                                                <div class="text-13 mt-1 text-muted">{{ item.last_name }}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <h6 class="text-body-1 text-muted">{{ item.total_amount }}</h6>
                                        </td>
                                        <td>
                                            <!-- <v-chip :class="'text-body-1 bg-' + item.statuscolor" color="white" size="small">{{
                                item.status
                            }}</v-chip> -->
                                            <h6 class="text-body-1 text-muted">{{ item.date }}</h6>
                                        </td>
                                        <td>
                                            <NuxtLink :to="'/orders/' + item.id">
                                                <v-btn size="small" flat variant="outlined" color="info" class="mx-1">View
                                                    <v-icon class="ml-2">mdi-chevron-right</v-icon>

                                                </v-btn>
                                            </NuxtLink>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-item>
                    </v-card>
                </v-col>
                <!-- Yearly Breakup / Monthly Earnings -->
                <v-col cols="12" lg="4">
                    <v-card elevation="10" class="withbg">
                        <v-card-item class="pb-0">
                            <v-card-title class="text-h5 pt-sm-2">Recent Transactions</v-card-title>
                            <div class="recent-transaction mt-10 px-3">
                                <div v-for="list in recentTransaction" :key="list.title">
                                    <v-row class="d-flex mb-4">
                                        <v-col cols="4" lg="3" md="auto" sm="auto"
                                            class="px-0 pt-0 pb-1 d-flex align-start">
                                            <h6 class="text-body-1 textSecondary text-no-wrap">{{ list.title }}</h6>
                                        </v-col>
                                        <v-col cols="1" sm="1" class="px-0 text-center pt-0 pb-1">
                                            <CircleIcon size="13" :class="'text-' + list.textcolor" />
                                            <div v-if="list.line" class="line mx-auto bg-grey100"></div>
                                        </v-col>
                                        <v-col cols="7" sm="8" class="pt-0">
                                            <h6 v-if="list.boldtext" class="text-body-1 font-weight-bold">{{ list.subtitle
                                            }}</h6>
                                            <h6 v-else class="text-body-1 textSecondary">{{ list.subtitle }}</h6>
                                            <div class="mt-n1">
                                                <RouterLink :to="list.url"
                                                    class="text-body-1 text-primary text-decoration-none" v-if="list.link">
                                                    {{
                                                        list.link
                                                    }}</RouterLink>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>
                            </div>
                        </v-card-item>
                    </v-card>
                </v-col>
                <!-- Recent transaction -->

                <!-- Product Cards -->
                <v-col cols="12">
                    <!-- <ProductCards /> -->
                </v-col>
            </v-row>
        </v-col>

    </v-row>
</template>

<style scoped lang="scss">
.recent-transaction {
    .line {
        width: 2px;
        height: 35px;
    }
}
</style>