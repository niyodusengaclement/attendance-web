<template>
    <v-row>
        <!-- LIST OF RECORTDS -->
        <v-col cols="12" v-show="state == 1" md="12">
            <UiParentCard parent-title="Dashboard" title="List Products">
                <v-card-text v-show="isDeleting">
                    <v-alert prominent type="error" icon="mdi-delete" title="Delete" variant="outlined">
                        <v-row>
                            <v-col class="grow" cols="12" md="8">
                                Are you show you want to detele, this item
                                {{ editingItem.product_name }}
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col cols="12" md="4" class="shrink">
                                <v-btn flat color="error" @click="deleteProduct(editingItem.id)"
                                    :loading="btnDeletingLoading" class="mx-3"><v-icon>mdi-delete</v-icon> Delete
                                    Product</v-btn>
                                <v-btn color="error" @click="isDeleting = false" variant="outlined"
                                    class="mx-3"><v-icon>mdi-close</v-icon> Cancel</v-btn>
                            </v-col>
                        </v-row>
                    </v-alert>
                </v-card-text>
                <v-card-text>
                    <v-row class="mb-4">
                        <v-col cols="12" md="9">
                            <v-text-field v-model="search" :loading="loading" variant="tonal" density="compact"
                                label="Search for product name"
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
                            <template #item-image_url="item">
                                <v-img :src="image_URL + item.image_url" height="50" width="50" class="rounded-lg"></v-img> 
                            </template>
                            <template #item-is_gas="item">
                                <div>{{ gasStr(item.is_gas) }}</div>
                            </template>
                            <template #empty-message>
                                <div class="d-flex justify-center align-center py-3">
                                    <v-img src="/images/products/not_found.png" height="150"></v-img>
                                </div>
                                <p class="text-muted font-weight-light"> No Found</p>
                            </template>
                            <template #item-actions="item">
                                <div>

                                    <v-btn size="small" variant="outlined" color="success" class="mx-1"
                                        @click="editItem(item)">
                                        Update</v-btn>

                                    <v-btn size="small" variant="outlined" color="error" class="mx-1"
                                        @click="deleteItem(item)">
                                        Delete
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
            <UiParentCard :title="'Updating ' + editingItem.product_name + ' product'" class="text-success">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="tonal" elevation="0" @click="reset()">
                </v-btn>
                <v-row>
                    <v-col cols="12" md="4"> <v-img aspect-ratio="1/1" :src="image_URL + editingItem.image_url"
                            max-height="300" class="bg-grey-lighten-2 border rounded-lg my-5"></v-img></v-col>
                    <v-col cols="12" md="8">
                        <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                            <v-col cols="12">

                                <v-text-field variant="outlined" density="compact" label="Product"
                                    v-model="editingItem.product_name" color="primary"></v-text-field>

                                <v-select :label="editingItem.category + ' (Category)'" variant="outlined" density="compact"
                                    v-model="selectedCategory" color="primary" :items="categories" item-title="title"
                                    item-value="id" return-object
                                    @update:model-value="getSubCategories(selectedCategory.id)"></v-select>

                                <v-select :label="editingItem.sub_category + ' (SubCategory)'" variant="outlined"
                                    density="compact" v-model="selectedSubCategory" color="primary" :items="sub_categories"
                                    item-title="title" item-value="id" return-object></v-select>

                                <v-select label="Is Gas" v-model="editingItem.is_gas" :items="productType"
                                    variant="outlined" density="compact" color="primary" item-title="label"
                                    item-value="value"></v-select>

                                <v-text-field variant="outlined" v-show="editingItem.is_gas == '1'" density="compact"
                                    label="Product In KG" v-model="editingItem.quantity_kg" color="primary"></v-text-field>

                                <v-text-field variant="outlined" density="compact" label="Price" v-model="editingItem.price"
                                    color="primary"></v-text-field>

                                <v-textarea variant="outlined" density="compact" label="Description"
                                    v-model="editingItem.description" color="primary"></v-textarea>
                                <div class="flex justify-start space-x-4">
                                    <v-btn @click="state = 1" class="my-4" color="error" variant="outlined" size="large"
                                        flat> <v-icon class="mr-2 ">mdi-close</v-icon> Close Update</v-btn>
                                    <v-btn @click="updateProduct(editingItem.id)" :disabled="loading" :loading="loading"
                                        class="my-4" color="primary" size="large" flat>Update Product</v-btn>

                                </div>

                            </v-col>
                        </form>
                    </v-col>

                </v-row>

            </UiParentCard>
        </v-col>

        <!-- CREATING NEW RECORD -->
        <v-col cols="12" v-show="state == 2" md="12">
            <UiParentCard parent-title="All Product " title="Create Product">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="tonal" elevation="0" @click="reset()">
                </v-btn>
                <div class="my-2">
                    <v-row>
                        <v-col cols="12" md="3">
                            <div class="flex align-center mx-2 my-3">
                                <div class="pa-2 rounded-lg" :class="step >= 1 ? 'bg-secondary' : 'bg-borderColor'">
                                    <PackageIcon class="mx-1 my-1" :class="step >= 1 ? 'text-white' : 'text-muted'"
                                        size="25" />
                                </div>
                                <div class="px-3">
                                    <div class="text-sm text-2 pt-0 text-muted font-bold">
                                        Step 1
                                    </div>

                                    <div class="pt-1 font-weight-medium text-lg text-subtitle-1"
                                        :class="step >= 1 ? 'text-secondary' : 'text-muted'">
                                        Overvien
                                    </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="3">
                            <div class="d-flex align-center mx-2 my-3">
                                <div class="pa-2 rounded-lg" :class="step >= 2 ? 'bg-secondary' : 'bg-borderColor'">
                                    <FilePencilIcon class="mx-1 my-1" :class="step >= 2 ? 'text-white' : 'text-muted'"
                                        size="25" />
                                </div>
                                <div class="px-3">
                                    <div class="text-sm text-2 pt-0 text-muted font-bold">
                                        Step 2
                                    </div>

                                    <div class="pt-1 font-weight-medium text-lg text-subtitle-1"
                                        :class="step >= 2 ? 'text-secondary' : 'text-muted'">
                                        Description
                                    </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="3">
                            <div class="d-flex align-center mx-2 my-3">
                                <div class="pa-2 rounded-lg" :class="step >= 3 ? 'bg-secondary' : 'bg-borderColor'">
                                    <CoinIcon class="mx-1 my-1" :class="step >= 3 ? 'text-white' : 'text-muted'"
                                        size="25" />
                                </div>
                                <div class="px-3">
                                    <div class="text-sm text-2 pt-0 text-muted font-bold">
                                        Step 3
                                    </div>

                                    <div class="pt-1 font-weight-medium text-lg text-subtitle-1"
                                        :class="step >= 3 ? 'text-secondary' : 'text-muted'">
                                        Pricing & Confirmation
                                    </div>
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
                                    <div class="px-3">
                                        <div class="pt-0 text-xs font-weight-bold">
                                            Product Images
                                        </div>

                                        <div class="pt-1 font-weight-light text-[10px] text-muted">
                                            Make your product look more attractive with 3:4 photos
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <div class="flex justify-between align-center">
                                        <div class="flex space-x-4">
                                            <div v-show="selectedFiles.length == 0"
                                                class="h-32 w-auto overflow-hidden object-cover bg-white border-2 my-2 rounded-lg">
                                                <img src="/images/placeholder.jpg" class="object-contain h-32" />
                                            </div>
                                        </div>
                                        <div class="group flex space-x-4">
                                            <div v-for="(image, index) in selectedFiles" :key="index"
                                                class="h-32 w-auto overflow-hidden object-cover bg-white border-2 my-2 rounded-lg">
                                                <img :src="image.url" class="object-contain h-32" />
                                            </div>
                                        </div>

                                        <div>
                                            <v-card elevation="0" @click="" width="160">
                                                <div v-if="!file" class="mt-5">
                                                    <toast />
                                                    <div :class="[
                                                        'dropZone',
                                                        dragging ? 'dropZone-over' : '',
                                                    ]">
                                                        <div class="dropZone-info" @drag="onChange">
                                                            <div class="d-flex flex-col items-center justify-center">
                                                                <svg class="w-10 h-10 mb-3 text-gray-400" fill="none"
                                                                    stroke="currentColor" viewBox="0 0 24 24"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        stroke-width="2"
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                                                                    </path>
                                                                </svg>
                                                                <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                                                    <span class="font-semibold text-xs">Click to upload
                                                                        image
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <input type="file" @change="onFileSelect" />
                                                    </div>
                                                </div>
                                                <div v-else class="dropZone-uploaded mt-5">
                                                    <div class="dropZone-uploaded-info">
                                                        <svg class="w-10 h-10 mb-3 text-gray-400" fill="none"
                                                            stroke="currentColor" viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                stroke-width="2"
                                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                                                            </path>
                                                        </svg>
                                                        <p v-if="file"
                                                            class="text-xs py-2 text-gray-500 dark:text-gray-400">
                                                            {{ file["name"] }}
                                                        </p>
                                                        <v-btn color="error" v-if="file" unelevated @click="removeFile()"
                                                            variant="tonal" size="small">
                                                            Remove File</v-btn>
                                                    </div>
                                                </div>
                                            </v-card>
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <div class="px-3">
                                        <div class="pt-0 text-xs font-weight-bold">
                                            Product Name
                                        </div>

                                        <div class="pt-1 font-weight-light text-[10px] text-muted">
                                            Write your product title that buyers would likely to
                                            search
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <v-text-field variant="outlined" density="compact" v-model="form.productName.$value"
                                        @blur="form.productName.$validate()" color="primary"
                                        :error-messages="form.productName.$errors"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="px-3">
                                        <div class="pt-0 text-xs font-weight-bold">Category</div>

                                        <div class="pt-1 font-weight-light text-[10px] text-muted">
                                            Choose the category and sub-category most suitable the
                                            product
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <div class="flex space-x-4">
                                        <v-select variant="outlined" density="compact" label="Category"
                                            v-model="selectedCategory" color="primary" :items="categories"
                                            item-title="title" item-value="id"
                                            @update:modelValue="getSubCategories(selectedCategory.id)"
                                            return-object></v-select>

                                        <v-select v-model="selectedSubCategory" :items="sub_categories" variant="outlined"
                                            density="compact" label="Sub Category" color="primary" item-title="title"
                                            item-value="id" @update:model-value="isProductGas = true"
                                            return-object></v-select>

                                        <v-select v-show="isProductGas" v-model="IsGas" :items="productType"
                                            variant="outlined" density="compact" color="primary" item-title="label"
                                            item-value="value" label="is Gas"></v-select>
                                    </div>
                                </v-col>

                                <v-row v-show="IsGas == '1'" class="px-3">
                                    <v-col cols="12" md="4">
                                        <div class="px-3">
                                            <div class="pt-0 text-xs font-weight-bold">
                                                Kilogram Variant
                                            </div>

                                            <div class="pt-1 font-weight-light text-[10px] text-muted">
                                                Choose the category and sub-category most suitable the
                                                product
                                            </div>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" md="8">
                                        <div class="flex space-x-4">
                                            <div v-for="item in productKgs">
                                                <v-card elevation="0" @click="selecteProductKg(item.kg)">
                                                    <div :class="selectedkg == item.kg
                                                        ? `bg-lightprimary border-blue-300`
                                                        : `bg-white `
                                                        " class="border-2 pa-2 rounded-lg">
                                                        <div class="font-bold mx-2">{{ item.kg }}</div>
                                                    </div>
                                                </v-card>
                                            </div>

                                            <div>
                                                <v-card elevation="0" @click="">
                                                    <div class="bg-white border-2 pa-2 rounded-lg">
                                                        <PlusIcon class="mx-1 my-1"
                                                            :class="step >= 4 ? 'text-white' : 'text-muted'" size="18" />
                                                    </div>
                                                </v-card>
                                            </div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-row>
                            <v-row v-if="step == 2">
                                <v-col cols="12" md="4">
                                    <div class="px-3">
                                        <div class="pt-0 text-xs font-weight-bold">
                                            Product Description
                                        </div>

                                        <div class="pt-1 font-weight-light text-[10px] text-muted">
                                            Write your product title that buyers would likely to
                                            search
                                        </div>
                                    </div>
                                </v-col>

                                <v-col cols="12" md="8">
                                    <v-textarea variant="outlined" density="compact" v-model="form.productDesc.$value"
                                        @blur="form.productDesc.$validate()" color="primary"
                                        :error-messages="form.productDesc.$errors"></v-textarea>
                                </v-col>
                            </v-row>
                            <v-row v-if="step == 3">
                                <v-col>
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <div class="px-3">
                                                <div class="pt-0 text-xs font-weight-bold">
                                                    Product Price
                                                </div>
        
                                                <div class="pt-1 font-weight-light text-[10px] text-muted">
                                                    Write your product title that buyers would likely to
                                                    search
                                                </div>
                                            </div>
                                        </v-col>
        
                                        <v-col cols="12" md="8">
                                            <v-text-field variant="outlined" density="compact" v-model="form.productPrice.$value"
                                                @blur="form.productPrice.$validate()" color="primary"
                                                :error-messages="form.productPrice.$errors"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row v-show="IsGas == '1'">
                                        <v-col cols="12" md="4">
                                            <div class="px-3">
                                                <div class="pt-0 text-xs font-weight-bold">
                                                    Product Refilling Price
                                                </div>
        
                                                <div class="pt-1 font-weight-light text-[10px] text-muted">
                                                    Write your product title that buyers would likely to
                                                    search
                                                </div>
                                            </div>
                                        </v-col>
        
                                        <v-col cols="12" md="8">
                                            <v-text-field variant="outlined" density="compact" v-model="editingItem.price"
                                                color="primary"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>

                            </v-row>
                            <v-col cols="12">
                                <v-btn @click="prevPage()" :disabled="loading" class="my-4 mx-2" color="primary"
                                    variant="outlined" prepend-icon="mdi-arrow-left" flat>
                                    Previous
                                </v-btn>
                                <v-btn @click="step == 3 ? createProduct() : nextPage()" :disabled="loading"
                                    :loading="loading" class="my-4 mx-2" color="primary" append-icon="mdi-arrow-right" flat>
                                    {{ step == 3 ? 'Create Product' : 'Continue' }}
                                </v-btn>
                            </v-col>
                        </form>
                    </v-col>
                    <v-col cols="12" md="4">
                        <div class="py-2 px-0 bg-slate-100 rounded-lg mx-2">
                            <v-card v-show="selectedFiles.length > 0" variant="text" color="gray" class="mx-auto my-0"
                                max-width="370">
                                <template v-slot:loader="{ isActive }">
                                    <v-progress-linear :active="isActive" color="deep-purple" height="4"
                                        indeterminate></v-progress-linear>
                                </template>

                                <v-img class="rounded-lg" contain height="250" :src="selectedFiles.length >= 1
                                    ? selectedFiles[0].url
                                    : '/images/placeholder.jpg'
                                    "></v-img>

                                <v-card-item>
                                    <v-card-title class="text-info">{{
                                        form.productName.$value
                                    }}</v-card-title>

                                    <v-card-subtitle>
                                        <span class="me-1">{{ selectedCategory.title }} </span><span class="me-1">{{
                                            selectedSubCategory.title }}, </span>
                                    </v-card-subtitle>

                                    <div v-show="IsGas == '1'" class="py-2 flex space-x-2 items-center">
                                        <v-icon color="success" icon="mdi-fire-circle" size="x-large"></v-icon>
                                        <v-chip size="small" variant="tonal" color="primary">
                                            {{ selectedkg }} Kg</v-chip>
                                    </div>
                                </v-card-item>

                                <v-card-text>
                                    <v-row align="center" class="mx-0">
                                        <v-rating :model-value="4.5" color="amber" density="compact" half-increments
                                            readonly size="small"></v-rating>

                                        <div class="text-grey ms-4">4.5</div>
                                    </v-row>

                                    <div class="py-4 text-justify text-xs">
                                        {{ form.productDesc.$value }}
                                    </div>
                                </v-card-text>

                                <v-divider class="mx-4 mb-1"></v-divider>

                                <v-card-actions>
                                    <v-btn color="deep-purple-lighten-2" variant="text" @click="reserve">
                                        Reserve
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Field, useValidation } from "vue3-form-validation";
import { Header, Item } from "vue3-easy-data-table";
import { rules } from "~/utils/rules";
import { useHttpRequest } from "~~/composables/useHttpRequest";
import UiParentCard from "@/components/shared/UiParentCard.vue";
const config = useRuntimeConfig();
definePageMeta({
    layout: "admin",
});
let token: string | null;
let logger = ref("");

const state = ref(1);
const selectedCategory = ref("");
const selectedSubCategory = ref("");
const isProductGas = ref(false);
const btnDeletingLoading = ref(false);
const productType = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
];
let formData = new FormData();
const http = useHttpRequest();
const instance = getCurrentInstance();
const image_URL = config.public.imageURL;
interface FormData {
    productName: Field<string>;
    productPrice: Field<string>;
    productDesc: Field<string>;

}
const fileRecords = ref([]);
const uploadUrl = ref("https://example.com");
const imagePreview = ref("/images/placeholder.jpg");
const loading = ref(false);
const products = ref([]);
const categories = ref([]);
const sub_categories = ref([]);
const search = ref("");
const step = ref(1);
const IsGas = ref("");
const isEditing = ref(false);
const isDeleting = ref(false);
const selectedkg = ref("");

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
        $rules: [rules.min(2)("product price has to be longer than 2 characters")],
    },
    productDesc: {
        $value: "",
        $rules: [
            rules.min(30)("Product description is requireed more than 30 characters"),
        ],
    },

});

const selecteProductKg = (id: any) => {
    selectedkg.value = id;
};
function getProducts() {
    loading.value = true;
    http
        .fetch("products")
        .then((data: any) => {
            if (data.status == 200) {
                products.value = data.data;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}
function reset() {
    resetFields()
    state.value = 1
    IsGas.value = ''
    isEditing.value = false
    isDeleting.value = false
    selectedkg.value = ''
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

function gasStr(status: any) {
    if (status == 1) {
        return "YES";
    } else {
        return "NO";
    }
}
function deleteProduct(id: any) {
    btnDeletingLoading.value = true;
    var formData = new FormData();
    formData.append("id", id.toString());
    formData.append("name", editingItem.product_name.toString());
    http
        .fetch("delete_product", {
            method: "POST",
            body: formData
        })
        .then((data: any) => {
            if (data.status == 200) {
                useToast().success(data.message);
                getProducts();
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            btnDeletingLoading.value = false;
            isDeleting.value = false;
        });
}

const productKgs = [
    { id: "1", kg: "3" },
    { id: "1", kg: "6" },
    { id: "1", kg: "12" },
    { id: "1", kg: "15" },
    { id: "1", kg: "20" },
    { id: "1", kg: "25" },
    { id: "1", kg: "35" },
];

const headers: Header[] = [
    { text: "Photo", value: "image_url", sortable: true },
    { text: "Product", value: "product_name", sortable: true },
    { text: "Category", value: "category", sortable: true },
    { text: "Sub Category", value: "sub_category", sortable: true },
    { text: "Price", value: "product_price", sortable: true },
    { text: "Gas", value: "is_gas", sortable: true },
    { text: "Actions", value: "actions", width: 200 },
];

async function createProduct() {
    loading.value = true;
    var formData = new FormData();
    formData.append("image", file.value);
    formData.append("name", form.productName.$value);
    formData.append("category", selectedCategory.value.id);
    formData.append("sub_category", selectedSubCategory.value.id);
    formData.append("description", form.productDesc.$value);
    formData.append("kg", selectedkg.value);
    formData.append("price", form.productPrice.$value);
    formData.append("product_rate", "0.0");
    formData.append("is_gas", IsGas.value);
    http
        .fetch("create_new_product", {
            method: "POST",
            body: formData,
        })
        .then((res: any) => {
            if (res.status == 200) {
                useToast().success(res.message);
                getProducts();
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            loading.value = false;
            state.value = 1;

        });
}

async function updateProduct(id: any) {
    loading.value = true;
    var formData = new FormData();
    formData.append("id", id.toString());
    formData.append("name", editingItem.product_name);
    formData.append("category", selectedCategory.value.id);
    formData.append("sub_category", selectedSubCategory.value.id);
    formData.append("description", editingItem.description);
    formData.append("kg", editingItem.quantity_kg);
    formData.append("price", editingItem.price);
    formData.append("is_gas", IsGas.value);
    http
        .fetch("update_product", {
            method: "POST",
            body: formData,
        })
        .then((res: any) => {
            if (res.status == 200) {
                useToast().success(res.message);
                getProducts();
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            loading.value = false;
            state.value = 1;

        });
}


function getCategories() {
    http
        .fetch("all_categories")
        .then((data: any) => {
            if (data.status == 200) {
                categories.value = data.data;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

function getSubCategories(id: any) {
    var formData = new FormData();
    formData.append("category_id", id.toString());
    http
        .fetch("all_sub_categories", {
            method: "post",
            body: formData,
        })
        .then((data: any) => {
            if (data.status == 200) {
                sub_categories.value = data.data;
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
};

//Editing

const editingItem = reactive({
    image_url: "",
    product_name: "",
    category: "",
    sub_category: "",
    description: "",
    quantity_kg: "",
    price: "",
    is_gas: "",
    id: 0,
});

const deleteItem = (val: Item) => {
    isDeleting.value = true;
    const { product_name, id } = val;
    editingItem.product_name = product_name;
    editingItem.id = id;
};

const editItem = (val: Item) => {
    isEditing.value = true;
    state.value = 3;
    const {
        image_url,
        product_name,
        category,
        sub_category,
        product_description,
        product_price,
        quantity_kg,
        is_gas,
        id,
    } = val;
    editingItem.image_url = image_url;
    editingItem.product_name = product_name;
    editingItem.category = category;
    editingItem.sub_category = sub_category;
    editingItem.description = product_description;
    editingItem.price = product_price;
    editingItem.is_gas = is_gas;
    editingItem.quantity_kg = quantity_kg;
    editingItem.id = id;
};

const nextPage = () => {
    if (step.value == 3) {

        createProduct()

    } else {
        step.value++;
    }
};
const prevPage = () => {
    if (step.value == 1) {
        step.value == 1;
    } else {
        step.value--;
        loading.value = false;
    }
};
// Upload files
const fileDragging = ref();
const fileDropping = ref();
let file = ref("");
let dragging = ref(false);

function onChange(e: any) {
    let files = e.target.files || e.dataTransfer.files;

    if (!files.length) {
        dragging.value = false;
        return;
    }
    if (files.size > 1000000) {
        // responseMessage("Document exceed file size limit ", "error", 6000)
        dragging.value = false;
        removeFile();
        return;
    }
    file.value = files[0];
    dragging.value = false;
    // uploadFile(files[0], props.documents, props.student) //Function to upload file
}
function removeFile() {
    file.value = "";
    selectedFiles.value = [];
}

const selectedFiles = ref([]);

function onFileSelect(e: any) {
    let files = e.target.files || e.dataTransfer.files;
    if (files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.split("/")[0] != "image") continue;
        if (
            !selectedFiles.value.some((event: any) => event.name === files[i].name)
        ) {
            if (selectedFiles.value.length > 1) {
                useToast().error("res.message");
                return;
            }

            selectedFiles.value.push({
                name: files[i].name,
                url: URL.createObjectURL(files[i]),
            });
        }
    }

    file.value = files[0];
    console.log(selectedFiles);
}
</script>
