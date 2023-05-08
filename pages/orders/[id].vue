
<template >
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Order Details">

        <v-card-text>
          <v-list-item class="w-100">
            <template v-slot:prepend>
              <v-avatar color="grey-darken-3"
                image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-avatar>
            </template>

            <v-list-item-title>{{ order.client }}</v-list-item-title>

            <v-list-item-subtitle class="text-13">Phone: {{ order.clientPhone }}</v-list-item-subtitle>

            <template v-slot:append>
              <div class="justify-self-end">
                <v-chip :class="'text-body-1 px-5 bg-primary'" color="white" variant="tonal" > 
                {{ order.status == 1 ? `Approved` : ` Pending` }}</v-chip>
              </div>
            </template>
          </v-list-item>
          <v-row>
            <v-col cols="12" md="7">
              <v-tabs v-model="tab" class="ma-2" color="deep-purple-accent-4" align-tabs="left">
                <v-tab value="1"> <v-icon class="mr-1">mdi-shopping </v-icon> Order Details</v-tab>
                <v-tab value="2"> <v-icon class="mr-1">mdi-map-marker </v-icon> Delivery address</v-tab>
                <v-tab value="3"> <v-icon class="mr-1">mdi-account </v-icon>Driver Info </v-tab>
                <v-tab value="4"> <v-icon class="mr-1">mdi-truck </v-icon> Vehicle</v-tab>
              </v-tabs>
              <v-window v-model="tab">
                <v-window-item value="1">
                  <v-container fluid>
                    <v-table class="month-table">
                  <thead>
                    <tr>
                      <th class="text-subtitle-1 font-weight-bold">Order ID</th>
                      <th class="text-subtitle-1 font-weight-bold">Package</th>
                      <th class="text-subtitle-1 font-weight-bold">Package</th>
                      <th class="text-subtitle-1 font-weight-bold">Delivery Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in orderDetials" :key="product" class="month-item">
                      <td>
                        <h6 class="text-subtitle-1 underline-none text-primary font-weight-bold">#{{ product.id }}</h6>
                      </td>
                      <td>
                        <div class="text-13 text-muted">{{ product.id }}</div>
                      </td>
                      <td>
                        <div class="text-13 text-muted">{{ product.id }}</div>
                      </td>
                      <td>
                        <div class="text-13 text-muted">{{ product.id }}</div>
                      </td>
                      
                    
                    </tr>
                  </tbody>
                </v-table>
                  </v-container>
                </v-window-item>
                <v-window-item value="2">
                  <v-container fluid>
                    <v-card class="bg-light " variant="tonal" flat="">
                      <v-card-item>
                        <v-card-title class="text-17 text-muted px-2">This is a title</v-card-title>

                        <v-card-subtitle class="text-13 text-muted px-2">This is a subtitle</v-card-subtitle>
                      </v-card-item>

                    </v-card>
                  </v-container>
                </v-window-item>
                <v-window-item value="3">
                  <v-container fluid>
                    <v-card class="bg-light " variant="tonal" flat="">
                      <v-card-item>
                        <v-card-title class="text-17 text-muted px-2">This is a title</v-card-title>

                        <v-card-subtitle class="text-13 text-muted px-2">This is a subtitle</v-card-subtitle>
                      </v-card-item>

                    </v-card>
                  </v-container>
                </v-window-item>
              </v-window>

            </v-col>
            <v-col cols="12" md="5">
              <v-card>
                <GoogleMap api-key="AIzaSyC4ErBNYPdhgC4cs6tAsoWoOEkRbXhJM3o" :scrollwheel="controls" :zoomControl="false"
                  :fullscreenControl="controls" :mapTypeControl="controls" :streetViewControl="controls" :styles="options"
                  style="width: 100%; height: 400px;" :center="center" :zoom="14" class="rounded-lg">

                  <CustomMarker v-for="(location, i) in deliveryLocations" :key="i"
                    :options="{ position: location, anchorPoint: 'BOTTOM_CENTER' }">

                    <NuxtLink :to="'addresses/' + location.id" href="#">
                      <!-- Text/Icon goes here -->
                      <img src="/images/destination.png" style="height: 50px; width: 50;" class="rounded-full " />
                    </NuxtLink>
                  </CustomMarker>


                </GoogleMap>
              </v-card>
            </v-col>
          </v-row>


        </v-card-text>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
  
<script setup>
import { onMounted } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { GoogleMap, InfoWindow, Polyline, Marker, MarkerCluster, CustomMarker } from "vue3-google-map";
const route = useRoute();
const tab = ref(null);
const orderId = route.params.id;
const order = ref([]);
const orderDetials = ref([]);
const deliveryLocations = ref([]);
const driver = ref([]);
definePageMeta({
  layout: "admin",
});

onMounted(() => {
  loadOrderById();
})

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
const loadOrderById = () => {
  $fetch(`get_client_order_by_id/` + 13, {
    method: 'GET',
    baseURL: 'http://192.168.1.69:8080/api/web/v1/',
  }).then(function (res) {
    order.value = res.order;
    driver.value = res.driver;
    orderDetials.value = res.details;
    deliveryLocations.value = res.delivery_address
  });

  

}
</script>

  