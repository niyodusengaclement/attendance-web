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
const lists = ref([]);
const showForm = ref(false)
const title = ref("")
const loading = ref(false)
const headers: Header[] = [
    { text: "ID", value: "id", sortable: true },
    { text: "Title", value: "title", sortable: true },
    { text: "Status", value: "Status", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
]
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
const handleSubmit = () => {

}

function createZone()
{
    http.fetch("createZone", {
        method: 'post',
        body: {
            title: title.value
        }
    })
    .then((data) => {
        useToast().success(data.message);
    })
    .catch(data => {
        useToast().error(data.data.message);

    })
}

function getAllZones()
{
    http.fetch("get_all_zones")
    .then(res => {
        lists.value = res
    })
    .catch(err => {
        console.log(err.response.message);
        
    })
}

onMounted(() => {
    getAllZones()
})

</script>
<template>
    <v-row>
        <v-col cols="12" v-if="showForm" md="4" lg="4">
            <UiParentCard :title="'Add New Zone'" class="text-success">
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Category"
                            v-model="title" color="primary"></v-text-field>

                        <v-btn :disabled="loading" :loading="loading" @click="createZone()" class="my-2"
                            color="primary" size="large" block flat>Save Zone</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col>
            <UiParentCard parent-title="Dashboard" title="Zones">
                <v-row class="mb-4">
                        <v-col cols="12" md="8">
                            <v-text-field v-model="search" variant="outlined" density="compact"
                                label="Search for Title" prepend-inner-icon="mdi-magnify" single-line
                                hide-details>
                            </v-text-field>
                        </v-col>
                        <v-col class="flex" cols="12" md="4">
                            <v-btn prepend-icon="mdi-plus" @click="showForm = true" color="success" class="mx-2" variant="tonal">
                                Add New
                            </v-btn>
                        </v-col>
                    </v-row>
                <ClientOnly>
                    <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
                        table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading" :items="lists">
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
            </UiParentCard>
        </v-col>
    </v-row>
</template>
