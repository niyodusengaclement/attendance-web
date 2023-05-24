<template>
    <v-row>
        <v-col cols="12" v-show="state == 3" :md="state == 1 ? 12 : 4">
            <UiParentCard title="Editing Product Item">
                <form role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                    
                        <v-select label="Category" variant="outlined" density="compact" v-model="editingItem.ProductCategory"
                            color="primary" :items="categories" item-title="Title" item-value="ID" @update:modelValue="loadProductByCategory(selectedCategory)"></v-select>

                        <v-select label="Product" v-model="editingItem.ProductName" :items="products" variant="outlined" density="compact"
                            color="primary" item-title="ProductName" item-value="ID"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Stock In"
                            v-model="editingItem.StockIn" color="primary"></v-text-field>
                  
                            <v-text-field variant="outlined" density="compact" label="Stock Out"
                            v-model="editingItem.StockOut" color="primary"></v-text-field>

                            <v-text-field variant="outlined" density="compact" label="Stock Return"
                            v-model="editingItem.StockReturn" color="primary"></v-text-field>


                        <v-btn @click.prevent="saveData" :disabled="loading" class="my-4" color="success" size="large" block
                            flat>{{
                                loading ? 'Updating Stock Item...' : 'Update Stock Item' }}</v-btn>

                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" v-show="state == 2" :md="state == 1 ? 12 : 4">
            <UiParentCard title="Adding Product Item">
                <form role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                    
                        <v-select label="Select Category" variant="outlined" density="compact" v-model="selectedCategory"
                            color="primary" :items="categories" item-title="Title" item-value="ID" @update:modelValue="loadProductByCategory(selectedCategory)"></v-select>

                        <v-select label="Select product" v-model="selectedProduct" :items="products" variant="outlined" density="compact"
                            color="primary" item-title="ProductName" item-value="ID"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Number of Items"
                            v-model="form.quantity.$value" @blur="form.quantity.$validate()" color="primary"
                            :error-messages="form.quantity.$errors"></v-text-field>


                        <v-btn @click.prevent="saveData" :disabled="loading" class="my-4" color="primary" size="large" block
                            flat>{{
                                loading ? 'Creating Item...' : 'Create New Item' }}</v-btn>

                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" :md="state != 1 ? 8 : 12">
            <UiParentCard title="Inventory Products">
                <v-card-text>
                    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
                        <v-tab @click="loadAllOrders()" :value="1">All Products
                            <v-chip size="small" class="ma-1">
                                15
                            </v-chip>
                        </v-tab>
                        <v-tab @click="loadOrderByStatus(3)" :value="2">Available Stock
                            <v-chip size="small" class="ma-1">
                                0
                            </v-chip>
                        </v-tab>
                        <v-tab @click="loadOrderByStatus(2)" :value="3">Low On Stock
                            <v-chip size="small" class="ma-1">
                                0
                            </v-chip></v-tab>
                        <v-tab @click="loadOrderByStatus(0)" :value="4">Out of Stock
                            <v-chip size="small" class="ma-1">
                                0
                            </v-chip></v-tab>
                        <v-tab @click="loadOrderByStatus(4)" :value="5">Return in Stock
                            <v-chip size="small" class="ma-1">
                                0
                            </v-chip></v-tab>

                    </v-tabs>
                    <v-container>
                        <v-card class="mx-auto bg-gray" flat color="grey-lighten-4">
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" md="8">
                                        <v-row>
                                            <v-col cols="12" md="3">
                                                <FilterDataTable :label="'Filter By'" :filters="[{ title: 'Name' }]" />
                                            </v-col>
                                            <v-col cols="12" md="9"> <v-text-field v-model="search" :loading="loading"
                                                    outlined density="compact"
                                                    label="Search for Order ID, customer, order status, or something"
                                                    prepend-inner-icon="mdi-magnify" single-line hide-details
                                                    @click:prepend-inner="onSearchData">

                                                </v-text-field></v-col>
                                        </v-row>


                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-btn prepend-icon="mdi-plus" color="primary" class="mx-2" variant="tonal" @click="onAddStockData">
                                            Add Stock
                                        </v-btn>
                                        <v-btn prepend-icon="mdi-export" color="success" class="mx-2" variant="tonal">
                                            Export
                                        </v-btn>


                                    </v-col>
                                </v-row>

                            </v-card-text>
                        </v-card>
                    </v-container>
                    <v-window v-model="tab">
                        <v-window-item v-for="n in 5" :key="n" :value="n">
                            <v-container fluid>
                                <ClientOnly>
                                    <EasyDataTable empty-message="No Order found" :search-value="search"
                                        theme-color="#5d87ff" table-class-name="eztable" :headers="headers"
                                        buttons-pagination :loading="loading" :items="stocks">
                                        <template #item-status="item">
                                            <v-chip size="small" :color="statusClr(item.Status)"> {{ statusStr(item.Status)
                                            }} </v-chip>

                                        </template>
                                        <template #item-ReferenceNo="item">
                                            <div class="text-primary">#{{ item.ReferenceNo }}</div>

                                        </template>

                                        <template #item-actions="item">
                                            <div class=" row">
                                                <v-btn size="large" flat density="compact" variant="tonal" color="success"
                                                    class="mx-1" icon="mdi-pencil" @click="editItem(item)" >

                                                </v-btn>
                                                <NuxtLink :to="'/orders/{item.ID}'">
                                                    <v-btn size="large" flat density="compact" variant="tonal" color="error"
                                                        class="mx-1" icon="mdi-delete">

                                                    </v-btn>
                                                </NuxtLink>

                                            </div>
                                        </template>
                                    </EasyDataTable>
                                </ClientOnly>
                            </v-container>
                        </v-window-item>

                    </v-window>

                </v-card-text>
            </UiParentCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Field, useValidation } from "vue3-form-validation";
import { rules } from "~/utils/rules";
import UiParentCard from '@/components/shared/UiParentCard.vue';
import FilterDataTable from "@/components/dashboard/FilterDataTable.vue"
import { Header, Item } from "vue3-easy-data-table"
import { useHttpRequest } from '~~/composables/useHttpRequest';
import { log } from 'console';
definePageMeta({layout: "admin",});
const config = useRuntimeConfig()
const API_URL = config.public.apiUrl;
const http = useHttpRequest()
const instance = getCurrentInstance();

let token: string | null
let logger = ref('')
if (process.client) {
    token = localStorage.getItem("token")
    logger.value = JSON.parse(localStorage.getItem("logger"))
}

const state = ref(1)
const lists = ref([]);
const loading = ref(false);
const isEditing = ref(false);
const products = ref([]);
const categories = ref([]);
const stocks = ref([])
const tab = ref(null);
const selectedCategory = ref('')
const selectedProduct = ref('')
const search = ref("");
onMounted(() => {
    loadAllOrders();
    getStockItems();
})

const headers: Header[] = [
    { text: "ID", value: "ReferenceNo", sortable: true },
    { text: "Category", value: "ProductCategory", sortable: true },
    { text: "Product", value: "ProductName", sortable: true },
    { text: "Stock In", value: "StockIn", sortable: true },
    { text: "Stock Out", value: "StockOut", sortable: true },
    { text: "Stock Return", value: "StockReturn", sortable: true },
    { text: "Status", value: "Status", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
]

function loadAllOrders() {
    loading.value = true
    http.fetch("orders")
        .then((data: any) => {
            if (data.status == 200) {
                lists.value = data.records;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

function loadOrderByStatus(status: string) {
    loading.value = true
    http.fetch("order_by_status/" + status)
        .then((data: any) => {
            if (data.status == 200) {
                lists.value = data.records;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
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
const onSearchData = () => {
    loading.value = true

    setTimeout(() => {
        loading.value = false
    }, 2000)
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
    console.log("State = "+ state.value);
}

interface FormData {
    quantity: Field<string>;
}
const {
    form,
    validating,
    validateFields,
    resetFields,
} = useValidation<FormData>({
    quantity: {
        $value: "",
        $rules: [rules.required("Please qty must be provided")],
    }
});

async function handleSubmit() {
    try {
        const formData = await validateFields();

    } catch (e) {
    //    useToast().error(e.message);
    }
}
async function saveData() {
console.log(logger.value.ID);

let formData = new FormData()
formData.append("product_id", selectedProduct.value)
formData.append("shop_id", logger.value.ID)
formData.append("quantity", form.quantity.$value)
http.fetch('adding_stock_item', {
    method: "POST",
    headers: {
        Authorization: 'Bearer ' + token,
        "Content-Type": "form-data"
    },
    body: formData
}).then((res: any) => {
    
    if (res.status == 200) {
        useToast().success(res.message);
        getStockItems();
        state.value = 1
    }else{
        useToast().error(res.message);
    }
}).catch((error) => {
        console.log(error);
        useToast().error(error.message);
}).finally();
}

function getSelectedItem(ID: any){
    console.log("itemId.value" + ID);
    
}

function loadProductByCategory(category: any) {
    loading.value = true
    http.fetch("get_selection_product/" + category)
        .then((data: any) => {
            if (data.status == 200) {
                products.value = data.records;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

function getStockItems() {
    http.fetch("get_stock_items")
        .then((data: any) => {
            if (data.status == 200) {
                stocks.value = data.records;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

//EDITTING

const editingItem = reactive({
    ProductCategory: "",
    ProductName: "",
    StockOut: "",
    StockIn: "",
    StockReturn: "",
    ID: 0,
});

const editItem = (val: Item) => {
    isEditing.value = true;
    state.value = 3
    const {  ProductName, ProductCategory, StockIn, StockOut, StockReturn, ID } = val;
    editingItem.ProductCategory = ProductCategory;
    editingItem.ProductName = ProductName;
    editingItem.StockIn = StockIn;
    editingItem.StockOut = StockOut;
    editingItem.StockReturn = StockReturn;
    editingItem.ID = ID;
};

</script>
