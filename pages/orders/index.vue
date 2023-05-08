<script   setup>
import { ref, onMounted } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
definePageMeta({
  layout: "admin",
});
const page = ref(1);
const lastPage = ref(1);
const orders = ref([]);
const pending = ref(false);
const loading = ref(false);
const loaded = ref(false);
const tab = ref(null);
onMounted(() => {
  loadAllOrders();
})

const loadMore = () => {
  if (page.value + 1 <= lastPage.value) {
    page.value = page.value + 1;

    loadAllOrders();
  }
}

const loadAllOrders = () => {
  pending.value = true;

  $fetch(`get_customer_orders`, {
    method: 'GET',
    baseURL: 'http://192.168.1.69:8080/api/web/v1/',
    params: {
      page: page.value
    }
  }).then(function (res) {
    orders.value = res.data;
    pending.value = false;
    // lastPage.value = orders.last_page;
  });
}

const loadOrderByStatus = (status) => {
  pending.value = true;

  $fetch(`get_orders_by_status/` + status, {
    method: 'GET',
    baseURL: 'http://192.168.1.69:8080/api/web/v1/',
    params: {
      page: page.value
    }
  }).then(function (res) {
    orders.value = res.data;
    pending.value = false;
    // lastPage.value = orders.last_page;
  });
}


const statusStr = (status) => {
  if (status == "1") {
    return "Approved";
  } else if (status == "2") {
    return "On Delivery";
  } else if (status == "3") {
    return "Arrived";
  }else if (status == "4") {
    return "Cancelled";
  } else {
    return "Pending";
  }
}

const statusClr = (status) => {
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
    loaded.value = true
  }, 2000)
}
</script>
<template>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="List Products">
        <v-card-text>
          <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
            <v-tab @click="loadAllOrders()" value="all">All Orders</v-tab>
            <v-tab @click="loadOrderByStatus(3)" value="2">Completed</v-tab>
            <v-tab @click="loadOrderByStatus(2)" value="3">Continuing</v-tab>
            <v-tab @click="loadOrderByStatus(0)" value="4">Pending</v-tab>
            <v-tab @click="loadOrderByStatus(4)" value="5">Cancelled</v-tab>

          </v-tabs>
          <v-container>
            <v-card class="mx-auto bg-gray" flat color="grey-lighten-4">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="8">
                    <v-text-field :loading="loading" variant="tonal" density="compact"
                      label="Search for Order ID, customer, order status, or something" prepend-inner-icon="mdi-magnify"
                      single-line hide-details @click:prepend-inner="onSearchData">
                      
                    </v-text-field>
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

              </v-card-text>
            </v-card>
          </v-container>
          <v-window v-model="tab">
            <v-window-item value="all">
              <v-container fluid>
                <v-table class="month-table">
                  <thead>
                    <tr>
                      <th class="text-subtitle-1 font-weight-bold">Order ID</th>
                      <th class="text-subtitle-1 font-weight-bold">Customer</th>
                      <th class="text-subtitle-1 font-weight-bold">Package</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Date</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Price</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Status</th>
                      <th class="text-subtitle-1 font-weight-bold ">Payment Method</th>
                      <th class="text-subtitle-1 font-weight-bold ">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in orders" :key="product" class="month-item">
                      <td>
                        <NuxtLink :to="'orders/' + product.id ">
                        <h6 class="text-subtitle-1 underline-none text-primary font-weight-bold">#{{ product.referenceNo }}</h6>
                      </NuxtLink>                       </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.client }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paidAmount }}</div>
                      </td>
                      <td>
                        <v-chip :class="'text-body-1 px-3 bg-' + statusClr(product.status)" color="white" variant="tonal"
                          size="small"> {{
                            statusStr(product.status) }}</v-chip>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paymentMode }}</div>
                      </td>

                      <td>
                        <v-btn size="large" flat density="compact" variant="tonal" color="primary" class="mx-1"
                          icon="mdi-pencil">

                        </v-btn>

                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-container>
            </v-window-item>
            <v-window-item value="2">
              <v-container>
                <v-table class="month-table">
                  <thead>
                    <tr>
                      <th class="text-subtitle-1 font-weight-bold">Order ID</th>
                      <th class="text-subtitle-1 font-weight-bold">Customer</th>
                      <th class="text-subtitle-1 font-weight-bold">Package</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Date</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Price</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Status</th>
                      <th class="text-subtitle-1 font-weight-bold ">Payment Method</th>
                      <th class="text-subtitle-1 font-weight-bold ">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in orders" :key="product" class="month-item">
                      <td>
                       <NuxtLink :to="'addresses/' + product.id">
                        <h6 class="text-subtitle-1 text-primary font-weight-bold">#{{ product.referenceNo }}</h6>
                      </NuxtLink> 
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.client }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paidAmount }}</div>
                      </td>
                      <td>
                        <v-chip :class="'text-body-1 px-3 bg-' + statusClr(product.status)" color="white" variant="tonal"
                          size="small"> {{
                            statusStr(product.status) }}</v-chip>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paymentMode }}</div>
                      </td>

                      <td>
                        <v-btn size="large" flat density="compact" variant="tonal" color="primary" class="mx-1"
                          icon="mdi-pencil">

                        </v-btn>

                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-container>
            </v-window-item>
            <v-window-item value="3">
              <v-container>
                <v-table class="month-table">
                  <thead>
                    <tr>
                      <th class="text-subtitle-1 font-weight-bold">Order ID</th>
                      <th class="text-subtitle-1 font-weight-bold">Customer</th>
                      <th class="text-subtitle-1 font-weight-bold">Package</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Date</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Price</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Status</th>
                      <th class="text-subtitle-1 font-weight-bold ">Payment Method</th>
                      <th class="text-subtitle-1 font-weight-bold ">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in orders" :key="product" class="month-item">
                      <td>
                        <h6 class="text-subtitle-1 text-primary font-weight-bold">#{{ product.referenceNo }}</h6>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.client }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paidAmount }}</div>
                      </td>
                      <td>
                        <v-chip :class="'text-body-1 px-3 bg-' + statusClr(product.status)" color="white" variant="tonal"
                          size="small"> {{
                            statusStr(product.status) }}</v-chip>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paymentMode }}</div>
                      </td>

                      <td>
                        <v-btn size="large" flat density="compact" variant="tonal" color="primary" class="mx-1"
                          icon="mdi-pencil">

                        </v-btn>

                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-container>
            </v-window-item>
            <v-window-item value="4">
              <v-container>
                <v-table class="month-table">
                  <thead>
                    <tr>
                      <th class="text-subtitle-1 font-weight-bold">Order ID</th>
                      <th class="text-subtitle-1 font-weight-bold">Customer</th>
                      <th class="text-subtitle-1 font-weight-bold">Package</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Date</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Price</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Status</th>
                      <th class="text-subtitle-1 font-weight-bold ">Payment Method</th>
                      <th class="text-subtitle-1 font-weight-bold ">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in orders" :key="product" class="month-item">
                      <td>
                        <h6 class="text-subtitle-1 text-primary font-weight-bold">#{{ product.referenceNo }}</h6>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.client }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paidAmount }}</div>
                      </td>
                      <td>
                        <v-chip :class="'text-body-1 px-3 bg-' + statusClr(product.status)" color="white" variant="tonal"
                          size="small"> {{
                            statusStr(product.status) }}</v-chip>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paymentMode }}</div>
                      </td>

                      <td>
                        <v-btn size="large" flat density="compact" variant="tonal" color="primary" class="mx-1"
                          icon="mdi-pencil">

                        </v-btn>

                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-container>
            </v-window-item>
            <v-window-item value="5">
              <v-container>
                <v-table class="month-table">
                  <thead>
                    <tr>
                      <th class="text-subtitle-1 font-weight-bold">Order ID</th>
                      <th class="text-subtitle-1 font-weight-bold">Customer</th>
                      <th class="text-subtitle-1 font-weight-bold">Package</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Date</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Price</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Status</th>
                      <th class="text-subtitle-1 font-weight-bold ">Payment Method</th>
                      <th class="text-subtitle-1 font-weight-bold ">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in orders" :key="product" class="month-item">
                      <td>
                        <h6 class="text-subtitle-1 text-primary font-weight-bold">#{{ product.referenceNo }}</h6>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.client }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted">{{ product.created_at }}</div>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paidAmount }}</div>
                      </td>
                      <td>
                        <v-chip :class="'text-body-1 px-3 bg-' + statusClr(product.status)" color="white" variant="tonal"
                          size="small"> {{
                            statusStr(product.status) }}</v-chip>
                      </td>
                      <td>
                        <div class="text-13 mt-1 text-muted"> {{ product.paymentMode }}</div>
                      </td>

                      <td>
                        <v-btn size="large" flat density="compact" variant="tonal" color="primary" class="mx-1"
                          icon="mdi-pencil">

                        </v-btn>

                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-container>
            </v-window-item>
          </v-window>

        </v-card-text>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
