<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header } from "vue3-easy-data-table"

definePageMeta({
    layout: "admin",
});
const instance = getCurrentInstance();
const http = useHttpRequest()
const search = ref("");
const lists = ref([]);
const showForm = ref(false)
const title = ref("")
const loading = ref(false)
const headers: Header[] = [
    { text: "ID", value: "id", sortable: true },
    { text: "Shop name", value: "shop_name", sortable: true },
    { text: "Phone Number", value: "phone", sortable: true },
    { text: "Email Address", value: "email", sortable: true },
    { text: "Zone", value: "title", sortable: true },
    { text: "Status", value: "Status", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
]
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

function createShop() {
    loading.value = true
    const formData = new FormData()
    formData.append("title", title.value)
    http.fetch("createShop", {
        method: 'post',
        body: formData
    })
        .then((data) => {
            useToast().success(data.message);
            showForm.value = false
            getAllShops()
        })
        .catch(data => {
            useToast().error(data.data.message);

        })
        .finally(() => {
            loading.value = false
        })
}

function getAllShops() {
    loading.value = true
    http.fetch("get_all_Shops")
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

function changeShopStatus(status: any, id: string) 
{
    const formData = new FormData()
    formData.append("id", id)
    formData.append("status", status)
    http.fetch("changeShopStatus", {
        method: "post",
        body: formData
    })
        .then((data) => {
            useToast().success(data.message);
            getAllShops()
        })
        .catch(data => {
            useToast().error(data.data.message);

        })
}

onMounted(() => {
    getAllShops()
})

</script>
<template>
    <v-row>
        <v-col cols="12" v-if="showForm" md="4" lg="4">
            <UiParentCard :title="'Add New Shop'" class="text-success">
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Shop Name" v-model="title"
                            color="primary"></v-text-field>

                        <v-btn :disabled="loading" :loading="loading" @click="createShop()" class="my-2" color="primary"
                            size="large" block flat>Save Shops</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col>
            <UiParentCard parent-title="Dashboard" title="Shops">
                <v-row class="mb-4">
                    <v-col cols="12" md="8">
                        <v-text-field v-model="search" variant="outlined" density="compact" label="Search for Title"
                            prepend-inner-icon="mdi-magnify" single-line hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col class="flex" cols="12" md="2">
                        <v-btn prepend-icon="mdi-plus" @click="showForm = true" color="success" class="mx-2"
                            variant="tonal">
                            Add New
                        </v-btn>
                    </v-col>
                    <v-col class="flex" cols="12" md="2">
                        <v-badge color="error" content="0">
                            <v-btn prepend-icon="mdi-plus" @click="showForm = true" color="primary" class="mx-2" to="">
                                Requests
                            </v-btn>
                        </v-badge>
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
                                    @click="changeShopStatus(0,item.id)"> <v-icon>mdi-close</v-icon> Close</v-btn>
                                <v-btn variant="outlined" size="small" color="success" v-else @click="changeShopStatus(1,item.id)">
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
</template>
