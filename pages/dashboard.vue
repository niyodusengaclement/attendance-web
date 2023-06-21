<script setup lang="ts">
/*Call Components*/
import SalesOverview from '@/components/dashboard/SalesOverview.vue';
import YearlyBreakup from '@/components/dashboard/YearlyBreakup.vue';
import MonthlyEarning from '@/components/dashboard/MonthlyEarnings.vue';
import RecentTransaction from '@/components/dashboard/RecentTransaction.vue';
import ProductPerformance from '@/components/dashboard/ProductPerformance.vue';
import ProductCards from '@/components/dashboard/ProductCards.vue';
definePageMeta({
    layout: "admin",
});
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-col cols="12" lg="3">
                    <MonthlyEarning title="Monthly Revenues" amount="45000" rate="+15.8" subtitle="last week"
                        :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[12, 45, 12, 72, 46, 10,69]" 
                         color="secondary"/>
                </v-col>
                <v-col cols="12" lg="3">
                    <MonthlyEarning title="Monthly Revenues" amount="45000" rate="+15.8" subtitle="last week"
                        :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[5, 45, 12, 62, 56,20,65]"
                        color="success"/>
                </v-col>
                <v-col cols="12" lg="3">
                    <MonthlyEarning title="Monthly Revenues" amount="45000" rate="+15.8" subtitle="last week"
                        :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[61, 8, 12, 80, 20,55,5]"
                        color="error" />
                </v-col>
                <v-col cols="12" lg="3">
                    <MonthlyEarning title="Monthly Revenues" amount="45000" rate="+15.8" subtitle="last week"
                        :label="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :data="[45, 10, 12, 40, 13,52,18]"
                        color="primary" />
                </v-col>
                <!-- Sales overview -->
                <v-col cols="12" lg="8">
                    <SalesOverview />
                </v-col>
                <!-- Yearly Breakup / Monthly Earnings -->
                <v-col cols="12" lg="4">
                    <div class="mb-6">
                        <YearlyBreakup />
                    </div>
                    <div>
                        <MonthlyEarning />
                    </div>
                </v-col>
                <!-- Recent transaction -->
                <v-col cols="12" lg="4">
                    <RecentTransaction />
                </v-col>
                <!-- Product performence -->
                <v-col cols="12" lg="8">
                    <ProductPerformance />
                </v-col>
                <!-- Product Cards -->
                <v-col cols="12">
                    <ProductCards />
                </v-col>
            </v-row>
        </v-col>
        <v-col class="text-center mt-2">
            <p class="text-muted">Design and Developed by <a flat variant="text" href="https://adminmart.com/"
                target="_blank" class="pl-1 text-primary">AdminMart.com</a></p>
    </v-col>
</v-row></template>