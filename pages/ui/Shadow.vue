<script setup lang="ts">
import Shadow from "@/components/style-components/shadow/Shadow.vue";
import { GoogleMap, InfoWindow, Polyline, Marker, MarkerCluster, CustomMarker } from "vue3-google-map";

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
</script>

<template>
  <v-row>
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
</template> 
