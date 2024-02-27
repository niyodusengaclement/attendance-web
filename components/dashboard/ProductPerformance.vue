<script setup lang="ts">
import { ref } from 'vue';

const http = useHttpRequest()
const productPerformance = ref([])
const instance = getCurrentInstance();

function loadOrders() {
  http.fetch("fetch_orders", {
    method: "post",
    body: { status: '0' }
  })
    .then((data: any) => {
      if (data.status == 200) {
        productPerformance.value = data.records;

        instance?.proxy?.$forceUpdate();
      }
    })
    .catch(() => { })
    .finally(() => {});
}

onMounted(() => {
    loadOrders()
})
</script>
<template>
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
                                <h6 class="text-subtitle-1 font-weight-bold">{{ item.customer_name }}</h6>
                                <div class="text-13 mt-1 text-muted">{{ item.customer_name }}</div>
                            </div>
                        </td>
                        <td>
                            <h6 class="text-body-1 text-muted">{{ item.amount_paid }}</h6>
                        </td>
                        <td>
                            <!-- <v-chip :class="'text-body-1 bg-' + item.statuscolor" color="white" size="small">{{
                                item.status
                            }}</v-chip> -->
                            <h6 class="text-body-1 text-muted">{{ item.created_at }}</h6>
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
</template>
