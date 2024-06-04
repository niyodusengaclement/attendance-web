<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header } from "vue3-easy-data-table"

definePageMeta({
    layout: "admin",
});
const http = useHttpRequest()
const config = useRuntimeConfig()
const token = localStorage.getItem("token")
const search = ref("");
const lists = ref([]);
const showForm = ref(false)
const loading = ref(false)
const btnLoading = ref(false)
const menu = ref(false)
const isSending = ref(false)
const headers: Header[] = [
    { text: "Name", value: "names", sortable: true },
    { text: "District", value: "district", sortable: true },
    { text: "SFID", value: "sfid", sortable: true },
    { text: "Zone", value: "sector", sortable: true },
    { text: "Date", value: "event_date", sortable: true },
    // { text: "Status", value: "status", width: 120 },
]
const user:any = JSON.parse(localStorage.getItem("logger"))

const startDate = ref(new Date());
const formattedStartDate = ref(
  `${startDate.value.getFullYear()}-${(startDate.value.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${startDate.value
    .getDate()
    .toString()
    .padStart(2, "0")}`
);

watch(startDate, () => {
  formattedStartDate.value = `${startDate.value.getFullYear()}-${(
    startDate.value.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${startDate.value.getDate().toString().padStart(2, "0")}`;
});

const allowedDates = ref([])

function getAttendanceDates() {
    http.fetch("getAttendanceDates")
        .then(res => {
            allowedDates.value = res
        })
        .catch(err => {
            console.log(err.data.message);
        })
}
const statusStr = (status: string) => {
    if (status == "1") {
        return "Active";
    } else {
        return "Locked";
    }
}

const statusClr = (status: string) => {
    if (status == "1") {
        return "success";
    } else {
        return "error";
    }
}

function allAttendees() {
    loading.value = true
    http.fetch("getAttendance/0", {
        method: "post",
        body: {
            date: formattedStartDate.value
        }
    })
        .then(res => {
            lists.value = res
        })
        .catch(err => {
            useToast().error(err.data.message);
            console.log(err.data.message);
        })
        .finally(() => {
            loading.value = false
            menu.value = false
        })
}
function callCreateAttandance() {
    btnLoading.value = true
    http.fetch("createAttendance")
        .then(res => {
            useToast().success(res.message);
            isSending.value = false
        })
        .catch(err => {
            useToast().error(err.data.message);
        })
        .finally(() => {
            btnLoading.value = false
        })
}


onMounted(() => {
    allAttendees()
    getAttendanceDates()
})
const download = computed(() => {
    return config.public.apiUrl + "getAttendance/1/0/" + token
})

</script>
<template>
    <v-row> 
        <v-col>
            <UiParentCard parent-title="Dashboard" title="Attendance List">
                <v-row class="mb-4">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="search" variant="outlined" density="compact" label="Search..."
                            prepend-inner-icon="mdi-magnify" single-line hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col class="flex" cols="12" md="2">
                        <form :action="download" method="post" target="_blank">
                            <input type="hidden" v-model="formattedStartDate">
                            <v-btn prepend-icon="mdi-microsoft-excel" color="success" class="mx-2" 
                                type="submit">
                                Export
                            </v-btn>
                        </form>
                    </v-col>
                    <v-col class="flex" cols="12" md="2">
                        <v-btn prepend-icon="mdi-plus" @click="isSending = true" color="primary" class="mx-2"
                            variant="tonal">
                            New Attendance
                        </v-btn>
                    </v-col>
                    <v-col class="flex" cols="12" md="2">
                        <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
                            <template v-slot:activator="{ props }">
                                <v-btn color="secondary" block v-bind="props">
                                    {{ `Date: ${formattedStartDate}` }}
                                </v-btn>
                            </template>
                            <v-card min-width="300">
                                <v-date-picker v-model="startDate" hide-header show-adjacent-months></v-date-picker>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" variant="text" @click="menu = false">
                                        Close
                                    </v-btn>
                                    <v-btn color="success" variant="outline" :loading="loading" @click="allAttendees()">
                                        filter
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-menu>
                    </v-col>
                </v-row>
                <ClientOnly>
                    <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
                        table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading"
                        :items="lists">
                        <template #item-status="item">
                            <v-chip size="small" :color="statusClr(item.status)"> {{ statusStr(item.status) }} </v-chip>
                        </template>
                        <template #empty-message>
                            <div class="d-flex justify-center align-center py-3">
                                <v-img src="/images/products/not_found.png" height="150"></v-img>
                            </div>
                            <p class="text-muted font-weight-light"> No Found</p>
                        </template>
                    </EasyDataTable>
                </ClientOnly>
                <v-dialog v-model="isSending" persistent width="400">
                    <v-card>
                        <v-card-title class="text-h5"> Mew Attendance </v-card-title>
                        <v-card-text>
                            <div class="text-lg text-start justify-start">
                                You are about to create new attendance and this will send emails to all district users
                            </div>
                        </v-card-text>
                        <v-card-actions class="mt-5">
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="outlined" class="mx-1" prepend-icon="mdi-close"
                                @click="isSending = false">
                                Cancel
                            </v-btn>
                            <v-btn :loading="btnLoading" elevation="10" variant="outlined" color="success" class="mx-1"
                                prepend-icon="mdi-delete" @click="callCreateAttandance()">
                                Create & send Email
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
