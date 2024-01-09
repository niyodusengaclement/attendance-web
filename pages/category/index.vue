<template>
    <v-row>
        <v-col cols="12" v-show="state == 1" md="4">
            <UiParentCard parentTitle="Category" title="Add Category">
                <form role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <div v-if="!file" class="mt-5">
                            <toast />
                            <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
                                @dragleave="dragging = false">
                                <div class="dropZone-info" @drag="onChange">
                                    <div class="d-flex flex-col items-center justify-center">
                                        <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                                            </path>
                                        </svg>
                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="font-semibold">Click to upload </span> or
                                            drag and drop
                                        </p>
                                    </div>
                                </div>
                                <input type="file" @change="onChange" />
                            </div>
                        </div>
                        <div v-else class="dropZone-uploaded mt-5">
                            <div class="dropZone-uploaded-info">
                                <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                                    </path>
                                </svg>
                                <p v-if="file" class="text-xs py-2 text-gray-500 dark:text-gray-400">
                                    {{ file["name"] }}
                                </p>
                                <v-btn color="error" v-if="file" unelevated @click="removeFile()" variant="tonal"
                                    size="small">
                                    Remove File</v-btn>
                            </div>
                        </div>

                        <v-text-field variant="outlined" density="compact" label="Title" v-model="form.productName.$value"
                            @blur="form.productName.$validate()" color="primary"
                            :error-messages="form.productName.$errors"></v-text-field>

                        <v-btn @click.prevent="createCategory()" :disabled="loading" :loading="loading" class="my-2"
                            color="primary" size="large" block flat>Create Category</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <!-- EDITTING EXISTING RECORD -->
        <v-col cols="12" v-show="state == 3" md="4">
            <UiParentCard :title="'Editing Record '" class="text-success">
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-img aspect-ratio="1/1" :src="image_URL + editingItem.image_url" max-height="125"
                            class="bg-grey-lighten-2 border rounded-lg my-5"></v-img>
                        <v-text-field variant="outlined" density="compact" label="Product" v-model="editingItem.title"
                            color="primary"></v-text-field>



                        <v-btn :disabled="loading" :loading="loading" @click="createCategory()" class="my-2" color="success"
                            size="large" block flat>Update Product</v-btn>

                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" md="8">
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
                            <v-btn prepend-icon="mdi-vuetify" color="primary" class="mx-2" variant="outlined">
                                Filters
                            </v-btn>
                            <v-btn prepend-icon="mdi-plus" @click="state = 1" color="success" class="mx-2" variant="tonal">
                                Add New
                            </v-btn>
                        </v-col>
                    </v-row>
                    <ClientOnly>
                        <EasyDataTable empty-message="No Product found" :search-value="search" theme-color="#f97316"
                            table-class-name="eztable" :headers="headers" :items="categories">
                            <template #item-image_url="item">
                                <v-img :src="image_URL + item.image_url" height="40" class="rounded-lg"></v-img>
                            </template>
                            <template #item-actions="item">
                                <div>
                                    <v-btn size="large" density="compact" variant="tonal" color="primary" class="mx-1"
                                        icon="mdi-pencil" @click="editItem(item)"></v-btn>

                                    <v-btn size="large" density="compact" variant="tonal" color="error" class="mx-1"
                                        icon="mdi-delete" @click="deleteItem(item)">
                                    </v-btn>
                                </div>
                            </template>
                        </EasyDataTable>
                    </ClientOnly>
                    <v-dialog v-model="isDeleting" persistent width="auto">

                        <v-card>
                            <v-card-title class="text-h5">
                                Delete
                            </v-card-title>
                            <v-card-text>
                                <div class="text-lg text-center justify-center">
                                    Are you want to delete
                                    <span class="font-bold"> {{ editingItem.title }} </span>
                                    ?
                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="error" variant="text" class="mx-1" prepend-icon="mdi-close"
                                    @click="isDeleting = false">
                                    Cancel
                                </v-btn>
                                <v-btn :loading="btnDeleteLoading" elevation="10" variant="tonal" color="error" class="mx-1"
                                    prepend-icon="mdi-delete" @click="deleteCategory(editingItem.id)">
                                    Delete
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
const selectedCategory = ref("");
const productType = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
];
const http = useHttpRequest();
const instance = getCurrentInstance();
const API_URL = config.public.apiUrl;
const image_URL = "http://192.168.1.77:8080/assets/images/";
interface FormData {
    productName: Field<string>;
}

const { form, validateFields, resetFields } = useValidation<FormData>({
    productName: {
        $value: "",
        $rules: [rules.required("Please name must be provided")],
    },
});
const state = ref(1)
const loading = ref(false);
const btnDeleteLoading = ref(false);
const isEditing = ref(false);
const isDeleting = ref(false);
const categories = ref([]);
const search = ref("");
let file = ref("");
let dragging = ref(false);

function onChange(e: any) {
    let files = e.target.files || e.dataTransfer.files;

    if (!files.length) {
        dragging.value = false;
        return;
    }
    if (files.size > 1000000) {
        useToast().error("Document exceed file size limit of 60000");
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
}

onMounted(() => {
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

function deleteCategory(id: any) {
    btnDeleteLoading.value = true;

    var formData = new FormData();
    formData.append("title", editingItem.title);
    formData.append("id", editingItem.id.toString());
    http
        .fetch("delete_category", {
            method: "post",
            body: formData
        })
        .then((data: any) => {
            useToast().success(data.message);
            getCategories();
        })
        .catch((data: any) => {
            useToast().error("Error " + data.message);
        })
        .finally(() => {
            btnDeleteLoading.value = false;
            isDeleting.value = false;
        });
}

const headers: Header[] = [
    { text: "Photo", value: "image_url", sortable: true },
    { text: "Category", value: "title", sortable: true },
    { text: "Sub Category", value: "count_subcategory", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
];

const editingItem = reactive({
    image_url: "",
    title: "",
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

async function createCategory() {
    loading.value = true;
    var formData = new FormData();
    var formDataUpdate = new FormData();
    formData.append("category", form.productName.$value);
    formData.append("image", file.value);
    formData.append("id", "");
    formDataUpdate.append("id", editingItem.id.toString());
    formDataUpdate.append("category", editingItem.title);
    http
        .fetch("create_category", {
            method: "post",
            body: isEditing ? formDataUpdate : formData,
        })
        .then((data: any) => {
            useToast().success(data.message);
            getCategories();
        })
        .catch((data: any) => {
            useToast().error("Error " + data.message);
            console.log(data);
        })
        .finally(() => {
            loading.value = false;
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
</script>
