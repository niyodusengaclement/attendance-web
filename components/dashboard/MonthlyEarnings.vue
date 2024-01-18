<script setup lang="ts">
import { ref } from "vue";
import { computed } from "vue";
import { TrendingUpIcon } from "vue-tabler-icons";
import { useTheme } from "vuetify";
const theme = useTheme();
const primary = theme.current.value.colors.accent;
const secondary = theme.current.value.colors.secondary;
const success = theme.current.value.colors.success;
const info = theme.current.value.colors.info;
const props = defineProps({
  title: String,
  amount: String,
  rate: String,
  subtitle: String,
  color: String,
  data: Array,
  icon: Object,
  label: Array
})
/* Chart */
const getColor = () => {
  if (props.color == 'primary') {
    return primary
  } else if (props.color == 'secondary') {
    return secondary
  } else if (props.color == 'success') {
    return success
  } else {
    return info
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
      <div class="flex justify-between align-center">
        <div class="flex">
          <div class="w-1 rounded-lg h-12" :class="'bg-' + color"> </div>
          <div class="flex justify-left px-3 flex-col">
            <div :class="'text-' + color" class="items-center text-sm mx-3  pb-2 font-weight-bold">
              {{ title }}
            </div>
            <div class="mx-3">
              <h3 class="text-h3">{{ amount }}</h3>
            </div>

          </div>

        </div>
        <v-card rounded="lg" height="50" width="50" elevation="0"
          class="d-flex pa-2 bg-grey100 justify-center align-center ">
          <component :is="icon" size="30" :color="color" stroke-width="1.5" :class="'text-' + color"></component>
        </v-card>


      </div>

      <v-row>
        <v-col cols="12">
          <div class="mt-2 space-x-4  d-flex">
            <div class="mt-2 px-0 d-flex items-center">
              <div>
                <TrendingUpIcon :class="'text-' + color" size="15" />
              </div>

              <div class="text-sm font-medium ml-2" :class="'text-' + color">{{ rate }}%</div>
            </div>
            <div class="text-xs text-subtitle-1  mt-2 text-muted">
              {{ subtitle }}
            </div>
          </div>

        </v-col>
      </v-row>

    </v-card-item>

  </v-card>
</template>
<style scoped>
.v-card-item {
  padding: 24 20;
}
</style>
