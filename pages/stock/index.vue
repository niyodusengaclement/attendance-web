<template>
    <v-row>
        <v-col cols="12" v-show="state == 3" :md="state == 1 ? 12 : 4">
            <UiParentCard title="Update Product Stock ">
                <form role="form">
                    <v-col cols="12">
                        <v-select label="Choose Item Type" variant="outlined" density="compact" v-model="selectedType"
                            color="primary" :items="stockItemType" item-title="label" item-value="value"></v-select>
                        <v-select label="Choose Action" variant="outlined" density="compact" v-model="selectedAction"
                            color="primary" :items="stockOptionType" item-title="label" item-value="value"></v-select>

                        <v-text-field disabled="true" variant="outlined" density="compact" label="Product"
                            v-model="editingItem.product" color="primary"></v-text-field>

                        <v-text-field v-show="selectedAction == '1'" variant="outlined" density="compact"
                            label="Item Stock In" v-model="editingItem.new_stock_in" color="primary"></v-text-field>

                        <v-text-field v-show="selectedAction == '2'" variant="outlined" density="compact"
                            label="Item Stock Out" v-model="editingItem.new_stock_out" color="primary"></v-text-field>

                        <v-text-field v-show="selectedAction == '3'" variant="outlined" density="compact"
                            label="Item Stock Return" v-model="editingItem.new_stock_return" color="primary"></v-text-field>

                        <div class="flex justify-between space-x-4">
                            <v-btn @click="state = 1" class="my-4" color="error" variant="outlined" size="large" flat> Close
                            </v-btn>
                            <v-btn @click.prevent="saveData" :disabled="loading" :loading="loading" class="my-4"
                                color="success" size="large" flat> Update Product Stock</v-btn>
                        </div>

                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" v-show="state == 2" :md="state == 1 ? 12 : 4">
            <UiParentCard title="Adding Product Item">
                <form role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-select label="Select Category" variant="outlined" density="compact" v-model="selectedCategory"
                            color="primary" :items="categories" item-title="title" item-value="id"
                            @update:modelValue="loadProductByCategory(selectedCategory.id)" return-object></v-select>

                        <v-select label="Select product" v-model="selectedProduct" :items="products" variant="outlined"
                            density="compact" color="primary" item-title="text" item-value="value"></v-select>
                        
                        <v-select label="Select Stock type" v-model="form.type.$value" :items="stockType" variant="outlined"  @blur="form.type.$validate()"
                            density="compact" color="primary" item-title="text" :error-messages="form.type.$errors" item-value="value"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Number of Items"
                            v-model="form.quantity.$value" @blur="form.quantity.$validate()" color="primary"
                            :error-messages="form.quantity.$errors"></v-text-field>

                        <v-btn @click.prevent="saveData" :disabled="loading" class="my-4" color="primary" size="large" block
                            flat>{{ loading ? "Creating Item..." : "Create New Item" }}</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" v-show="state == 4" :md="state == 1 ? 12 : 4">
            <UiParentCard title="Moving Product to branch">
                <form role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-select label="Select Category" variant="outlined" density="compact" v-model="selectedCategory"
                            color="primary" :items="categories" item-title="title" item-value="id"
                            @update:modelValue="loadProductByCategory(selectedCategory.id)" return-object></v-select>

                        <v-select label="Select product" v-model="selectedProduct" :items="products" variant="outlined"
                            density="compact" color="primary" item-title="text" item-value="value"></v-select>
                         <v-select label="Select branch" v-model="selectedBranch" :items="branches" variant="outlined"
                            density="compact" color="primary" item-title="shop_name" item-value="id"></v-select>
                        
                        <v-select label="Select Stock type" v-if="selectedCategory.title === 'Gas'" v-model="type" :items="MoveType" variant="outlined"
                            density="compact" color="primary" item-title="text"  item-value="value"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Number of Items"
                            v-model="quantity" color="primary"></v-text-field>

                        <v-btn @click.prevent="moveStock" :disabled="loading" :loading="loading" class="my-4" color="primary" size="large" block
                            flat>{{ loading ? "Moving Stock..." : "Move to branch" }}</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" :md="state != 1 ? 8 : 12">
            <UiParentCard title="Inventory Products">
                <v-card-text>
                    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
                        <v-tab @click="loadAllOrders()" :value="1">All Products
                            <v-chip size="small" class="ma-1"> {{ lists.length ?? 0 }} </v-chip>
                        </v-tab>
                        <v-tab @click="loadOrderByStatus(3)" :value="2">Available Stock
                            <v-chip size="small" class="ma-1"> 0 </v-chip>
                        </v-tab>
                        <v-tab @click="loadOrderByStatus(2)" :value="3">Low On Stock
                            <v-chip size="small" class="ma-1"> 0 </v-chip></v-tab>
                        <v-tab @click="loadOrderByStatus(0)" :value="4">Out of Stock
                            <v-chip size="small" class="ma-1"> 0 </v-chip></v-tab>
                        <v-tab @click="loadOrderByStatus(4)" :value="5">Return in Stock
                            <v-chip size="small" class="ma-1"> 0 </v-chip></v-tab>
                    </v-tabs>
                    <v-container>
                        <v-card class="mx-auto bg-gray" flat color="grey-lighten-4">
                            <v-row>
                                <v-col cols="12" md="8">
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <FilterDataTable :label="'Filter By'" :filters="[{ title: 'Low Stock' }]" />
                                        </v-col>
                                        <v-col cols="12" md="7">
                                            <v-text-field variant="outlined" v-model="search" :loading="loading" outlined
                                                density="compact"
                                                label="Search for Order ID, customer, order status, or something"
                                                prepend-inner-icon="mdi-magnify" single-line hide-details
                                                @click:prepend-inner="onSearchData">
                                            </v-text-field></v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" md="4" class="flex justify-end">
                                    <v-btn v-if="state != 2" prepend-icon="mdi-plus" color="primary" class="mx-2" variant="tonal"
                                        @click="onAddStockData">
                                        Add Stock
                                    </v-btn>
                                    <v-btn prepend-icon="mdi-export" color="success" class="mx-2" variant="tonal">
                                        Export
                                    </v-btn>
                                    <v-btn v-if="state != 4" prepend-icon="mdi-export" color="info" class="mx-2" variant="tonal" @click="onMoveastock()">
                                        Move Stock
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-container>
                    <v-window v-model="tab">
                        <v-window-item v-for="n in 5" :key="n" :value="n">
                            <v-container fluid>
                                <ClientOnly>
                                    <EasyDataTable empty-message="No Order found" :search-value="search"
                                        theme-color="#5d87ff" table-class-name="eztable" :headers="headers"
                                        buttons-pagination :loading="loading" :items="lists">
                                        <template #item-image_url="item">
                                            <v-img :src="image_URL + item.photo" height="50" width="50"
                                                class="rounded-lg"></v-img>
                                        </template>
                                        <template #item-status="item">
                                            <v-chip size="small" variant="outlined" :color="statusClr(item.in_stock)">
                                                {{ statusStr(item.in_stock) }}
                                            </v-chip>
                                        </template>
                                        <template #item-ReferenceNo="item">
                                            <div class="text-primary">#{{ item.ReferenceNo }}</div>
                                        </template>

                                        <template #item-actions="item">
                                            <div class="row">
                                                <v-btn size="small" flat variant="outlined" color="info" class="mx-1"
                                                    @click="editItem(item)">
                                                    <v-icon>mdi-plus</v-icon> Update Stock
                                                </v-btn>

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
import { ref, onMounted } from "vue";
import { Field, useValidation } from "vue3-form-validation";
import { rules } from "~/utils/rules";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import FilterDataTable from "@/components/dashboard/FilterDataTable.vue";
import { Header, Item } from "vue3-easy-data-table";
import { useHttpRequest } from "~~/composables/useHttpRequest";
import { log } from "console";
definePageMeta({ layout: "admin" });
const config = useRuntimeConfig();
const API_URL = config.public.apiUrl;
const http = useHttpRequest();
const instance = getCurrentInstance();

let token: string | null;
let logger = ref("");
if (process.client) {
    token = localStorage.getItem("token");
    logger.value = JSON.parse(localStorage.getItem("logger"));
}
const image_URL = config.public.imageURL;
const imagePreview = ref("/images/placeholder.jpg");
const state = ref(1);
const lists = ref([]);
const loading = ref(false);
const isEditing = ref(false);
const products = ref([]);
const categories = ref([]);
const stocks = ref([]);
const tab = ref(null);
const selectedCategory = ref([]);
const selectedProduct = ref("");
const selectedType = ref('');
const selectedAction = ref('');
const search = ref("");
const quantity = ref("");
const selectedBranch = ref("");
const type = ref("");
const branches = ref([]);
onMounted(() => {
    loadStockProducts();
});
const stockOptionType = [
    { label: "Stock IN", value: "1" },
    { label: "Stock OUT", value: "2" },
    { label: "Stock RETURN", value: "3" },
];

const stockItemType = [
    { label: "Accessories", value: "1" },
    { label: "Gas", value: "2" },
];
const stockType = [
    { text: "Stock in", value: "1" },
    { text: "New stock", value: "2" },
    { text: "stock return", value: "3" },
];
const MoveType = [
    { text: "Filled Gas", value: "1" },
    { text: "Empty cylinder", value: "2" },
];
const headers: Header[] = [
    { text: "ID", value: "ReferenceNo", sortable: true },
    { text: "Photo", value: "image_url", sortable: true },
    { text: "Product", value: "product", sortable: true },
    { text: "Stock In", value: "in_stock", sortable: true },
    { text: "Stock Out", value: "emptyCylinder", sortable: true },
    { text: "Stock Return", value: "stock_return", sortable: true },
    { text: "Status", value: "status", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
];

function loadStockProducts() {
    loading.value = true;
    let formData = new FormData();
    formData.append("id", "");
    http
        .fetch("get_stock_products", {
            method: "POST",
            body: formData
        })
        .then((data: any) => {
            if (data.status == 200) {
                lists.value = data.records;
                instance?.proxy?.$forceUpdate();
            } else {
                useToast().error(data.message);
            }

        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

function loadOrderByStatus(status: any) {
    loading.value = true;
    http
        .fetch("order_by_status/" + status)
        .then((data: any) => {
            if (data.status == 200) {
                lists.value = data.records;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

const statusStr = (status: any) => {
    if (status >= 5000) {
        return "Full STOCK";
    } else if (status < 5000 && status > 1000) {
        return "Medium";
    } else if (status < 1000 && status > 100) {
        return "Lower Stock";
    } else if (status < 100 && status > 1) {
        return "Critical low";
    } else {
        return "Empty Stock";
    }
};

const statusClr = (status: any) => {
    if (status >= 5000) {
        return "success";
    } else if (status < 5000 && status > 1000) {
        return "primary";
    } else if (status < 1000 && status > 200) {
        return "secondary";
    } else if (status < 2000 && status > 1) {
        return "warning";
    } else {
        return "error";
    }
};
const onSearchData = () => {
    loading.value = true;

    setTimeout(() => {
        loading.value = false;
    }, 2000);
};
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
const onAddStockData = () => {
    state.value = 2;
    getCategories();
    console.log("State = " + state.value);
};

const onMoveastock = () => {
    state.value = 4;
    getCategories();
    getAllShops()
}

const moveStock = () => {
    loading.value = true
    http.fetch("moveStock", {
        method: "post",
        body: {
            product_id: selectedProduct.value,
            branch: selectedBranch.value,
            type: type.value,
            quantity: quantity.value
        }
    })
    .then(res => {
        useToast().success(res.message)
    })
    .catch(err => {
        useToast().error(err.data.message)
    })
    .finally(() => {
        loading.value = false
    })
}

interface FormData {
    quantity: Field<string>;
    type: Field<string>;
}
const { form, validating, validateFields, resetFields } =
    useValidation<FormData>({
        quantity: {
            $value: "",
            $rules: [rules.required("Please quantity must be provided")],
        },
        type: {
            $value: "",
            $rules: [rules.required("Please type must be choosed")],
        },
    });

async function saveData() {
    loading.value = true

    const formData = await validateFields();
    http
        .fetch("adding_stock_item", {
            method: "POST",
            body: {
                product_id: selectedProduct.value
                ,type: formData.type
                ,quantity: formData.quantity
                ,category: selectedCategory.value.title
            },
        })
        .then((res: any) => {
            if (res.status == 200) {
                useToast().success(res.message);
                loadStockProducts();
                state.value = 1;
            } else {
                useToast().error(res.message);
            }
        })
        .catch((error) => {
            console.log(error);
            useToast().error(error.message);
        })
        .finally();
}


function loadProductByCategory(id: any) {
    loading.value = true;
    let formData = new FormData();
    formData.append("id", id.toString());
    http
        .fetch("get_product_by_category", {
            method: "POST",
            body: formData,
        })
        .then((data: any) => {
            if (data.status == 200) {
                products.value = data.data;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

function getAllShops() {
    http.fetch("get_all_Shops")
        .then(res => {
            branches.value = res
        })
        .catch(err => {
            console.log(err.response.message);

        })
}


//EDITTING

const editingItem = reactive({
    product: "",
    product_id: "",
    photo: "",
    in_stock: "",
    emptyCylinder: "",
    stock_return: "",
    new_stock_in: 0,
    new_stock_out: 0,
    new_stock_return: 0,
    id: 0,
});

const editItem = (val: Item) => {
    isEditing.value = true;
    getCategories();

    state.value = 3;
    const { product_id, product, photo, in_stock, emptyCylinder, stock_return, id } =
        val;
    editingItem.product_id = product_id;
    editingItem.product = product;
    editingItem.photo = photo;
    editingItem.in_stock = in_stock;
    editingItem.emptyCylinder = emptyCylinder;
    editingItem.stock_return = stock_return;
    editingItem.id = id;
};
</script>
