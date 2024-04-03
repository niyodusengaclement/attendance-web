<template>
    <v-row>
        <!--UPDATE STOCK -->
        <v-col cols="12" v-show="state == 3" :md="state == 1 ? 12 : 4">
            <UiParentCard title="Update Product Stock ">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="tonal" elevation="0" @click="reset()">
                </v-btn>
                <form role="form">
                    <v-col cols="12">

                        <v-text-field disabled="true" variant="outlined" density="compact" label="Product"
                            v-model="editingItem.product" color="primary"></v-text-field>

                        <v-select label="Select Stock type" v-if="selectedProduct.is_gas == '1'"
                            v-model="form.type.$value" :items="stockType" variant="outlined"
                            @blur="form.type.$validate()" density="compact" color="primary" item-title="text"
                            :error-messages="form.type.$errors" item-value="value"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Number of Items"
                            v-model="form.quantity.$value" @blur="form.quantity.$validate()" color="primary"
                            :error-messages="form.quantity.$errors"></v-text-field>

                        <div class="flex justify-between space-x-4">
                            <v-btn @click="state = 1" class="my-4" color="error" variant="outlined" size="large" flat>
                                Close
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
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="tonal" elevation="0" @click="reset()">
                </v-btn>
                <form role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-select label="Select Category" variant="outlined" density="compact"
                            v-model="selectedCategory" color="primary" :items="categories" item-title="title"
                            item-value="id" @update:modelValue="loadProductByCategory(selectedCategory.id)"
                            return-object></v-select>

                        <v-select label="Select product" v-model="selectedProduct" :items="products" variant="outlined"
                            density="compact" color="primary" item-title="text" item-value="value" return-object
                            @update:model-value="form.type.$value = '2'"></v-select>

                        <v-select label="Select Stock type" v-if="selectedProduct.is_gas == '1'"
                            v-model="form.type.$value" :items="stockType" variant="outlined"
                            @blur="form.type.$validate()" density="compact" color="primary" item-title="text"
                            :error-messages="form.type.$errors" item-value="value"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Number of Items"
                            v-model="form.quantity.$value" @blur="form.quantity.$validate()" color="primary"
                            :error-messages="form.quantity.$errors"></v-text-field>

                        <v-btn @click.prevent="saveData" :disabled="loading" class="my-4" color="primary" size="large"
                            block flat>{{ loading ? "updating Item..." : "Update Stock" }}</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <!--MOVE STOCH TO ANOTHER SHOP-->
        <v-col cols="12" v-show="state == 4" :md="state == 1 ? 12 : 4">
            <UiParentCard title="Moving Product to branch">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="tonal" elevation="0" @click="reset()">
                </v-btn>
                <form role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-select label="Select Category" variant="outlined" density="compact"
                            v-model="selectedCategory" color="primary" :items="categories" item-title="title"
                            item-value="id" @update:modelValue="loadProductByCategory(selectedCategory.id)"
                            return-object></v-select>

                        <v-select label="Select product" v-model="selectedProduct" :items="products" variant="outlined"
                            density="compact" color="primary" item-title="text" item-value="value"></v-select>
                        <v-select label="Select branch" v-model="selectedBranch" :items="branches" variant="outlined"
                            density="compact" color="primary" item-title="shop_name" item-value="id"></v-select>

                        <v-select label="Select Stock type" v-if="selectedCategory.title === 'Gas'" v-model="type"
                            :items="MoveType" variant="outlined" density="compact" color="primary" item-title="text"
                            item-value="value"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Number of Items" v-model="quantity"
                            color="primary"></v-text-field>

                        <v-btn @click.prevent="moveStock" :disabled="loading" :loading="loading" class="my-4"
                            color="primary" size="large" block flat>{{ loading ? "Moving Stock..." : "Move to branch"
                            }}</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <!-- REQUEST STOCK FROM MAIN-->
        <v-col cols="12" v-show="state == 5" :md="state == 1 ? 12 : 4">
            <UiParentCard title="Form to request stock from Headquater">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="tonal" elevation="0" @click="reset()">
                </v-btn>

                <v-list lines="two">
                    <v-list-subheader>Selected Products</v-list-subheader>

                    <v-list-item v-for="(item,i) in productToRequest" :key="item.id" :subtitle="(item.type == '1' ? 'Refilling' : 'New Stock') + ' / ' + item.quantity" :title="item.text">

                        <template v-slot:append>
                            <v-btn color="error" variant="tonal" size="small" icon="mdi-delete" flat @click="removeItem(i)"></v-btn>
                        </template>
                    </v-list-item>
                </v-list>

                <form role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-card class="px-3 py-3">
                            <v-select label="Select Category" variant="outlined" density="compact"
                                v-model="selectedCategory" color="primary" :items="categories" item-title="title"
                                item-value="id" @update:modelValue="loadProductByCategory(selectedCategory.id)"
                                return-object></v-select>
                            <v-autocomplete
                                :custom-filter="customFilter"
                                label="Select product" v-model="selectedProduct" :items="products" variant="outlined"
                                density="compact" color="primary" @update:model-value="selectedProduct.type = '2'" item-title="text" item-value="value" return-object
                            ></v-autocomplete>
    
                            <v-select label="Select Stock type" v-if="selectedProduct.is_gas == '1'"
                                v-model="selectedProduct.type" :items="stockType" variant="outlined"
                                 density="compact" color="primary" item-title="text"
                                item-value="value"></v-select>
    
                            <v-text-field variant="outlined" density="compact" label="Number of Items"
                                v-model="selectedProduct.quantity" color="primary"></v-text-field>
                                <v-row justify="end">
                                    <v-btn class="m-13" @click.prevent="addProduct" :disabled="loading" variant="tonal" color="info" size="small"
                                    flat>Add Product</v-btn>
                                </v-row>
                        </v-card>
                        <v-btn @click.prevent="requestProducts" :disabled="loading || productToRequest.length === 0" :loading="loading" class="my-4" color="primary" size="large"
                                block flat>{{ loading ? "updating Item..." : "Send Order" }}</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <!-- STOCK BALANCE -->
        <v-col cols="12" :md="state != 1 ? 8 : 12">
            <UiParentCard title="Inventory Products">
                <v-card-text>
                    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
                        <v-tab @click="loadStockProducts('ALL')" :value="1">All Products
                            <v-chip size="small" class="ma-1"> {{ lists.length ?? 0 }} </v-chip>
                        </v-tab>
                        <!-- <v-tab @click="loadStockProducts(3)" :value="2">Available Stock
                            <v-chip size="small" class="ma-1"> 0 </v-chip>
                        </v-tab> -->
                        <!-- <v-tab @click="loadStockProducts('2')" :value="3">Low On Stock
                            <v-chip size="small" class="ma-1"> 0 </v-chip></v-tab> -->
                        <v-tab @click="loadStockProducts('OUTOFSTOCK')" :value="2">Out of Stock
                            <v-chip size="small" class="ma-1"> 0 </v-chip></v-tab>
                        <!-- <v-tab @click="loadStockProducts('RETURNSTOCK')" :value="3">Return in Stock
                            <v-chip size="small" class="ma-1"> 0 </v-chip></v-tab> -->
                    </v-tabs>
                    <v-container>
                        <v-card class="mx-auto bg-gray" flat color="grey-lighten-4">
                            <v-row>
                                <v-col cols="12" md="8">
                                    <v-row>
                                        <!-- <v-col cols="12" md="3">
                                            <FilterDataTable :label="'Filter By'" :filters="[{ title: 'Low Stock' }]" />
                                        </v-col> -->
                                        <v-col cols="12" md="7">
                                            <v-text-field variant="outlined" v-model="search" :loading="loading"
                                                outlined density="compact" label="Search by product name"
                                                prepend-inner-icon="mdi-magnify" single-line hide-details
                                                @click:prepend-inner="onSearchData">
                                            </v-text-field></v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" md="4" class="flex justify-end">
                                    <v-btn v-if="state != 2 && logger.category == '1'" prepend-icon="mdi-plus"
                                        color="primary" class="mx-2" variant="tonal" @click="onAddStockData">
                                        Add Stock
                                    </v-btn>
                                    <form :action="download" method="post" target="_blank">
                                        <input type="hidden" name="type" v-model="slctdType">
                                        <v-btn prepend-icon="mdi-microsoft-excel" color="success" class="mx-2"
                                            variant="tonal" type="submit">
                                            Export
                                        </v-btn>
                                    </form>
                                    <v-btn v-if="false" prepend-icon="mdi-export"
                                        color="info" class="mx-2" variant="tonal" @click="onMoveastock()">
                                        Move Stock
                                    </v-btn>
                                    <v-btn v-if="state != 5 && logger.category == '2'" prepend-icon="mdi-export"
                                        color="error" class="mx-2" variant="tonal" @click="state = 5;getCategories()">
                                        Request Stock
                                    </v-btn>
                                    <v-btn prepend-icon="mdi-export"
                                        color="Warning" class="mx-2" variant="tonal" to="/stock/requests">
                                        Stock Requests
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-container>
                    <v-window v-model="tab">
                        <v-window-item v-for="n in 3" :key="n" :value="n">
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
const slctdType = ref("")
const branches = ref([]);
const productToRequest = ref([])
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
    { text: "Refilling", value: "1" },
    { text: "New stock", value: "2" },
];
const MoveType = [
    { text: "Filled Gas", value: "1" },
    { text: "Empty cylinder", value: "2" },
];
const headers: Header[] = [
    { text: "ID", value: "id", sortable: true },
    { text: "Photo", value: "image_url", sortable: true },
    { text: "Product", value: "product", sortable: true },
    { text: "Stock In", value: "in_stock", sortable: true },
    { text: "Empty Cylinders", value: "emptyCylinder", sortable: true },
    // { text: "Stock Return", value: "stock_return", sortable: true },
    { text: "Status", value: "status", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
];

function loadStockProducts(type = '') {
    loading.value = true;
    slctdType.value = type
    let formData = new FormData();
    formData.append("type", type);
    http
        .fetch("get_stock_products/0", {
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

function removeItem(id: any) {
    productToRequest.value.splice(id,1)
}

const statusStr = (status: any) => {
    if (status >= 500) {
        return "Full STOCK";
    } else if (status < 500 && status > 100) {
        return "Medium";
    } else if (status < 100 && status > 10) {
        return "Lower Stock";
    } else if (status < 10 && status > 1) {
        return "Critical low";
    } else {
        return "Empty Stock";
    }
};

const statusClr = (status: any) => {
    if (status >= 500) {
        return "success";
    } else if (status < 500 && status > 100) {
        return "primary";
    } else if (status < 100 && status > 10) {
        return "secondary";
    } else if (status < 10 && status > 1) {
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
};
const addProduct = () => {
    productToRequest.value.push(selectedProduct.value)

    selectedProduct.value = ""
}
function requestProducts() {
    loading.value = true
    http.fetch("request-product", {
        method: "post",
        body: {
            products: productToRequest.value
        }
    })
    .then(res => {
        useToast().success(res.message)
        selectedProduct.value = ''
        state.value = 1
        productToRequest.value = []
    }).catch(err => {
        useToast().error(err.data.message)
    })
    .finally(() => {
        loading.value = false
    })
}
const onMoveastock = () => {
    state.value = 4;
    getCategories();
    getAllShops()
}
const download = computed(() => {
    return API_URL + "get_stock_products/1/" + token
})
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
const customFilter = (itemTitle, queryText, item) => {
    const textOne = item.raw.name.toLowerCase()
    const textTwo = item.raw.abbr.toLowerCase()
    const searchText = queryText.toLowerCase()

    return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
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
            $value: "2",
            $rules: [rules.required("Please type must be choosed")],
        },
    });

function reset() {
    resetFields()
    state.value = 1
    selectedProduct.value = ''
    isEditing.value = false
    selectedType.value = ''
    selectedAction.value = ''
    quantity.value = ''
    selectedBranch.value = ''
    type.value = ''
}
async function saveData() {
    loading.value = true

    const formData = await validateFields();
    http
        .fetch("adding_stock_item", {
            method: "POST",
            body: {
                product_id: selectedProduct.value.value
                , type: formData.type
                , quantity: formData.quantity
                , category: selectedProduct.value.is_gas
            },
        })
        .then((res: any) => {
            if (res.status == 200) {
                useToast().success(res.message);
                loadStockProducts();
                state.value = 1;
                reset()
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
    selectedProduct.value = val

    console.log(selectedProduct.value);

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
    selectedProduct.value.value = product_id
};
</script>
<style>
.m-13{
    margin: 13px !important
}
</style>