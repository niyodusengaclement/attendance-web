<template>
    <v-row>
        <!-- EDITTING EXISTING RECORD -->
        <v-col cols="12" v-show="state == 3" :md="state == 1 ? 12 : 4">
            <UiParentCard :title="'Editing Record '" class="text-success">
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-img aspect-ratio="1/1" :src="API_URL + editingItem.ProductPhoto" max-height="125"
                            class="bg-grey-lighten-2 border rounded-lg my-5"></v-img>
                        <v-text-field variant="outlined" density="compact" label="Product" v-model="editingItem.ProductName"
                            color="primary"></v-text-field>

                        <v-select label="Category" variant="outlined" density="compact"
                            v-model="editingItem.ProductCategory" color="primary" :items="categories" item-title="Title"
                            item-value="ID"></v-select>

                        <v-select label="Is Gas" v-model="editingItem.IsGas" :items="productType" variant="outlined"
                            density="compact" color="primary" item-title="label" item-value="value"></v-select>

                        <v-text-field variant="outlined" v-show="editingItem.IsGas == '1'" density="compact"
                            label="Product In KG" v-model="editingItem.IsGas" color="primary"></v-text-field>


                        <v-text-field variant="outlined" density="compact" label="Price" v-model="editingItem.PriceBuying"
                            color="primary"></v-text-field>

                        <v-textarea variant="outlined" density="compact" label="Description"
                            v-model="editingItem.ProductDescription" color="primary"></v-textarea>


                        <v-btn @click.prevent="submitEdit" :disabled="loading" class="my-4" color="success" size="large"
                            block flat>{{
                                loading ? 'Updating Item...' : 'Update Product' }}</v-btn>

                    </v-col>
                </form>
            </UiParentCard>
        </v-col>

        <!-- CREATING NEW RECORD -->
        <v-col cols="12" v-show="state == 2" :md="state == 1 ? 12 : 4">
            <UiParentCard title="New Products">
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
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

                        <v-text-field variant="outlined" v-show="IsGas == '1'" density="compact" label="Product In KG"
                            v-model="form.productKg.$value" color="primary"></v-text-field>


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

        <!-- LIST OF RECORTDS -->
        <v-col cols="12" :md="state != 1 ? 8 : 12">
            <UiParentCard title="List Products">
                <v-card-text v-show="isDeleting">
                    <v-alert prominent type="error" icon="mdi-delete" title="Delete" variant="tonal">
                        <v-row align="center">
                            <v-col class="grow" cols="12" md="8">
                                Are you show you want to detele, this item {{ deletingItem.ProductName }}
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="12" md="4" class="shrink">
                                <v-btn size="large" color="error" @click="deleteProduct(deletingItem.ID)" class="mx-3">Delete Product</v-btn>
                                <v-btn size="large"  color="error" @click="isDeleting = false" variant="outlined" class="mx-3">Cancel</v-btn>
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-card-text>
                <v-card-text>

                    <v-row class="mb-4">
                        <v-col cols="12" md="9">
                            <v-text-field v-model="search" :loading="loading" variant="tonal" density="compact"
                                label="Search for Order ID, customer, order status, or something"
                                prepend-inner-icon="mdi-magnify" single-line hide-details>

                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-btn prepend-icon="mdi-plus" color="primary" class="mx-2" variant="tonal"
                                @click="onAddStockData">
                                Add New Product
                            </v-btn>

                        </v-col>
                    </v-row>

                    <ClientOnly>
                        <EasyDataTable empty-message="No Product found" :search-value="search" theme-color="#f97316"
                            table-class-name="eztable" :headers="headers" :items="products" :loading="loading">
                            <template #item-ProductPhoto="item">
                                <v-img :src="API_URL + item.ProductPhoto" height="50" width="50" class="rounded-lg"></v-img>
                            </template>
                            <template #item-actions="item">

                                <div>
                                    <v-btn size="large" density="compact" variant="tonal" color="primary" class="mx-1"
                                        icon="mdi-pencil" @click="editItem(item)">

                                    </v-btn>
                                    <v-btn size="large" density="compact" variant="tonal" color="error"
                                        @click="deleteItem(item)" class="mx-1" icon="mdi-delete">

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
import { Header, Item } from "vue3-easy-data-table"
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
const state = ref(1)
const selectedCategory = ref('')
const productType = [
    { label: 'Yes', value: '1' },
    { label: 'No', value: '0' }
]
let formData = new FormData()
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

const loading = ref(false);
const products = ref([]);
const categories = ref([]);
const search = ref("");
const IsGas = ref('')
const isEditing = ref(false);
const isDeleting = ref(false);

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


function getProducts() {
    loading.value = true
    http.fetch("products")
        .then((data: any) => {
            if (data.status == 200) {
                products.value = data.product_records;
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
        useToast().error("Error " + e);
    }
}

function deleteProduct(status: string) {
    console.log(status);

    http.fetch("delete_products/" + status, {
        method: "DELETE",
        headers: { Authorization: token },
        body: {
            id: status,
        },
    }).then((data: any) => {
        if (data.status == 200) {
            useToast().success(data.message);
            getProducts();
        }
    }).catch((error) => {
        console.log(error);
    }).finally();
}


const headers: Header[] = [
    { text: "Photo", value: "ProductPhoto", sortable: true },
    { text: "Product", value: "ProductName", sortable: true },
    { text: "Category", value: "Category", sortable: true },
    { text: "Price", value: "PriceBuying", sortable: true },
    { text: "Type", value: "IsGas", sortable: true },
    { text: "ProductRate", value: "ProductRate", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
]

async function saveData() {
    formData.append("file", form.fileRecords.$value[0])
    formData.append("product_name", form.productName.$value)
    formData.append("product_category", selectedCategory.value)
    formData.append("product_description", form.productDesc.$value)
    formData.append("quantity_kg", form.productKg.$value)
    formData.append("shop_id", logger.value.ID)
    formData.append("price_buying", form.productPrice.$value)
    formData.append("product_rate", "0.0")
    formData.append("is_gas", IsGas.value)
    http.fetch('create_product', {
        method: "POST",
        headers: {
            Authorization: 'Bearer ' + token,
            "Content-Type": "form-data"
        },
        body: formData
    }).then((res: any) => {
        if (res.status == 200) {
            useToast().success(res.message);
            getProducts();
        }
    }).catch((error) => {
        console.log(error);
    }).finally(
    );

}

function getCategories() {
    http.fetch("categories")
        .then((data: any) => {
            if (data.status == 200) {
                categories.value = data.category_records;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

const onAddStockData = () => {
    state.value = 2;
    getCategories();
    console.log("State = " + state.value);
}

//Editing 

const editingItem = reactive({
    ProductPhoto: "",
    ProductName: "",
    ProductCategory: "",
    ProductDescription: "",
    PriceBuying: "",
    IsGas: "",
    ProductRate: "",
    ID: 0,
});
const deletingItem = reactive({
    ProductName: "",
    ID: 0,
});
const deleteItem = (val: Item) => {
    isDeleting.value = true;
    const {ProductName ,ID } = val;
    deletingItem.ProductName = ProductName;
    deletingItem.ID = ID;
};

const editItem = (val: Item) => {
    isEditing.value = true;
    state.value = 3
    const { ProductPhoto, ProductName, ProductCategory, ProductDescription, PriceBuying, IsGas, ProductRate, ID } = val;
    editingItem.ProductPhoto = ProductPhoto;
    editingItem.ProductName = ProductName;
    editingItem.ProductCategory = ProductCategory;
    editingItem.ProductDescription = ProductDescription;
    editingItem.PriceBuying = PriceBuying;
    editingItem.IsGas = IsGas;
    editingItem.ProductRate = ProductRate;
    editingItem.ID = ID;
};

const submitEdit = () => {
    const item = products.value.find((item) => item.ID === editingItem.ID);
    item.ProductPhoto = editingItem.ProductPhoto;
    item.ProductName = editingItem.ProductName;
    item.ProductCategory = editingItem.ProductCategory;
    item.ProductDescription = editingItem.ProductDescription;
    item.PriceBuying = editingItem.PriceBuying;
    item.IsGas = editingItem.IsGas;
    item.ProductRate = editingItem.ProductRate;
    item.PriceBuying = editingItem.PriceBuying;

    formData.append("id", item.ID)
    formData.append("product_name", item.ProductName)
    formData.append("product_category", item.ProductCategory)
    formData.append("product_description", item.ProductDescription)
    formData.append("price_buying", item.PriceBuying)
    formData.append("product_rate", "0.0")
    formData.append("is_gas", item.IsGas)

    http.fetch('update_product_item', {
        method: "PUT",
        headers: {
            Authorization: 'Bearer ' + token,
            "Content-Type": "form-data"
        },
        body: formData
    }).then((res: any) => {
        if (res.status == 200) {
            useToast().success(res.message);
            getProducts();
            isEditing.value = false;
        }
    }).catch((error) => {
        console.log(error);
    }).finally(
    );
};


</script>

