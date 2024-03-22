<template>
    <v-row>
        <v-col cols="12" v-show="state == 2" md="4">
            <UiParentCard :title="'Add Brand'" class="text-success">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="text" elevation="0" @click="reset()">
                </v-btn>
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Brand"
                            v-model="editingItem.title" color="primary"></v-text-field>

                        <v-btn :disabled="loading" :loading="loading" @click="createBrand()" class="my-2"
                            color="primary" size="large" block flat>Save Brand</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <!-- EDITTING EXISTING RECORD -->
        <v-col cols="12" v-show="state == 3" md="4">
            <UiParentCard :title="'Editing Record '" class="text-success">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="text" elevation="0" @click="reset()">
                </v-btn>
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-text-field variant="outlined" density="compact" label="Title" v-model="editingItem.title"
                            color="primary"></v-text-field>

                        <v-btn :disabled="loading" :loading="loading" @click="createBrand()" class="my-2" color="success"
                            size="large" block flat>Update Brand</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <!-- ADD NEW RECORD -->
        <v-col cols="12" v-show="state == 4" md="4">
            <UiParentCard :title="'Add Brand'" class="text-success">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="text" elevation="0" @click="reset()">
                </v-btn>
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <!-- <v-img aspect-ratio="1/1" :src="image_URL + editingItem.image_url" max-height="125"
                            class="bg-grey-lighten-2 border rounded-lg my-5"></v-img> -->
                        <v-text-field variant="outlined" density="compact" label="Brand" disabled="true"
                            v-model="editingItem.title" color="primary"></v-text-field>
                        <v-text-field variant="outlined" density="compact" label="Brand"
                            v-model="editingItem.brand" color="primary"></v-text-field>

                        <v-btn :disabled="loading" :loading="loading" @click="createSubCategory()" class="my-2"
                            color="primary" size="large" block flat>Save Subcategory</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" :md="state == 1 ? '12' : '8'">
            <UiParentCard title="List Categories">
                <v-card-text>
                    <v-row class="mb-4">
                        <v-col cols="12" md="8">
                            <v-text-field v-model="search" :loading="loading" variant="outlined" density="compact"
                                label="Search for Title or Something" prepend-inner-icon="mdi-magnify" single-line
                                hide-details>
                            </v-text-field>
                        </v-col>
                        <v-col class="flex" cols="12" md="4">
                            <!-- <v-btn prepend-icon="mdi-vuetify" color="primary" class="mx-2" variant="outlined">
                                Filters
                            </v-btn> -->
                            <v-btn prepend-icon="mdi-plus" @click="state = 2" :disabled="state != 1" color="success" class="mx-2" variant="tonal">
                                Add New
                            </v-btn>
                        </v-col>
                    </v-row>
                    <ClientOnly>
                        <EasyDataTable empty-message="No Product found" :search-value="search" theme-color="#f97316"
                            table-class-name="eztable" :headers="headers" :items="brands" :loading="loading">
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
                    <v-dialog v-model="isDeleting" persistent width="auto">
                        <v-card>
                            <v-card-title class="text-h5"> Delete </v-card-title>
                            <v-card-text>
                                <div class="text-lg text-center justify-center">
                                    Are you want to delete
                                    <span class="font-bold"> {{ editingItem.title }} </span>
                                    ?
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" variant="text" class="mx-1" prepend-icon="mdi-close"
                                    @click="isDeleting = false">
                                    Cancel
                                </v-btn>
                                <v-btn :loading="btnDeleteLoading" elevation="10" variant="outlined" color="error"
                                    class="mx-1" prepend-icon="mdi-delete" @click="deleteBrand(editingItem.id)">
                                    Delete
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="isViewing" persistent width="auto">
                        <v-card width="450">
                            <v-card-title color="success" class="text-h5 text-info pa-6">
                                {{ editingItem.title }} Subcategory
                            </v-card-title>
                            <v-card-text>
                                <table
                                    class="d-flex flex-col space-y-3 rounded-lg table-fixed border-collapse border border-slate-500">
                                    <thead class=" bg-borderColor rounded-t-lg  px-8 py-2">
                                        <tr class="d-flex justify-between w-full">
                                            <th class=" items-center align-center text-center order border-slate-600">
                                                Title
                                            </th>
                                            <th class="items-center align-center text-center order border-slate-600">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="justify-between w-full d-flex  " v-for="(item, i) in sub_categories"
                                            :key="i">
                                            <td class="px-8 py-1   border-slate-200">{{ item.title }}</td>
                                            <td class="px-8 py-1   border-slate-200">
                                                <v-btn size="small" variant="text"
                                                    @click="deleteSubBrand(item.id, item.title)" color="error">
                                                    delete</v-btn>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" variant="text" :loading="btnDeleteLoading" class="mx-1"
                                    prepend-icon="mdi-close" @click="isViewing = false">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-text>
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
if (process.client) {
    token = localStorage.getItem("token");
}
const http = useHttpRequest();
const instance = getCurrentInstance();
const image_URL = config.public.imageURL;
// const image_URL = process.env.IMAGE_URL;
interface FormData {
    productName: Field<string>;
}

const { form, validateFields, resetFields } = useValidation<FormData>({
    productName: {
        $value: "",
        $rules: [rules.required("Please name must be provided")],
    },
});
const state = ref(1);
const loading = ref(false);
const isViewing = ref(false);
const btnDeleteLoading = ref(false);
const isEditing = ref(false);
const isDeleting = ref(false);
const brands = ref([]);
const search = ref("");


onMounted(() => {
    getBrands();
});
async function handleSubmit() {
    try {
        const formData = await validateFields();
    } catch (e) {
    }
}
function reset() {
    resetFields()
    state.value = 1
}



const headers: Header[] = [
    // { text: "Photo", value: "image_url", sortable: true },
    { text: "Brand", value: "title", sortable: true },
    { text: "Products Used In", value: "products", sortable: true },
    { text: "Date created", value: "date", width: 300 },
    { text: "Actions", value: "actions", width: 300 },
];

const editingItem = reactive({
    image_url: "",
    title: "",
    brand: "",
    id: 0,
});

const editItem = (val: Item) => {
    isEditing.value = true;
    state.value = 3;
    const { image_url, title, id } = val;
    editingItem.image_url = image_url;
    editingItem.title = title;
    editingItem.id = id;
};
const deleteItem = (val: Item) => {
    isDeleting.value = true;
    const { title, id } = val;
    editingItem.title = title;
    editingItem.id = id;
};

async function updateBrand() {
    loading.value = true;
    var formDataUpdate = new FormData();

    formDataUpdate.append("id", editingItem.id.toString());
    formDataUpdate.append("category", editingItem.title);
    http
        .fetch("create_category", {
            method: "post",
            body: formDataUpdate,
        })
        .then((data: any) => {
            useToast().success(data.message);
            getBrands();
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

async function createBrand() {
    loading.value = true;
    http
        .fetch("create_sub_category", {
            method: "post",
            body: {
                id: editingItem.id,
                title: editingItem.title
            },
        })
        .then((data: any) => {
            useToast().success(data.message);
            getBrands();
        })
        .catch((data: any) => {
            useToast().error(data.data.message);
        })
        .finally(() => {
            loading.value = false;
            editingItem.brand = ""
        });
}
function getBrands() {
    http
        .fetch("all_sub_categories", {
            method: "post",
            body: {
                limit: 10
            },
        })
        .then((data: any) => {
            if (data.status == 200) {
                brands.value = data.data;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

function deleteBrand(id: any, title: any) {
    btnDeleteLoading.value = true;

    http
        .fetch("delete_sub_category", {
            method: "post",
            body: {
                title: title.toString(),
                id: id.toString()
            },
        })
        .then((data: any) => {
            useToast().success(data.message);
            getBrands();
        })
        .catch((data: any) => {
            useToast().error("Error " + data.message);
        })
        .finally(() => {
            btnDeleteLoading.value = false;
            isViewing.value = false;
        });
}

</script>
