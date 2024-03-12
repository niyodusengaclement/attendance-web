<template>
  <div>
    <v-row>
      <v-col cols="12" md="12">
        <div class="flex justify-between">
          <div class="d-flex align-center">
            <NuxtLink to="/orders">
              <v-btn size="large" flat density="compact" variant="text" icon="mdi-chevron-left">
              </v-btn>
            </NuxtLink>
  
            <h5 class="text-h5 mb-6 pl-2 pt-7 font-weight-light text-muted">
              Order
            </h5>
            <ChevronRightIcon :class="'text-muted mx-2 mt-1'" size="20" />
            <h5 class="text-h5 mb-6 text-primary pt-7">8797455451</h5>
            <v-chip class="mx-4" color="teal" close-icon="mdi-delete" prepend-icon="mdi-checkbox-marked-circle"
              :model-value="true">
              Confirmed
            </v-chip>
          </div>
          <div class="flex">
            <v-chip v-if="order.status == '1'" class="ma-2" color="success" close-icon="mdi-delete" prepend-icon="mdi-checkbox-marked-circle"
              :model-value="true">
              Confirmed
            </v-chip>
            <v-chip v-else-if="order.status == '4'" class="ma-2" color="error" close-icon="mdi-delete" prepend-icon="mdi-checkbox-marked-circle"
              :model-value="true">
              Canceled
            </v-chip>
            <div v-else>
              <v-btn size="small" v-if="order.length !== 0 && order.status != '2'" flat variant="flat" color="success" class=" ma-2" @click="approveItem(order)">
                <v-icon class="mr-2">mdi-check</v-icon> Approve
              </v-btn>
              <v-btn size="small" v-if="order.length !== 0" flat variant="flat" color="error" class=" ma-2" @click="approveOrderClient(order.id,'4')">
                <v-icon class="mr-2">mdi-close</v-icon> Cancel
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8"><v-card elevation="10" class="withbg rounded-lg">
          <v-card-text>
            <div class="bg-borderColor rounded-lg pa-2">
              <div class="d-flex justify-between pb-2">
                <div class="h4 px-4 font-bold">Details</div>
                <!-- <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn> -->
              </div>
              <div class="flex justify-between">
                <v-row>
                  <v-col cols="12" md="7"></v-col>
                  <v-col cols="12" md="5">
                    <div class="col-md-4 w-100 my-4 space-y-3">
           
                      <div class="flex justify-between">
                        <div class="text-muted text-small">Total</div>
                        <div class="text-dark font-bold">
                          {{ order.amount_paid }}Rwf
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
  
            <v-col cols="12" md="12">
              <v-table class="month-table">
                <thead>
                  <tr>
                    <th class="text-subtitle-1 font-weight-bold">Item ID</th>
                    <th class="text-subtitle-1 font-weight-bold">Product</th>
                    <th class="text-subtitle-1 font-weight-bold">Quantity</th>
                    <th class="text-subtitle-1 font-weight-bold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in orderProducts" :key="product.id" class="month-item">
                    <td>
                      <h6 class="text-subtitle-1 underline-none text-primary font-weight-bold">
                        #{{ product.id }}
                      </h6>
                    </td>
                    <td>
                      <div class="text-13 text-muted">
                        {{ product.product_name }}
                      </div>
                    </td>
                    <td>
                      <div class="text-13 text-muted">{{ product.quantity }}</div>
                    </td>
                    <td>
                      <div class="text-13 text-muted">
                        {{ product.product_price }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="10" class="rounded-lg">
          <v-card-text>
            <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
              <div class="d-flex justify-between pb-2">
                <div class="h4 font-bold">Customer Info</div>
                <!-- <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn> -->
              </div>
  
              <v-list-item class="w-100 my-4">
                <template v-slot:prepend>
                  <v-avatar color="grey-darken-3"
                    image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-avatar>
                </template>
  
                <v-list-item-title>{{
                  order.customer_name ?? "Client Name"
                }}</v-list-item-title>
  
                <v-list-item-subtitle class="text-13">Email:
                  {{
                    order.email ?? "dallyjones4@yahoo.com"
                  }}</v-list-item-subtitle>
                <v-list-item-subtitle class="text-13">Phone:
                  {{
                    order.phone_number ?? "+250785100000"
                  }}</v-list-item-subtitle>
              </v-list-item>
            </div>
  
            <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
              <div class="d-flex justify-between pb-2">
                <div class="h4 font-bold">Delivery</div>
                <!-- <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn> -->
              </div>
  
              <div class="w-100 my-4 space-y-4">
                <div class="flex justify-between">
                  <div class="text-muted text-small">Ship By</div>
                  <div class="text-dark font-medium text-small">{{ order.driver }}</div>
                </div>
                <div class="flex justify-between">
                  <div class="text-muted text-small">Tracking No.</div>
                  <div class="text-dark font-medium text-small">
                    {{ order.reference_code }}
                  </div>
                </div>
              </div>
            </div>
            <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
              <div class="d-flex justify-between pb-2">
                <div class="h4 font-bold">Shipping location</div>
                <!-- <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn> -->
              </div>
  
              <div class="w-100 my-4 space-y-4">
                <div class="flex justify-between">
                  <div class="text-muted text-small">Phone number</div>
                  <div class="text-dark font-medium text-small">{{ order.phone_number}}</div>
                </div>
                <div class="flex justify-between">
                  <div class="text-muted text-small">House No.</div>
                  <div class="text-dark font-medium text-small">{{ order.house_number}}</div>
                </div>
                <div class="flex justify-between">
                  <div class="text-muted text-small">Address</div>
                  <div class="text-dark font-medium text-small">
                    {{ order.address}}
                  </div>
                </div>
              </div>
            </div>
            <div class="pa-1 border-b-0 mb-4 py-2 border-gray-200">
              <div class="d-flex justify-between pb-2">
                <div class="h4 font-bold">Payment Mode</div>
                <!-- <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn> -->
              </div>
  
              <div class="w-100 my-4 space-y-4">
                <div class="flex justify-between">
                  <div class="text-muted text-small"> </div>
                  <div class="text-dark font-medium text-small">
                    {{ order.payment_mode }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
  
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
            <v-btn color="primary" variant="text" class="mx-1" prepend-icon="mdi-close" @click="isApprove = false; selectedDeliveryId = ''">
              Close
            </v-btn>
            <v-btn color="success" :loading="btnApproveLoading" flat variant="tonal" class="mx-1" prepend-icon="mdi-check"
              @click="approveOrderClient(editingItem.id,'2')">
              Approve Order
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
const http = useHttpRequest();
const route = useRoute();
const orderId = ref(route.params.id);
const order = ref([]);
const loading = ref(false);
const isApprove = ref(false);
const btnApproveLoading = ref(false);
const drivers = ref([]);
const selectedDeliveryId = ref();
const editingItem = reactive({
  reference_code: "",
  customer_name: "",
  id: 0
});
definePageMeta({
  layout: "admin",
});

onMounted(() => {
  loadOrderById(orderId.value);
});

const orderProducts = ref([]);

async function loadOrderById(id: any) {
  loading.value = true;
  await http
    .fetch("order_details/" + id)
    .then((data) => {
      if (data.status == 200) {
        // lists.value = data.records;
        order.value = data.details[0];
        //driver.value = data.driver;
        orderProducts.value = data.products;
        //deliveryLocations.value = data.delivery_address
        instance?.proxy?.$forceUpdate();
      }
    })
    .catch(() => { })
    .finally(() => (loading.value = false));
}

function loadAllDrivers() {
  loading.value = true;
  http
    .fetch("get_all_drivers/0")
    .then((data: any) => {
      if (data.status == 200) {
        drivers.value = data.drivers;
        instance?.proxy?.$forceUpdate();
      }
    })
    .catch(() => { })
    .finally(() => (loading.value = false));
}
const approveItem = (val: any) => {
  isApprove.value = true;
  const { reference_code, customer_name, id } = val;
  loadAllDrivers();
  editingItem.reference_code = reference_code;
  editingItem.customer_name = customer_name;
  editingItem.id = id;
};
function approveOrderClient(id: any,status = '2') {
  btnApproveLoading.value = true;
  var formData = new FormData();
  formData.append("orderId", id.toString());
  formData.append("driverId", selectedDeliveryId.value.toString());
  formData.append("status", status);
  http
    .fetch("approve_client_order", {
      method: "POST",
      body: formData,
    })
    .then((data: any) => {
      if (data.status == 200) {
        useToast().success(data.message);
        loadOrderById(orderId.value);
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
</script>
