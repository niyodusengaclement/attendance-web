<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header } from "vue3-easy-data-table"

definePageMeta({
    layout: "admin",
});
const http = useHttpRequest()
const instance = getCurrentInstance();
const search = ref("");
const loading = ref(false);
const lists = ref([]);
const headers: Header[] = [
    { text: "ID", value: "id", sortable: true },
    { text: "Names", value: "names", sortable: true },
    { text: "Phone", value: "phone", sortable: true },
    { text: "Type", value: "type", sortable: true },
    { text: "PLate", value: "plate_number", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
]


function loadAllDrivers() {
    loading.value = true
    http.fetch("get_all_drivers")
        .then((data: any) => {
            if (data.status == 200) {
                lists.value = data.drivers;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}
function changeDriverStatus(status: any, id: string) 
{
    const formData = new FormData()
    formData.append("id", id)
    formData.append("status", status)
    http.fetch("changeDriverStatus", {
        method: "post",
        body: formData
    })
        .then((data) => {
            useToast().success(data.message);
            loadAllDrivers()
        })
        .catch(data => {
            useToast().error(data.data.message);

        })
}

const statusStr = (status: string) => {
    if (status == "1") {
        return "Approved";
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
onMounted(() => {
    loadAllDrivers();
})

</script>
<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard parent-title="Dashboard" title="Drivers">
                <ClientOnly>
                    <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
                        table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading" :items="lists">
                        <template #item-type="item">
                            <v-chip size="small" :color="statusClr(item.type)"> {{ statusStr(item.type) }} </v-chip>
                        </template>
                        <template #item-actions="item">
                            <div class="flex justify-between space-x-3">
                                <v-btn variant="outlined" size="small" color="error" v-if="item.status == '1'" @click="changeDriverStatus(0,item.id)"><v-icon>mdi-close</v-icon> Block</v-btn>
                                <v-btn variant="outlined" size="small" color="success" v-else @click="changeDriverStatus(1,item.id)"> <v-icon>mdi-check</v-icon> Enable</v-btn>
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
</template>
