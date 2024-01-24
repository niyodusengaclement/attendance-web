<script setup lang="ts">
/*Call Components*/
import SalesOverview from '@/components/dashboard/SalesOverview.vue';
import YearlyBreakup from '@/components/dashboard/YearlyBreakup.vue';
import MonthlyEarning from '@/components/dashboard/MonthlyEarnings.vue';
import RecentTransaction from '@/components/dashboard/RecentTransaction.vue';
import ProductPerformance from '@/components/dashboard/ProductPerformance.vue';
import ProductCards from '@/components/dashboard/ProductCards.vue';
import { TrendingUpIcon, TruckDeliveryIcon, ShoppingCartIcon, HistoryIcon, BuildingWarehouseIcon } from "vue-tabler-icons";
definePageMeta({
    layout: "admin",
    // middleware: "auth",
});

const http = useHttpRequest()
const records = ref([])
function getDashboardData()
{
    http.fetch("get_dashboard_data")
    .then(res => {
        records.value = res
    })
    .catch(() => {

    })
}
onMounted(() => {
    getDashboardData()
})
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-col cols="12" lg="3">
                    <MonthlyEarning title="Completed" :amount="records?.completed" rate="+15.8" subtitle="Since last week"
                        :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[12, 45, 12, 72, 46, 10, 69]"
                        color="success" :icon="BuildingWarehouseIcon" />
                </v-col>
                <v-col cols="12" lg="3">
                    <MonthlyEarning title="On Delivery" :amount="records?.inDerively" rate="+15.8" subtitle="last week"
                        :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[5, 45, 12, 62, 56, 20, 65]"
                        color="warning" :icon="TruckDeliveryIcon" />
                </v-col>
                <v-col cols="12" lg="3">
                    <MonthlyEarning title="Orders" :amount="records?.records" rate="+15.8" subtitle="Now today's "
                        :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[61, 8, 12, 78, 20, 55, 5]"
                        color="info" :icon="ShoppingCartIcon" />
                </v-col>
                <v-col cols="12" lg="3">
                    <MonthlyEarning title="Cancelled" :amount="records?.cancelled" rate="+9.8" subtitle="last week"
                        :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[45, 10, 12, 40, 13, 52, 18]"
                        color="error" :icon="HistoryIcon" />
                </v-col>
                <!-- Sales overview -->
                <v-col cols="12" lg="8">
                    <ProductPerformance />
                </v-col>
                <!-- Yearly Breakup / Monthly Earnings -->
                <v-col cols="12" lg="4">
                    <RecentTransaction />
                </v-col>
                <!-- Recent transaction -->

                <!-- Product Cards -->
                <v-col cols="12">
                    <ProductCards />
                </v-col>
            </v-row>
        </v-col>

    </v-row>
</template>