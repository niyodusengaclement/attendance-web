<script setup lang="ts">
import { ref } from "vue";
import { computed } from "vue";
import { TrendingUpIcon } from "vue-tabler-icons";
import { useTheme } from "vuetify";
const theme = useTheme();
const primary = theme.current.value.colors.warning;
const secondary = theme.current.value.colors.secondary;
const success = theme.current.value.colors.success;
const error = theme.current.value.colors.error;
const props = defineProps({
    title: String,
    amount: String,
    rate: String,
    subtitle: String,
    color: String,
    data: Array,
    label: Array
})
/* Chart */
const getColor = () => {
  if(props.color == 'primary'){
    return primary
  }else if(props.color == 'secondary'){
    return secondary
  }else if(props.color == 'success'){
    return success
  }else{
    return error
  }
}
const areachartOptions = computed(() => {
  return {
    labels: props.label,
    chart: {
      type: "area",
      height: 60,
      fontFamily: `inherit`,
      foreColor: "#a1aab2",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    colors: [getColor()],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
      },
    },
  };
});

const areaChart = {
  series: [
    {
      name: "",
      data: props.data,
    },
  ],
};
</script>
<template>
  <v-card elevation="10" rounded class="withbg">
    <v-card-item>
      <div class="d-flex align-center justify-space-between pt-sm-2">
        <div class="d-flex items-center text-sm text-muted font-weight-bold">
          {{ title }}
          <div class="mx-3">
            <HelpIcon size="15" />
          </div>
        </div>
         <v-btn elevation="0" size="x-small" variant="text" icon >
          <DotsIcon class="text-muted" size="15" />
        </v-btn>
      </div>
      <v-row>
        <v-col cols="12">
          <div class="mt-2 d-flex">
            <h3 class="text-h3">{{ amount }}</h3>
            <div class="mt-2 px-4 d-flex items-center">
              <div>
                <TrendingUpIcon :class="'text-'+color" size="15" />
              </div>
             
               <span class="text-subtitle-1 ml-2" :class="'text-'+color">{{ rate }}%</span>
            </div>
          </div>
          <div class="text-xs text-subtitle-1  mt-2 text-muted">
            {{ subtitle }}
          </div>
        </v-col>
      </v-row>
      <div class="mt-3">
      <apexchart
        type="area"
        height="80"
        class="rounded"
        :options="areachartOptions"
        :series="areaChart.series"
      >
      </apexchart>
    </div>
    </v-card-item>
   
  </v-card>
</template>
<style scoped>
.v-card-item {
  padding: 10px 10px;
}
</style>
