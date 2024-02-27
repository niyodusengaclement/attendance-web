<script setup lang="ts">
import Shadow from "@/components/style-components/shadow/Shadow.vue";
import { GoogleMap, InfoWindow, Polyline, Marker, MarkerCluster, CustomMarker } from "vue3-google-map";
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header } from "vue3-easy-data-table"

definePageMeta({
  layout: "admin",
});
const center = { lat: -1.929942, lng: 30.070546 };
const locations = [
  { id: 1, name: "KFC Apartment", household: "John Doe", phone: "078900000", lat: -1.9219384059987712, lng: 30.055965298307225 },
  { id: 1, name: "Bluelight Office", household: "John Doe Ddallyy", phone: "078900000", lat: -1.928500747168837, lng: 30.062617176487635 },
  { id: 1, name: "Home", household: "John Doe", phone: "078900000", lat: -1.9383656568384886, lng: 30.070685260990327 },
  { id: 1, name: "Residence Home", household: "John Doe", phone: "078900000", lat: -1.9251981341823876, lng: 30.094374530381206 },
  { id: 1, name: "KEC Apartment", household: "John Doe", phone: "078900000", lat: -1.9295301317249556, lng: 30.074290149810672 },

]
const flightPath = {
  path: locations,
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
};
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
const dataSectors = ref([
  {
    title: "Nyamirambo",
    desc: "Account Settings",
  },
  {
    title: "Kabeza",
    desc: "Messages & Emails",
  },
  {
    title: "Kacyiru",
    desc: "To-do and Daily Tasks",
  },
]);

const http = useHttpRequest()
const search = ref("");
const lists = ref([]);
const showForm = ref(false)
const loading = ref(false)
const headers: Header[] = [
    { text: "Date", value: "created_at", sortable: true },
    { text: "Client name", value: "customer_name", sortable: true },
    { text: "Client Phone", value: "phone_number", sortable: true },
    { text: "Order ID", value: "reference_code", sortable: true },
    { text: "Driver", value: "driver", sortable: true },
    { text: "Driver Phone", value: "driver_phone", sortable: true },
    { text: "Vehicle Id", value: "plate_number", sortable: true },
    { text: "Source Location", value: "source", sortable: true },
    { text: "Destination Location", value: "address", sortable: true },
    // { text: "Actions", value: "actions", width: 120 },
]
const user = JSON.parse(localStorage.getItem("logger"))

const statusStr = (status: string) => {
    if (status == "1") {
        return "Open";
    } else if (status == "2") {
        return "On Delivery";
    } else if (status == "3") {
        return "Arrived";
    } else if (status == "4") {
        return "Cancelled";
    } else {
        return "Closed";
    }
}

const statusClr = (status: string) => {
    if (status == "1") {
        return "success";
    } else if (status == "2") {
        return "secondary";
    } else if (status == "3") {
        return "success";
    } else if (status == "4") {
        return "error";
    } else {
        return "error";
    }
}



function getDeliveryReport() {
    loading.value = true
    http.fetch("getDeliveryReport")
        .then(res => {
            lists.value = res
        })
        .catch(err => {
            console.log(err.response.message);

        })
        .finally(() => {
            loading.value = false
        })
}

onMounted(() => {
    getDeliveryReport()
})
</script>

<template>
  <div>
    <v-row>
        <v-col>
            <UiParentCard parent-title="Dashboard" title="Delivery Report">
                <v-row class="mb-4">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="search" variant="outlined" density="compact" label="Search for Title"
                            prepend-inner-icon="mdi-magnify" single-line hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col v-if="false" class="flex" cols="12" md="2">
                        <v-btn prepend-icon="mdi-microsoft-excel" color="success" class="mx-2"
                            variant="tonal">
                            Export
                        </v-btn>
                    </v-col>
                </v-row>
                <ClientOnly>
                    <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
                        table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading" :items="lists">
                        <template #item-status="item">
                            <v-chip size="small" :color="statusClr(item.status)"> {{ statusStr(item.status) }} </v-chip>
                        </template>
                        <template #item-actions="item">
                            <div class="flex justify-between space-x-3">
                                <v-btn variant="outlined" size="small" color="error" v-if="item.status === '1'"
                                    @click="changeShopStatus(0, item.id)"> <v-icon>mdi-close</v-icon> Close</v-btn>
                                <v-btn variant="outlined" size="small" color="success" v-else
                                    @click="changeShopStatus(1, item.id)">
                                    <v-icon>mdi-check</v-icon> Open</v-btn>
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
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12">
        <GoogleMap api-key="AIzaSyDHq7ERLIFZX2Mi79e0P_SIi5SL4ujwsw8" :scrollwheel="controls" :zoomControl="true"
          :fullscreenControl="controls" :mapTypeControl="controls" :streetViewControl="controls" :styles="options"
          style="width: 100%; height: 600px;" :center="center" :zoom="15">
    
          <CustomMarker v-for="(location, i) in locations" :key="i"
            :options="{ position: location, anchorPoint: 'BOTTOM_CENTER' }">
    
            <NuxtLink :to="'addresses/' + location.id" href="#">
              <!-- Text/Icon goes here -->
              <img src="/images/destination.png" style="height: 50px; width: 50;" class="rounded-full " />
            </NuxtLink>
          </CustomMarker>
    
    
        </GoogleMap>
      </v-col>
  </v-row>
  </div>
</template> 
