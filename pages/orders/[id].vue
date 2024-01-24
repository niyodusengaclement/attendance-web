
<template >
  <v-row>
    <v-col cols="12" md="12">
      <div class="flex justify-between">
        <div class="d-flex align-center">
          <NuxtLink to="/orders">
            <v-btn size="large" flat density="compact" variant="text" icon="mdi-chevron-left">

            </v-btn>
          </NuxtLink>

          <h5 class="text-h5 mb-6 pl-2 pt-7 font-weight-light text-muted"> Order </h5>
          <ChevronRightIcon :class="'text-muted mx-2 mt-1'" size="20" />
          <h5 class="text-h5 mb-6 text-primary pt-7">8797455451</h5>
          <v-chip class="mx-4" color="teal" close-icon="mdi-delete" prepend-icon="mdi-checkbox-marked-circle"
            :model-value="true">
            Confirmed
          </v-chip>
        </div>
        <div class="flex ">

          <v-chip class="ma-2" color="teal" close-icon="mdi-delete" prepend-icon="mdi-checkbox-marked-circle"
            :model-value="true">
            Confirmed
          </v-chip>
        </div>
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" md="8"><v-card elevation="10" class="withbg rounded-lg">
        <v-card-text>

          <div class="bg-borderColor rounded-lg pa-2">
            <div class="d-flex justify-between pb-2 ">
              <div class="h4 px-4 font-bold">
                Details
              </div>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </div>
            <div class="flex justify-between">
             <v-row>
              <v-col cols="12" md="7"></v-col>
              <v-col cols="12" md="5"><div class="col-md-4 w-100 my-4 space-y-3">
                <!-- <div class="flex justify-between">
                  <div class="text-muted text-small">Subtotal</div>
                  <div class="text-dark font-medium text-small">$83.74</div>
                </div>
                <div class="flex justify-between">
                  <div class="text-muted text-small">Shipping</div>
                  <div class="text-dark font-medium text-small">- $10</div>
                </div>
                <div class="flex justify-between">
                  <div class="text-muted text-small">Discount</div>
                  <div class="text-error font-medium text-small">- $10</div>
                </div> -->
                <div class="flex justify-between">
                  <div class="text-muted text-small">Total</div>
                  <div class="text-dark font-bold  ">{{ order.amount_paid}}Rwf</div>
                </div>
              </div></v-col>
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
                    <h6 class="text-subtitle-1 underline-none text-primary font-weight-bold">#{{ product.id }}
                    </h6>
                  </td>
                  <td>
                    <div class="text-13 text-muted">{{ product.product_name }}</div>
                  </td>
                  <td>
                    <div class="text-13 text-muted">{{ product.quantity }}</div>
                  </td>
                  <td>
                    <div class="text-13 text-muted">{{ product.product_price }}</div>
                  </td>


                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-card-text>

      </v-card></v-col>
    <v-col cols="12" md="4">
      <v-card elevation="10" class="rounded-lg">
        <v-card-text>
          <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
            <div class="d-flex justify-between pb-2 ">
              <div class="h4 font-bold">
                Customer Info
              </div>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </div>

            <v-list-item class="w-100 my-4">
              <template v-slot:prepend>
                <v-avatar color="grey-darken-3"
                  image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-avatar>
              </template>

              <v-list-item-title>{{ order.customer_name ?? 'Client Name' }}</v-list-item-title>

              <v-list-item-subtitle class="text-13">Email: {{ order.email ?? 'dallyjones4@yahoo.com'
              }}</v-list-item-subtitle>
              <v-list-item-subtitle class="text-13">Phone: {{ order.phone_number ?? '+250785100000'
              }}</v-list-item-subtitle>


            </v-list-item>
          </div>

          <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
            <div class="d-flex justify-between pb-2 ">
              <div class="h4 font-bold">
                Delivery
              </div>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </div>

            <div class="w-100 my-4 space-y-4">
              <div class="flex justify-between">
                <div class="text-muted text-small">Ship By</div>
                <div class="text-dark font-medium text-small">DHL</div>
              </div>
              <div class="flex justify-between">
                <div class="text-muted text-small">Tracking No.</div>
                <div class="text-dark font-medium text-small">SPX037739199373</div>
              </div>
            </div>
          </div>
          <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
            <div class="d-flex justify-between pb-2 ">
              <div class="h4 font-bold">
                Shipping location
              </div>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </div>

            <div class="w-100 my-4 space-y-4">

              <div class="flex justify-between">
                <div class="text-muted text-small">Phone number</div>
                <div class="text-dark font-medium text-small">365-374-4961</div>
              </div>
              <div class="flex justify-between">
                <div class="text-muted text-small">House No.</div>
                <div class="text-dark font-medium text-small">KN 12 Ave</div>
              </div>
              <div class="flex justify-between">
                <div class="text-muted text-small">Address</div>
                <div class="text-dark font-medium text-small">Kigali,Rwanda </div>
              </div>
            </div>

          </div>
          <div class="pa-1 border-b-0 mb-4 py-2 border-gray-200">
            <div class="d-flex justify-between pb-2 ">
              <div class="h4 font-bold">
                Delivery
              </div>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </div>

            <div class="w-100 my-4 space-y-4">

              <div class="flex justify-between">
                <div class="text-muted text-small">Phone number</div>
                <div class="text-dark font-medium text-small">(078******48 ) MoMo</div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
  
<script setup>
import { onMounted } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { GoogleMap, InfoWindow, Polyline, Marker, MarkerCluster, CustomMarker } from "vue3-google-map";
const route = useRoute();
const http = useHttpRequest()
const tab = ref(null);
const orderId = ref(route.params.id);
const order = ref([]);
// const orderProducts = ref([]);
const deliveryLocations = ref([]);
const driver = ref([]);
const loading = ref(false)
definePageMeta({
  layout: "admin",
});

onMounted(() => {
  loadOrderById();
  console.log(orderId)
})

const orderProducts = ref([])



function loadOrderById() {
  loading.value = true
  http.fetch("order_details/" + orderId.value)
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

</script>

  