<template>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="List Products">
        <v-card-text>
          <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
            <v-tab @click="loadAllOrders()" :value="1">All Orders</v-tab>
            <v-tab @click="loadOrderByStatus(3)" :value="2">Completed</v-tab>
            <v-tab @click="loadOrderByStatus(2)" :value="3">Continuing</v-tab>
            <v-tab @click="loadOrderByStatus(0)" :value="4">Pending</v-tab>
            <v-tab @click="loadOrderByStatus(4)" :value="5">Cancelled</v-tab>

          </v-tabs>
          <v-container>
            <v-card class="mx-auto bg-gray" flat color="grey-lighten-4">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="8">
                    <v-row>
                      <v-col cols="12" md="3">  <FilterDataTable :label="'Filter By'" :filters="[{title : 'Name'}]" /></v-col>
                      <v-col cols="12" md="9"> <v-text-field v-model="search" :loading="loading" variant="tonal" density="compact"
                      label="Search for Order ID, customer, order status, or something" prepend-inner-icon="mdi-magnify"
                      single-line hide-details @click:prepend-inner="onSearchData">

                    </v-text-field></v-col>
                    </v-row>
                       
                   
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-btn prepend-icon="mdi-vuetify" color="primary" class="mx-2" variant="tonal">
                      Filters
                    </v-btn>
                    <v-btn prepend-icon="mdi-export" color="success" class="mx-2" variant="tonal">
                      Export
                    </v-btn>
                 

                  </v-col>
                </v-row>
                <p> {{ orders }}</p>
              </v-card-text>
            </v-card>
          </v-container>
          <v-window v-model="tab">
            <v-window-item v-for="n in 5" :key="n" :value="n">
              <v-container fluid>
                <ClientOnly>
                  <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
                    table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading" :items="lists">
                    <template #item-status="item">
                      <v-chip size="small" :color="statusClr(item.Status)"> {{ statusStr(item.Status) }} </v-chip>

                    </template>
                    <template #item-ReferenceNo="item">
                      <div class="text-primary">#{{ item.ReferenceNo }}</div>

                    </template>
                 
                    <template #item-actions="item">
                      <div class=" row">
                        <v-btn size="large" flat density="compact" variant="tonal" color="success" class="mx-1"
                          icon="mdi-check" @click="editItem(item.raw)">

                        </v-btn>
                        <v-btn size="large" flat density="compact" variant="tonal" color="error" class="mx-1"
                          icon="mdi-delete">

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
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import FilterDataTable from "@/components/dashboard/FilterDataTable.vue"
import { Header } from "vue3-easy-data-table"
import { useHttpRequest } from '~~/composables/useHttpRequest';
definePageMeta({
  layout: "admin",
});
const http = useHttpRequest()
const instance = getCurrentInstance();

const lists = ref([]);
const loading = ref(false);
const tab = ref(null);
const search = ref("");
onMounted(() => {
  loadAllOrders();
})

const headers: Header[] = [
  { text: "Order ID", value: "ReferenceNo", sortable: true },
  { text: "Customer", value: "ProductCategory", sortable: true },
  { text: "Package", value: "PaidAmount", sortable: true },
  { text: "Price", value: "PaidAmount", sortable: true },
  { text: "Delivery Date", value: "CreatedAt", sortable: true },
  { text: "Delivery Status", value: "Status", sortable: true },
  { text: "Payment Mode", value: "PaymentMode", sortable: true },
  { text: "Actions", value: "actions", width: 120 },
]

function loadAllOrders() {
  loading.value = true
  http.fetch("orders")
    .then((data: any) => {
      if (data.status == 200) {
        lists.value = data.records;
        instance?.proxy?.$forceUpdate();
      }
    })
    .catch(() => { })
    .finally(() => (loading.value = false));
}

function loadOrderByStatus(status: string) {
  loading.value = true
  http.fetch("order_by_status/" + status)
    .then((data: any) => {
      if (data.status == 200) {
        lists.value = data.records;
        instance?.proxy?.$forceUpdate();
      }
    })
    .catch(() => { })
    .finally(() => (loading.value = false));
}


const statusStr = (status: string) => {
  if (status == "1") {
    return "Approved";
  } else if (status == "2") {
    return "On Delivery";
  } else if (status == "3") {
    return "Arrived";
  } else if (status == "4") {
    return "Cancelled";
  } else {
    return "Pending";
  }
}

const statusClr = (status: string) => {
  if (status == "1") {
    return "primary";
  } else if (status == "2") {
    return "secondary";
  } else if (status == "3") {
    return "success";
  } else if (status == "4") {
    return "error";
  } else {
    return "warning";
  }
}
const onSearchData = () => {
  loading.value = true

  setTimeout(() => {
    loading.value = false
  }, 2000)
}

</script>
