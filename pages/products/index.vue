<template>
    <v-row>
        <!-- LIST OF RECORTDS -->
        <v-col cols="12" v-show="state == 1" md="12">
            <UiParentCard parent-title="Dashboard" title="List Products">
                <v-card-text v-show="isDeleting">
                    <v-alert prominent type="error" icon="mdi-delete" title="Delete" variant="tonal">
                        <v-row align="center">
                            <v-col class="grow" cols="12" md="8">
                                Are you show you want to detele, this item {{ deletingItem.ProductName }}
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="12" md="4" class="shrink">
                                <v-btn size="large" color="error" @click="deleteProduct(deletingItem.ID)"
                                    class="mx-3">Delete Product</v-btn>
                                <v-btn size="large" color="error" @click="isDeleting = false" variant="outlined"
                                    class="mx-3">Cancel</v-btn>
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
        <!-- EDITTING EXISTING RECORD -->
        <v-col cols="12" v-show="state == 3" md="12">
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
        <v-col cols="12" v-show="state == 2" md="12">
            <UiParentCard parent-title="All Product " title="Create Product">
                <div class="my-2">
                    <v-row>

                        <v-col cols="12" md="2">

                            <div class="flex align-center mx-2 my-3">
                                <div class="pa-2 rounded-lg" :class="step >= 1 ? 'bg-secondary' : 'bg-borderColor'">
                                    <PackageIcon class="mx-1 my-1" :class="step >= 1 ? 'text-white' : 'text-muted'"
                                        size="25" />
                                </div>
                                <div class=" px-3">
                                    <div class="text-sm text-2 pt-0 text-muted font-bold">Step 1</div>

                                    <div class="pt-1 font-weight-medium text-lg text-subtitle-1"
                                        :class="step >= 1 ? 'text-secondary' : 'text-muted'"> Overvien</div>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="2">

                            <div class="d-flex align-center mx-2 my-3">
                                <div class=" pa-2 rounded-lg" :class="step >= 2 ? 'bg-secondary' : 'bg-borderColor'">
                                    <FilePencilIcon class="mx-1 my-1" :class="step >= 2 ? 'text-white' : 'text-muted'"
                                        size="25" />
                                </div>
                                <div class=" px-3">
                                    <div class="text-sm text-2 pt-0 text-muted font-bold">Step 2</div>

                                    <div class="pt-1 font-weight-medium text-lg text-subtitle-1"
                                        :class="step >= 2 ? 'text-secondary' : 'text-muted'"> Description</div>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="2">

                            <div class="d-flex align-center mx-2 my-3">
                                <div class=" pa-2 rounded-lg" :class="step >= 3 ? 'bg-secondary' : 'bg-borderColor'">
                                    <CoinIcon class="mx-1 my-1" :class="step >= 3 ? 'text-white' : 'text-muted'"
                                        size="25" />
                                </div>
                                <div class=" px-3">
                                    <div class="text-sm text-2 pt-0 text-muted font-bold">Step 3</div>

                                    <div class="pt-1 font-weight-medium text-lg text-subtitle-1"
                                        :class="step >= 3 ? 'text-secondary' : 'text-muted'"> Pricing</div>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="2">

                            <div class="d-flex align-center mx-2 my-3">
                                <div class=" pa-2 rounded-lg" :class="step >= 4 ? 'bg-secondary' : 'bg-borderColor'">
                                    <CheckIcon class=" mx-1 my-1" :class="step >= 4 ? 'text-white' : 'text-muted'"
                                        size="25" />
                                </div>
                                <div class=" px-3">
                                    <div class="text-sm text-2 pt-0 text-muted font-bold">Step 4</div>

                                    <div class="pt-1 font-weight-medium text-lg text-subtitle-1"
                                        :class="step >= 4 ? 'text-secondary' : 'text-muted'"> Confirmation</div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>

                </div>
                <v-divider class="mx-2 my-4"></v-divider>
                <v-row>
                    <v-col cols="12" md="8">
                        <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                            <v-row v-if="step == 1">
                                <v-col cols="12" md="4">
                                    <div class=" px-3">
                                        <div class="pt-0 text-xs  font-weight-bold ">Product Images</div>

                                        <div class="pt-1 font-weight-light text-[10px]  text-muted"> Make your product look
                                            more
                                            attractive with 3:4 photos</div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <div class="flex justify-between align-center">

                                        <div class=" flex space-x-4">
                                            <div v-for="i in 3"
                                                class="h-16 w-auto overflow-hidden object-cover bg-white border-2 my-2  rounded-lg">
                                                <img src="/images/products/s4.jpg" class="object-contain h-16" />
                                            </div>
                                        </div>

                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div
                                                    class="flex bg-lightmuted justify-center border-2 border-dashed  px-6 py-4 align-center rounded-lg">
                                                    <PlusIcon class=" mx-1 my-1 text-muted" size="18" />
                                                    <div class="text-secondary text-sm px-2  font-medium"> Add more (2)
                                                    </div>
                                                </div>
                                            </v-card>
                                        </div>
                                    </div>


                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class=" px-3">
                                        <div class="pt-0  text-xs  font-weight-bold ">Product Video</div>

                                        <div class="pt-1 font-weight-light text-[10px]  text-muted">Make your product look
                                            more
                                            attractive with 3:4 photos</div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <div>
                                        <v-card elevation="0" @click="">
                                            <div
                                                class="flex bg-lightmuted justify-center border-2 border-dashed  px-2 py-4 align-center rounded-lg">
                                                <PlusIcon class=" mx-1 my-1 text-muted" size="18" />
                                                <div class="text-muted text-sm px-2 py-3 font-medium"> Drag or Click to add
                                                    video
                                                </div>
                                            </div>
                                        </v-card>
                                    </div>

                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class=" px-3">
                                        <div class="pt-0 text-xs font-weight-bold ">Product Name</div>

                                        <div class="pt-1 font-weight-light text-[10px]  text-muted"> Write your product
                                            title that
                                            buyers
                                            would likely to search</div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <v-text-field variant="outlined" density="compact" v-model="form.productName.$value"
                                        @blur="form.productName.$validate()" color="primary"
                                        :error-messages="form.productName.$errors"></v-text-field>

                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class=" px-3">
                                        <div class="pt-0 text-xs font-weight-bold ">Category</div>

                                        <div class="pt-1 font-weight-light text-[10px]  text-muted"> Choose the category and
                                            sub-category
                                            most suitable the product</div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <div class="flex space-x-4">
                                        <v-select variant="outlined" density="compact" v-model="selectedCategory"
                                            color="primary" :items="categories" item-title="Title"
                                            item-value="ID"></v-select>

                                        <v-select v-model="IsGas" :items="productType" variant="outlined" density="compact"
                                            color="primary" item-title="label" item-value="value"></v-select>

                                        <v-text-field variant="outlined" v-show="IsGas == '1'" density="compact"
                                            v-model="form.productKg.$value" color="primary"></v-text-field>
                                    </div>


                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class=" px-3">
                                        <div class="pt-0 text-xs font-weight-bold "> Kilogram Variant</div>

                                        <div class="pt-1 font-weight-light text-[10px] text-muted"> Choose the category and
                                            sub-category
                                            most suitable the product</div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <div class="flex space-x-4">
                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div class=" bg-white border-2  pa-2 rounded-lg">
                                                    <div class="font-bold mx-2">3</div>
                                                </div>
                                            </v-card>
                                        </div>
                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div class=" bg-lightprimary border-2 border-blue-300 pa-2 rounded-lg">
                                                    <div class="font-bold text-secondary mx-2">6</div>
                                                </div>
                                            </v-card>
                                        </div>
                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div class=" bg-white border-2  pa-2 rounded-lg">
                                                    <div class="font-bold mx-2">9</div>
                                                </div>
                                            </v-card>
                                        </div>
                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div class=" bg-lightprimary border-2 border-blue-300 pa-2 rounded-lg">
                                                    <div class="font-bold text-secondary mx-2">12</div>
                                                </div>
                                            </v-card>
                                        </div>
                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div class=" bg-lightprimary border-2 border-blue-300 pa-2 rounded-lg">
                                                    <div class="font-bold text-secondary mx-2">15</div>
                                                </div>
                                            </v-card>
                                        </div>
                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div class=" bg-lightprimary border-2 border-blue-300 pa-2 rounded-lg">
                                                    <div class="font-bold text-secondary mx-2">20</div>
                                                </div>
                                            </v-card>
                                        </div>
                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div class=" bg-lightprimary border-2 border-blue-300 pa-2 rounded-lg">
                                                    <div class="font-bold text-secondary mx-2">25</div>
                                                </div>
                                            </v-card>
                                        </div>
                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div class=" bg-white border-2  pa-2 rounded-lg">
                                                    <PlusIcon class=" mx-1 my-1"
                                                        :class="step >= 4 ? 'text-white' : 'text-muted'" size="18" />
                                                </div>
                                            </v-card>
                                        </div>


                                    </div>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class=" px-3">
                                        <div class="pt-0 text-xs font-weight-bold ">Product Variant</div>

                                        <div class="pt-1 font-weight-light text-[10px]  text-muted"> Make your product look
                                            more
                                            attractive with 3:4 photos</div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <div class="flex justify-between">
                                        <div class="flex space-x-4">
                                            <div>
                                                <v-card elevation="0" @click="">
                                                    <div class=" bg-white border-2  pa-2 rounded-lg">
                                                        <DropletIcon class=" mx-1 my-1 text-muted" size="18" />
                                                    </div>
                                                </v-card>
                                            </div>
                                            <div>
                                                <v-card elevation="0" @click="">
                                                    <div class=" bg-white border-2  pa-2 rounded-lg">
                                                        <div class="font-bold mx-2">Green Cylinder</div>
                                                    </div>
                                                </v-card>
                                            </div>
                                            <div>
                                                <v-card elevation="0" @click="">
                                                    <div class=" bg-white border-2  pa-2 rounded-lg">
                                                        <TrashIcon class=" mx-1 my-1 text-error" size="18" />
                                                    </div>
                                                </v-card>
                                            </div>
                                        </div>
                                        <div>
                                            <v-card elevation="0" @click="">
                                                <div
                                                    class="flex bg-white border-2 border-dashed  pa-2 align-center rounded-lg">
                                                    <PlusIcon class=" mx-1 my-1 text-muted" size="18" />
                                                    <div class="text-muted text-sm px-2 font-medium">Add new variant</div>
                                                </div>
                                            </v-card>
                                        </div>
                                    </div>

                                </v-col>

                            </v-row>
                            <v-row v-if="step == 2">
                                 
                                <v-col cols="12" md="4">
                                    <div class=" px-3">
                                        <div class="pt-0 text-xs font-weight-bold ">Product Description</div>

                                        <div class="pt-1 font-weight-light text-[10px]  text-muted"> Write your product
                                            title that
                                            buyers
                                            would likely to search</div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <v-textarea variant="outlined" density="compact" v-model="form.productName.$value"
                                        @blur="form.productName.$validate()" color="primary"
                                        :error-messages="form.productName.$errors"></v-textarea>

                                </v-col>
                                 

                            </v-row>
                            <v-col cols="12">

                                <v-btn @click="prevPage()" :disabled="loading" class="my-4 mx-2" color="primary"
                                    variant="outlined" prepend-icon="mdi-arrow-left" flat>
                                    Previous
                                </v-btn>
                                <v-btn @click="nextPage()" :disabled="loading" class="my-4 mx-2" color="primary"
                                    append-icon="mdi-arrow-right" flat>
                                    Continue
                                </v-btn>


                            </v-col>
                        </form>
                    </v-col>
                    <v-col cols="12" md="4">
                        <div class="py-2 px-2 bg-borderColor rounded-lg">

                        </div>
                    </v-col>
                </v-row>

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
const fileRecords = ref([])
const uploadUrl = ref('https://example.com')

const loading = ref(false);
const products = ref([]);
const categories = ref([]);
const search = ref("");
const step = ref(1)
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
    const { ProductName, ID } = val;
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


const nextPage = () => {

    if (step.value == 4) {
        loading.value = true

        setTimeout(() => (loading.value = false), 3000)
    } else {
        step.value++;
    }

};
const prevPage = () => {
    if (step.value == 1) {
        step.value == 1
    } else {
        step.value--;
        loading.value = false
    }

};
// Upload files
const files = ref([])
const fileDragging = ref()
const fileDropping = ref()


</script>

