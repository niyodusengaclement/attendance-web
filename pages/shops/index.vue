<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header } from "vue3-easy-data-table"
import { Field, useValidation } from "vue3-form-validation";
import { rules } from "~/utils/rules";

definePageMeta({
    layout: "admin",
});
const instance = getCurrentInstance();
const http = useHttpRequest()
const search = ref("");
const lists = ref([]);
const showForm = ref(false)
const title = ref("")
const pendindRequest = ref(0)
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
const latitude = ref("")
const longitude = ref("")
const user = JSON.parse(localStorage.getItem("logger"))
const showDialog = ref(false);
const editingItem = reactive({
    title: "",
    id: 0,
});

const closeShop = (val: Item) => {
    showDialog.value = true;
    editingItem.title = val.shop_name;
    editingItem.id = val.id;
};
interface FormData {
    email: Field<string>;
    password: Field<string>;
    phone: Field<string>;
    name: Field<string>;
    tin: Field<string>;
    zone: Field<string>;
}
const {
    form,
    validateFields,
    resetFields
} = useValidation<FormData>({
    email: {
        $value: "",
        $rules: [rules.email("Please enter a valid email address")],
    },
    password: {
        $value: "",
        $rules: [rules.min(6)("Password has to be longer than 6 characters")],
    },
    phone: {
        $value: "",
        $rules: [rules.min(10)("Phone number has to be longer than 10 characters")],
    },
    name: {
        $value: "",
        $rules: [rules.min(3)("Shop name has to be longer than 2 characters")],
    },
    tin: {
        $value: "",
        $rules: [rules.min(5)("TIN Number has to be longer than 5 characters")],
    },
    zone: {
        $value: "",
        $rules: [rules.min(1)("Zone is required")],
    },
});
const zones = ref([])
const show = ref(false)
function toggle(value: boolean) {
    show.value = value
}
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
function reset() {
    resetFields()
    showForm.value = false
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

function changeShopStatus(status: any, id: string) {
    loading.value = true
    const formData = new FormData()
    formData.append("id", id)
    formData.append("status", status)
    http.fetch("changeShopStatus", {
        method: "post",
        body: {
            "id": id,
            "status": status
        }
    })
        .then((data) => {
            useToast().success(data.message);
            showDialog.value = false;
            editingItem.title = "";
            editingItem.id = 0
            getAllShops()
        })
        .catch(data => {
            useToast().error(data.data.message);
        })
        .finally(() => {
            loading.value = false
        })
}

async function handleSubmit() {
    try {
        const data = await validateFields();

        if (longitude.value === '' || latitude.value === '') {
            useToast().error("Your location is not captured, check if you enabled location or refresh the page")
            return
        }

        const formData = new FormData()

        formData.append("email", data.email)
        formData.append("password", data.password)
        formData.append("phone", data.phone)
        formData.append("name", data.name)
        formData.append("tin", data.tin)
        formData.append("zone", data.zone)
        formData.append("latitude", latitude.value)
        formData.append("longitude", longitude.value)

        http.fetch("createShopAdmin", {
            method: "post",
            body: formData
        })
            .then(res => {
                useToast().success(res.message)
                showForm.value = false
                getAllShops()
            })
            .catch(err => {
                useToast().error(err.data.message)
            })
    } catch (e) {

    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function handleSuccess(position: any) {
    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;
}

function handleError(error: any) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
        default:
            console.error("An unknown error occurred while getting location.");
            break;
    }
}
function getZones() {
    http.fetch("getZonesForForm")
        .then(res => {
            zones.value = res
        })
}

function getTotalPendingRequests()
{
    http.fetch("getTotalPendingRequests")
    .then(res => {
        pendindRequest.value = parseInt(res.number)
    })
}
onMounted(() => {
    getAllShops()
    getTotalPendingRequests()
})

</script>
<template>
    <v-row>
        <v-col cols="12" v-if="showForm && parseInt(user.category) <= 2" md="4" lg="4">
            <UiParentCard :title="'Add New Shop'" class="text-success">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="tonal" elevation="0" @click="reset()">
                </v-btn>
                <v-card-subtitle>Fill this form to register shop</v-card-subtitle>
                <form @submit.prevent="handleSubmit">
                    <div class="flex flex-col my-7 group">
                        <!-- <label for="name" class="text-gray-700 text-sm  group-focus:text-orange-400">Shop name
                        </label> -->
                        <input type="name" name="name" id="name" v-model="form.name.$value" @blur="form.name.$validate()"
                            class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                            placeholder="Enter your Shop name">
                        <FormErrors :errors="form.name.$errors" class="p-error" />
                    </div>
                    <div class="flex flex-col my-7 group">
                        <!-- <label for="phone" class="text-gray-700 text-sm  group-focus:text-orange-400">Shop
                            default phone numbmer
                        </label> -->
                        <input type="phone" name="phone" id="phone" v-model="form.phone.$value"
                            @blur="form.phone.$validate()"
                            class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                            placeholder="Enter your Shop default phone numbmer">
                        <FormErrors :errors="form.phone.$errors" class="p-error" />
                    </div>
                    <div class="flex flex-col my-7 group">
                        <!-- <label for="email" class="text-gray-700 text-sm  group-focus:text-orange-400">Shop
                            default Email Address
                        </label> -->
                        <input type="email" name="email" id="email" v-model="form.email.$value"
                            @blur="form.email.$validate()"
                            class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                            placeholder="Enter your Shop default Email Address">
                        <FormErrors :errors="form.email.$errors" class="p-error" />
                    </div>
                    <div class="flex flex-col my-7 group">
                        <!-- <label for="tin" class="text-gray-700 text-sm  group-focus:text-orange-400">Tin Number
                        </label> -->
                        <input type="tin" name="tin" id="tin" v-model="form.tin.$value" @blur="form.tin.$validate()"
                            class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                            placeholder="Enter your Tin Number">
                        <FormErrors :errors="form.tin.$errors" class="p-error" />
                    </div>
                    <div class="flex flex-col my-7 group">
                        <v-select :items="zones" v-model="form.zone.$value" variant="outlined" density="compact"
                            @blur="form.zone.$validate()" :error-messages="form.zone.$errors" label="Choose Zone"
                            color="primary" item-title="text" item-value="value"></v-select>
                    </div>

                    <div class="flex flex-col my-7">
                        <!-- <label for="password" class="text-gray-700 text-sm">Password</label> -->
                        <div x-data="{ show: true }" class="relative flex items-center mt-2">
                            <input :type="show ? 'text' : 'password'" name="password" id="password"
                                v-model="form.password.$value" @blur="form.password.$validate()"
                                class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                placeholder="Enter your password">
                            <div
                                class="absolute right-2 bg-transparent cursor-pointer flex items-center justify-center text-gray-700">
                                <EyeIcon @click="toggle(true)" size="18" class="text-gray-400"
                                    :class="show ? 'hidden' : ''" />
                                <EyeOffIcon @click="toggle(false)" size="18" class="text-gray-400"
                                    :class="!show ? 'hidden' : ''" />
                            </div>

                        </div>
                        <FormErrors :errors="form.password.$errors" class="p-error" />

                    </div>



                    <div class="my-4 flex items-center justify-end space-x-4">
                        <v-btn @click.prevent="handleSubmit" :disabled="loading" :loading="loading" rounded="xl"
                            color="primary" size="large" block flat>
                            Register</v-btn>

                    </div>
                </form>
            </UiParentCard>
        </v-col>
        <v-col>
            <UiParentCard parent-title="Dashboard" title="Shops">
                <v-row class="mb-4">
                    <v-col cols="12" md="6">
                        <v-text-field v-model="search" variant="outlined" density="compact" label="Search for Title"
                            prepend-inner-icon="mdi-magnify" single-line hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col class="flex" cols="12" md="2" v-if="parseInt(user.category) <= 2">
                        <v-btn prepend-icon="mdi-plus" @click="showForm = true; getZones();getLocation()" :disabled="showForm" color="success" class="mx-2"
                            variant="tonal">
                            Add New
                        </v-btn>
                    </v-col>
                    <v-col class="flex" cols="12" md="2" v-if="user.category === '1'">
                        <v-badge color="error" :content="pendindRequest" inline>
                            <v-btn :disabled="pendindRequest === 0" color="primary" class="mx-2" to="/shops/request">
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
                                    @click="closeShop(item)"> <v-icon>mdi-close</v-icon> Close</v-btn>
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
            <v-dialog v-model="showDialog" persistent width="auto">
                <v-card>
                    <v-card-title class="text-h5"> Close Shop </v-card-title>
                    <v-card-text>
                        <div class="text-lg text-center justify-center">
                            Are you want to Close this shop:
                            <span class="font-bold"> {{ editingItem.title }} </span>
                            ?
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="text" class="mx-1" prepend-icon="mdi-close"
                            @click="showDialog = false">
                            Cancel
                        </v-btn>
                        <v-btn :loading="loading" elevation="10" variant="outlined" color="error" class="mx-1"
                            prepend-icon="mdi-delete" @click="changeShopStatus(0, `${editingItem.id}`)">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>
