<template>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="List Products">
        <v-card-text>

          <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
            <v-tab @click="loadAllOrders()" :value="1">All Orders
              <v-chip size="small" class="ma-1"> {{ lists.length ?? 0 }} </v-chip>
            </v-tab>
            <v-tab @click="loadOrderByStatus(3)" :value="2">Completed
              <v-chip size="small" class="ma-1"> {{ completed }} </v-chip>
            </v-tab>
            <v-tab @click="loadOrderByStatus(2)" :value="3">On Delivery
              <v-chip size="small" class="ma-1"> {{ shipping }} </v-chip></v-tab>
            <v-tab @click="loadOrderByStatus(0)" :value="4">Pending
              <v-chip size="small" class="ma-1"> {{ pending }} </v-chip></v-tab>
            <v-tab @click="loadOrderByStatus(4)" :value="5">Cancelled
              <v-chip size="small" class="ma-1"> {{ cancelled }} </v-chip></v-tab>
          </v-tabs>
          <v-container>

          </v-container>
          <v-window v-model="tab">
            <v-window-item v-for="n in 5" :key="n" :value="n">
              <v-container fluid>
                <ClientOnly>
                  <EasyDataTable ref="dataTable" empty-message="No Order found" :search-value="search"
                    theme-color="#5d87ff" table-class-name="eztable" :headers="headers" :loading="loading" :items="lists"
                    v-model:items-selected="orderSelected" :rows-per-page="15">

                    <template #item-status="item">
                      <v-chip size="small" :color="statusClr(item.status)"> {{ statusStr(item.status) }} </v-chip>

                    </template>
                    <template #item-reference_code="item">
                      <NuxtLink :to="'/orders/' + item.reference_code">
                        <div class="text-primary font-bold">#{{ item.reference_code }}</div>
                      </NuxtLink>
                    </template>
                    <template #item-packages="item">
                      <div @click="editItem(item)" class="text-primary cursor-pointer font-bold">{{ item.packages }}
                        Packages
                      </div>

                    </template>
                    <template #empty-message>
                      <div class="d-flex justify-center align-center py-3">
                        <v-img src="/images/products/not_found.png" height="150"></v-img>
                      </div>
                      <p class="text-muted font-weight-light"> No Found</p>
                    </template>
                    <template #item-actions="item">
                      <div class=" row">
                        <v-btn size="small" flat variant="tonal" color="success" class="mx-1" @click="approveItem(item)">
                          <v-icon class="mr-2">mdi-check</v-icon> Approve
                        </v-btn>
                        <NuxtLink :to="'/orders/' + item.reference_code">
                          <v-btn size="small" flat variant="outlined" color="info" class="mx-1">View
                            <v-icon class="ml-2">mdi-chevron-right</v-icon>

                          </v-btn>
                        </NuxtLink>

                      </div>
                    </template>
                  </EasyDataTable>

                </ClientOnly>
                <v-dialog v-model="isViewing" persistent width="auto">
                  <v-card width="450">
                    <v-card-title color="success" class="text-h5 font-bold text-info pa-6">
                      {{ editingItem.customer_name + " #" + editingItem.reference_code }}
                    </v-card-title>
                    <v-card-text>
                      <table
                        class="d-flex flex-col space-y-3 rounded-lg table-fixed border-collapse border border-slate-500">
                        <thead class=" bg-borderColor rounded-t-lg  px-8 py-2">
                          <tr class="d-flex justify-between w-full">
                            <th class=" items-center align-center text-center order border-slate-600">
                              Title
                            </th>
                            <th class="items-center align-center text-center order border-slate-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="justify-between w-full d-flex border-b-1 my-2 mx-2 border-slate-300 "
                            v-for="(item, i) in packages" :key="i">
                            <td class="px-4 py-1 text-xs  border-slate-200 " width="220">{{ item.item_name }}</td>
                            <td class="px-4 py-1 text-xs  border-slate-200">x {{ item.quantity }}</td>
                            <td class="px-4 py-1 text-xs font-bold  border-slate-200">{{ item.item_price }} Frw</td>

                          </tr>
                        </tbody>
                      </table>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" variant="text" :loading="btnDeleteLoading" class="mx-1"
                        prepend-icon="mdi-close" @click="isViewing = false">
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-dialog v-model="isApprove" persistent width="auto">
                  <v-card width="450">
                    <v-card-title color="success" class="text-h5 font-bold text-info pa-6">
                      {{ editingItem.customer_name + " #" + editingItem.reference_code }}
                    </v-card-title>
                    <v-card-text>

                      <v-select v-model="selectedDeliveryId" :items="drivers" variant="outlined" density="compact"
                        label="Assign Driver" color="primary" item-title="names" item-value="id" return-object></v-select>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" variant="text" class="mx-1" prepend-icon="mdi-close"
                        @click="isApprove = false">
                        Close
                      </v-btn> <v-btn color="success" :loading="btnApproveLoading" flat variant="tonal" class="mx-1"
                        prepend-icon="mdi-check" @click="approveOrderClient(editingItem.id)">
                        Approve Order
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-container>
            </v-window-item>

          </v-window>

        </v-card-text>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header, Item } from "vue3-easy-data-table"
import { useHttpRequest } from '~~/composables/useHttpRequest';
definePageMeta({
  layout: "admin",
});
const http = useHttpRequest()
const instance = getCurrentInstance();
const loading = ref(false);
const isViewing = ref(false);
const isApprove = ref(false);
const btnApproveLoading = ref(false);
const tab = ref(null);
const search = ref("");
const drivers = ref([]);
const pending = ref(0);
const packages = ref([]);
const completed = ref(0);
const shipping = ref(0);
const cancelled = ref(0);
const selectedDeliveryId = ref()
onMounted(() => {
  loadAllOrders();
})

const editingItem = reactive({
  reference_code: "",
  customer_name: "",
  id: 0,
});

const headers: Header[] = [
  { text: "Order ID", value: "reference_code", sortable: true },
  { text: "Customer", value: "customer_name", sortable: true },
  { text: "Package", value: "packages", sortable: true },
  { text: "Price", value: "amount_paid", sortable: true },
  { text: "Payment Mode", value: "payment_mode", sortable: true },
  { text: "Delivery Status", value: "status", sortable: true },
  { text: "Delivery Date", value: "updated_at", sortable: true },
  { text: "Actions", value: "actions", width: 220 },
]

const lists = ref([])
const orderSelected = ref([])

function loadAllOrders() {
  loading.value = true
  http.fetch("fetch_orders")
    .then((data: any) => {
      if (data.status == 200) {
        lists.value = data.records;
        pending.value = data.pending;
        cancelled.value = data.cancelled;
        shipping.value = data.shipping;
        completed.value = data.completed;
        instance?.proxy?.$forceUpdate();
      }
    })
    .catch(() => { })
    .finally(() => (loading.value = false));
}

function loadOrderByStatus(status: any) {
  loading.value = true
  let formData = new FormData();
  formData.append("status", status)
  http.fetch("fetch_orders", {
    method: "POST",
    body: formData
  })
    .then((data: any) => {
      if (data.status == 200) {
        lists.value = data.records;
        instance?.proxy?.$forceUpdate();
      }
    })
    .catch(() => { })
    .finally(() => (loading.value = false));
}
function loadAllDrivers() {
  loading.value = true
  http.fetch("get_all_drivers")
    .then((data: any) => {
      if (data.status == 200) {
        drivers.value = data.drivers;
        instance?.proxy?.$forceUpdate();
      }
    })
    .catch(() => { })
    .finally(() => (loading.value = false));
}
function loadPackagesList(orderId: any) {
  loading.value = true
  let formData = new FormData();
  formData.append("orderId", orderId)
  http.fetch("fetch_order_details", {
    method: "POST",
    body: formData
  })
    .then((data: any) => {
      if (data.status == 200) {
        packages.value = data.packages;
        instance?.proxy?.$forceUpdate();
      }
    })
    .catch(() => { })
    .finally(() => (loading.value = false));
}

function approveOrderClient(id: any) {
  btnApproveLoading.value = true;
  var formData = new FormData();
  formData.append("orderId", id.toString());
  formData.append("driverId", selectedDeliveryId.value.toString());
  formData.append("status", "2");
  http
    .fetch("approve_client_order", {
      method: "POST",
      body: formData
    })
    .then((data: any) => {
      if (data.status == 200) {
        useToast().success(data.message);
        loadAllOrders();
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      btnApproveLoading.value = false;
      isApprove.value = false;
    });
}

const statusStr = (status: string) => {
  if (status == "1") {
    return "Completed";
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

const editItem = (val: Item) => {
  isViewing.value = true;

  const { reference_code, customer_name, id } =
    val;

  loadPackagesList(id);

  editingItem.reference_code = reference_code;
  editingItem.customer_name = customer_name;
  editingItem.id = id;

};

const approveItem = (val: Item) => {
  isApprove.value = true;
  const { reference_code, customer_name, id } =
    val;
  loadAllDrivers();
  editingItem.reference_code = reference_code;
  editingItem.customer_name = customer_name;
  editingItem.id = id;

};

</script>
