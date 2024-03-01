<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header } from "vue3-easy-data-table"
import { GoogleMap, InfoWindow, Polyline, Marker, MarkerCluster, CustomMarker } from "vue3-google-map";

definePageMeta({
  layout: "admin",
});
const instance = getCurrentInstance();
const http = useHttpRequest()
const search = ref("");
const lists = ref([]);
const showDetails = ref(false)
const title = ref("")
const shop = ref([])
const zones = ref([])
const selectedZone = ref("")
const loading = ref(false)
const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Shop name", value: "shop_name", sortable: true },
  { text: "Phone Number", value: "phone", sortable: true },
  { text: "Email Address", value: "email", sortable: true },
  { text: "Zone", value: "title", sortable: true },
  { text: "Actions", value: "actions", width: 120 },
]
const center = { lat: -1.929942, lng: 30.070546 };
const locations = [
  { id: 1, name: "KFC Apartment", household: "John Doe", phone: "078900000", lat: -1.9219384059987712, lng: 30.055965298307225 },
]
const options = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]
const controls = ref(false)

function getAllShops() {
  loading.value = true
  http.fetch("getShopRegistrationRequest")
    .then(res => {
      lists.value = res
    })
    .catch(err => {
      console.log(err.data.message);

    })
    .finally(() => {
      loading.value = false
    })
}

function getShopInfo(id: any) {
  http.fetch("getShopInfo/" + id)
    .then(res => {
      shop.value = res
      center.lat = parseFloat(res.lat)
      center.lng = parseFloat(res.lng)

      showDetails.value = true
      getZones()
    })
}

function getZones() {
  http.fetch("getZonesForForm")
    .then(res => {
      zones.value = res
    })
}

function approveShop(id: any) {
  const formData = new FormData()
  formData.append("zone", selectedZone.value)
  formData.append("id", id)

  http.fetch("approveShop", {
    method: "post",
    body: formData
  })
    .then(res => {
      useToast().success(res.message)
      showDetails.value = false
      shop.value = []
    })
    .catch(err => {
      useToast().error(err.data.message)
    })
}

onMounted(() => {
  getAllShops()
})

</script>
<template>
  <v-row>
    <v-col cols="12" md="12">
      <div class="flex justify-between">
        <div class="d-flex align-center">
          <NuxtLink to="/shops">
            <v-btn size="large" flat color="info" density="compact" variant="text" icon="mdi-chevron-left">
            </v-btn>
          </NuxtLink>

          <h5 class="text-h5 mb-6 pl-2 pt-7 font-weight-light text-muted">
            Back to Shop
          </h5>
        </div>
      </div>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <UiParentCard parent-title="Dashboard" title="Shops">
        <v-row class="mb-4">
          <v-col cols="12" md="8">
            <v-text-field v-model="search" variant="outlined" density="compact" label="Search for Title"
              prepend-inner-icon="mdi-magnify" single-line hide-details>
            </v-text-field>
          </v-col>
        </v-row>
        <ClientOnly>
          <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
            table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading" :items="lists">
            <template #item-actions="item">
              <div class="flex justify-between space-x-3">
                <v-btn variant="outlined" size="small" color="success" @click="getShopInfo(item.id)">
                  <v-icon>mdi-open-in-new</v-icon> Open</v-btn>
              </div>
            </template>

            <template #empty-message>
              <div class="d-flex justify-center align-center py-3">
                <v-img src="/images/products/not_found.png" height="150"></v-img>
              </div>
              <p class="text-muted font-weight-light"> No Found</p>
            </template>
          </EasyDataTable>
        </ClientOnly>
      </UiParentCard>
    </v-col>
    <v-col cols="12" md="4" v-if="showDetails">
      <v-card elevation="10" class="rounded-lg">
        <v-card-text>
          <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
            <div class="d-flex justify-between pb-2">
              <div class="h4 font-bold">Customer Info</div>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </div>

            <v-list-item class="w-100 my-4">
              <template v-slot:prepend>
                <v-avatar color="grey-darken-3"
                  image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-avatar>
              </template>

              <v-list-item-title>{{
                shop.shop_name ?? "Shop Name"
              }}</v-list-item-title>

              <v-list-item-subtitle class="text-13">Email:
                {{
                  shop.email ?? "dallyjones4@yahoo.com"
                }}</v-list-item-subtitle>
              <v-list-item-subtitle class="text-13">Phone:
                {{
                  shop.phone ?? "+250785100000"
                }}</v-list-item-subtitle>
            </v-list-item>
          </div>

          <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
            <div class="d-flex justify-between pb-2">
              <div class="h4 font-bold">Other Info</div>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </div>

            <div class="w-100 my-4 space-y-4">
              <div class="flex justify-between">
                <div class="text-muted text-small">TIN Number</div>
                <div class="text-dark font-medium text-small">{{ shop.tin_number }}</div>
              </div>
              <!-- <div class="flex justify-between">
                                <div class="text-muted text-small">Tracking No.</div>
                                <div class="text-dark font-medium text-small">
                                    SPX037739199373
                                </div>
                            </div> -->
            </div>
          </div>
          <div class="pa-1 border-b-2 mb-4 py-2 border-gray-200">
            <div class="d-flex justify-between pb-2">
              <div class="h4 font-bold">Shop location</div>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </div>

            <GoogleMap api-key="AIzaSyDHq7ERLIFZX2Mi79e0P_SIi5SL4ujwsw8" :scrollwheel="controls" :zoomControl="true"
              :fullscreenControl="controls" :mapTypeControl="controls" :streetViewControl="controls" :styles="options"
              style="width: 100%; height: 200px;" :center="center" :zoom="15">

              <CustomMarker v-for="(location, i) in center" :key="i"
                :options="{ position: location, anchorPoint: 'BOTTOM_CENTER' }">
              </CustomMarker>


            </GoogleMap>
          </div>
          <div class="pa-1 border-b-0 mb-4 py-2 border-gray-200">
            <div class="d-flex justify-between pb-2">
              <div class="h4 font-bold">Zone</div>
              <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
            </div>

            <div class="w-100 my-4 space-y-4">
              <div class="flex justify-between">
                <!-- <div class="text-muted text-small"></div> -->
                <v-select :items="zones" v-model="selectedZone" variant="outlined" density="compact" label="Choose Zone"
                  color="primary" item-title="text" item-value="value"></v-select>
              </div>
            </div>
          </div>
          <v-card-actions class="justify-content-end">
            <v-btn @click="showDetails = false" color="error" variant="outlined">Close</v-btn>
            <v-btn @click="approveShop(shop.id)" color="success" :disabled="selectedZone === ''"
              variant="flat">Approve</v-btn>
            <!-- <v-btn @click="approveShop(shop.id)" color="error" :disabled="selectedZone===''" variant="flat">Approve</v-btn> -->
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
