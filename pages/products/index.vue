<template>
    <v-row>
        <v-col cols="12" md="4">
            <UiParentCard title="New Products">
                <form role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-file-input v-model="form.fileRecords.$value" density="compact" color="primary" counter
                            label="Product Image" multiple placeholder="Select your files" prepend-icon="mdi-camera"
                            variant="outlined" :show-size="1000" :errors="form.fileRecords.$errors">
                            <template v-slot:selection="{ fileNames }">
                                <template v-for="(fileName, index) in fileNames" :key="fileName">
                                    <v-chip v-if="index < 2" color="primary" label size="small" class="me-2">
                                        {{ fileName }}
                                    </v-chip>

                                    <span v-else-if="index === 2" class="text-overline text-grey-darken-3 mx-2">
                                        +{{ form.fileRecords.$value.length - 2 }} File(s)
                                    </span>
                                </template>
                            </template>
                        </v-file-input>

                        <v-text-field variant="outlined" density="compact" label="Product" v-model="form.productName.$value"
                            @blur="form.productName.$validate()" color="primary"
                            :error-messages="form.productName.$errors"></v-text-field>

                        <v-select label="Category" variant="outlined" density="compact" v-model="selectedCategory"
                            color="primary" :items="categories" item-title="Title" item-value="ID"></v-select>

                        <v-select label="Is Gas" v-model="IsGas" :items="productType" variant="outlined" density="compact"
                            color="primary" item-title="label" item-value="value"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Product In KG"
                            v-model="form.productKg.$value" @blur="form.productKg.$validate()" color="primary"
                            :error-messages="form.productKg.$errors"></v-text-field>


                        <v-text-field variant="outlined" density="compact" label="Price" v-model="form.productPrice.$value"
                            @blur="form.productPrice.$validate()" color="primary"
                            :error-messages="form.productPrice.$errors"></v-text-field>

                        <v-textarea variant="outlined" :error-messages="form.productDesc.$errors" density="compact"
                            label="Description" v-model="form.productDesc.$value" @blur="form.productDesc.$validate()"
                            color="primary"></v-textarea>


                        <v-btn @click.prevent="saveData" :disabled="loading" class="my-4" color="primary" size="large" block
                            flat>{{
                                loading ? 'Creating Item...' : 'Create Product' }}</v-btn>

                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" md="8">
            <UiParentCard title="List Products">
                <v-card-text>
                    <v-row class="mb-4">
                        <v-col cols="12" md="8">
                            <v-text-field v-model="search" :loading="loading" variant="tonal" density="compact"
                                label="Search for Order ID, customer, order status, or something"
                                prepend-inner-icon="mdi-magnify" single-line hide-details
                                >

                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-btn prepend-icon="mdi-vuetify" color="primary" class="mx-2" variant="tonal">
                                Filters
                            </v-btn>
                            <v-btn prepend-icon="mdi-export" color="success" class="mx-2" variant="tonal">
                                Export
                            </v-btn>

                        </v-col>
                    </v-row>
                    <ClientOnly>
                        <EasyDataTable empty-message="No Product found" :search-value="search" theme-color="#f97316"
                            table-class-name="eztable" :headers="headers" :items="products" :loading="loading" >
                            <template #item-ProductPhoto="item">
                                <v-img :src="API_URL + item.ProductPhoto" height="100%" class="rounded-lg"></v-img>
                            </template>
                            <template #item-actions="item">

                                <div>
                                    <v-btn density="compact" variant="tonal" color="primary" class="mx-1" icon="mdi-pencil">

                                    </v-btn>
                                    <v-btn density="compact" variant="tonal" color="error" class="mx-1" icon="mdi-delete">

                                    </v-btn>
                                </div>
                            </template>
                        </EasyDataTable>
                    </ClientOnly>
                </v-card-text>

            </UiParentCard>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Field, useValidation } from "vue3-form-validation";
import { Header } from "vue3-easy-data-table"
import { rules } from "~/utils/rules";
import { useHttpRequest } from '~~/composables/useHttpRequest';
import UiParentCard from '@/components/shared/UiParentCard.vue';
const config = useRuntimeConfig()
definePageMeta({
    layout: "admin",
});
let token: string | null
let logger = ref('')
if (process.client) {
    token = localStorage.getItem("token")
    logger.value = JSON.parse(localStorage.getItem("logger"))
}
const selectedCategory = ref('')
const productType = [
    { label: 'Yes', value: '1' },
    { label: 'No', value: '0' }
]
const http = useHttpRequest()
const instance = getCurrentInstance();
const API_URL = config.public.apiUrl;
interface FormData {
    productName: Field<string>;
    productPrice: Field<string>;
    productKg: Field<string>;
    productDesc: Field<string>;
    fileRecords: Field<File[]>;
    gas: Field<boolean>;
}

const {
    form,
    submitting,
    validating,
    errors,
    hasError,
    validateFields,
    resetFields,
} = useValidation<FormData>({
    productName: {
        $value: "",
        $rules: [rules.required("Please name must be provided")],
    },
    productPrice: {
        $value: "",
        $rules: [rules.min(2)("Password has to be longer than 2 characters")],
    },
    productKg: {
        $value: "",
        $rules: [rules.min(1)("If Product is gas, Kg must br provided")],
    },
    productDesc: {
        $value: "",
        $rules: [rules.min(30)("Product description is requireed more than 30 characters")],
    },
    fileRecords: {
        $value: [],
        $rules: [rules.min(2)("Photo must be provided")],
    },
    gas: {
        $value: false
    },
});
const loading = ref(false);
const products = ref([]);
const categories = ref([]);
const search = ref("");
const IsGas = ref('')

function getProducts() {
    loading.value = true
    http.fetch("products")
        .then((data: any) => {
            if (data.status == 200) {
                products.value = data.records;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}
onMounted(() => {
    getProducts();
    getCategories();
});
async function handleSubmit() {
    try {
        const formData = await validateFields();

    } catch (e) {
        // toast.add({
        //   severity: "error",
        //   summary: "Login error",
        //   detail: e,
        //   life: 3000,
        //   group: "login",
        // });
    }
}

function deleteProduct(status: number) {
    if (status < 0) {
        return;
    }
    http.fetch("delete_products", {
        method: "delete",
        headers: { Authorization: token },
        body: {
            id: status,
        },
    }).then(async (data: any) => {
        if (data.status == 200) {
            console.log('====================================');
            console.log("DATA HETE");
            console.log('====================================');;
        }
    })
        .catch((error) => {
            console.log(error);
        })
        .finally();
}


const headers: Header[] = [
    { text: "Photo", value: "ProductPhoto", sortable: true },
    { text: "Product", value: "ProductName", sortable: true },
    { text: "Category", value: "ProductCategory", sortable: true },
    { text: "Price", value: "PriceBuying", sortable: true },
    { text: "Type", value: "IsGas", sortable: true },
    { text: "ProductRate", value: "ProductRate", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
]

async function saveData() {

    let formData = new FormData()
    formData.append("file", form.fileRecords.$value[0])
    formData.append("product_name", form.productName.$value)
    formData.append("product_category", selectedCategory.value)
    formData.append("product_description", form.productDesc.$value)
    formData.append("quantity_kg", form.productKg.$value)
    formData.append("shop_id", logger.value.ID)
    formData.append("price_buying", form.productPrice.$value)
    formData.append("product_rate", "0.0")
    formData.append("is_gas", IsGas.value)
    fetch(API_URL + 'create_product', {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            Authorization: 'Bearer ' + token,
            "Content-Type": "form-data"
        },
        body: formData
    }).then((res: any) => {

        console.log(res.message);
        
        if (res.status == 200) {
            useToast().success(res.message);
            getProducts();
        }
    }).catch((error) => {
            console.log(error);
    }).finally();


}

function getCategories() {
    http.fetch("categories")
        .then((data: any) => {
            if (data.status == 200) {
                categories.value = data.records;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

</script>

