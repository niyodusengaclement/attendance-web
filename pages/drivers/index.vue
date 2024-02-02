<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header, Item } from "vue3-easy-data-table"
import { Field, useValidation } from 'vue3-form-validation';

definePageMeta({
    layout: "admin",
});
const http = useHttpRequest()
const instance = getCurrentInstance();
const search = ref("");
const loading = ref(false);
const isEditing = ref(false);
const isDeleting = ref(false);
const lists = ref([]);

interface FormData {
    names: Field<string>;
    phone: Field<string>;
    type: Field<string>;
    vehicleId: Field<string>;
    vehicleOwner: Field<string>;
    ownerPhone: Field<string>;
}

const { form, validateFields, resetFields } = useValidation<FormData>({
    names: {
        $value: "",
        $rules: [rules.required("Please name must be provided")],
    },
    phone: {
        $value: "",
        $rules: [rules.required("Please name must be provided")],
    },
    type: {
        $value: "",
        $rules: [rules.required("Please type must be choosed")],
    },
    vehicleId: {
        $value: "",
        $rules: [rules.required("Please type must be choosed")],
    },
    vehicleOwner: {
        $value: "",
        $rules: [rules.required("Please type must be choosed")],
    },
    ownerPhone: {
        $value: "",
        $rules: [rules.required("Please type must be choosed")],
    },
});

const headers: Header[] = [
    { text: "ID", value: "id", sortable: true },
    { text: "Names", value: "names", sortable: true },
    { text: "Phone", value: "phone", sortable: true },
    { text: "Status", value: "type", sortable: true },
    { text: "Code", value: "code", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
]
const state = ref(1);
const vehicleType = [
    { text: "Bike", value: "1" },
    { text: "Motorbike", value: "2" },
    { text: "Car", value: "3" },
];

async function createDriver() {
    loading.value = true;
    var formData = await validateFields()
    http
        .fetch("create_driver", {
            method: "post",
            body: {
                names: formData.names ,
                phone: formData.phone,
                type: formData.type, 
                vehicleId: formData.vehicleId,
                vehicleOwner: formData.vehicleOwner,
                ownerPhone: formData.ownerPhone,
            },
        })
        .then((data: any) => {
            useToast().success(data.message);
            loadAllDrivers();
        })
        .catch((data: any) => {
            useToast().error(data.data.message);
            console.log(data);
        })
        .finally(() => {
            loading.value = false;
            state.value = 1;

        });
}


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
function changeDriverStatus(status: any, id: string) {
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
        return "Active";
    } else {
        return "Blocked";
    }
}

const statusClr = (status: string) => {
    if (status == "1") {
        return "success";
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
        <!-- ADD NEW RECORD -->
        <v-col cols="12" v-show="state == 2" md="4">
            <UiParentCard :title="'Create Driver'" class="text-success">

                <form ref="myForm" role="form" @submit.prevent="createDriver">
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Name" v-model="form.names.$value"
                            @blur="form.names.$validate()" color="primary"
                            :error-messages="form.names.$errors"></v-text-field>
                        <v-text-field variant="outlined" density="compact" label="Phone" v-model="form.phone.$value"
                            @blur="form.phone.$validate()" color="primary"
                            :error-messages="form.phone.$errors"></v-text-field>
                        <label for="" class="mb-5">Vehicle Information</label>
                        <v-select label="Select Vehicle Type" v-model="form.type.$value" :items="vehicleType"
                            variant="outlined" @blur="form.type.$validate()" density="compact" color="primary"
                            item-title="text" :error-messages="form.type.$errors" item-value="value"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Plate Nummber" v-if="form.type.$value !== '1'" v-model="form.vehicleId.$value"
                            @blur="form.vehicleId.$validate()" color="primary"
                            :error-messages="form.vehicleId.$errors"></v-text-field>

                        <v-text-field variant="outlined" density="compact" label="Vehicle owner" v-model="form.vehicleOwner.$value"
                            @blur="form.vehicleOwner.$validate()" color="primary"
                            :error-messages="form.vehicleOwner.$errors"></v-text-field>

                        <v-text-field variant="outlined" density="compact" label="Phone number/owner" v-model="form.ownerPhone.$value"
                            @blur="form.ownerPhone.$validate()" color="primary"
                            :error-messages="form.ownerPhone.$errors"></v-text-field>

                        <v-btn :disabled="loading" :loading="loading" @click="createDriver()" class="my-2" color="primary"
                            size="large" block flat>Save Driver</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" :md="state == 1 ? '12' : '8'">
            <UiParentCard parent-title="Dashboard" title="Drivers">
                <v-row class=" flex mb-4 justify-between">
                    <v-col cols="12" md="8">
                        <v-text-field v-model="search" :loading="loading" variant="outlined" density="compact"
                            label="Search for Title or Something" prepend-inner-icon="mdi-magnify" single-line hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col class="flex justify-end" cols="12" md="4">
                        <v-btn prepend-icon="mdi-vuetify" color="primary" class="mx-2" variant="outlined">
                            Filters
                        </v-btn>
                        <v-btn prepend-icon="mdi-plus" @click="state = 2" color="success" class="mx-2" variant="tonal">
                            Add New Driver
                        </v-btn>
                    </v-col>
                </v-row>
                <ClientOnly>
                    <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
                        table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading" :items="lists">
                        <template #item-type="item">
                            <v-chip size="small" :color="statusClr(item.status)"> {{ statusStr(item.status) }} </v-chip>
                        </template>
                        <template #item-actions="item">
                            <div class="flex justify-between space-x-3">
                                <v-btn variant="outlined" size="small" color="error" v-if="item.status == '1'"
                                    @click="changeDriverStatus(0, item.id)"><v-icon>mdi-close</v-icon> Block</v-btn>
                                <v-btn variant="outlined" size="small" color="success" v-else
                                    @click="changeDriverStatus(1, item.id)"> <v-icon>mdi-check</v-icon> Enable</v-btn>
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
