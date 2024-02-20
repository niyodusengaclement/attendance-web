<template>
    <v-row>
        <v-col cols="12" v-show="state == 2" md="4">
            <UiParentCard parentTitle="Category" title="Add Category">
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="text" elevation="0" @click="reset()">
                </v-btn>
                <form role="form" @submit.prevent="handleSubmit">

                    <v-img class="rounded-lg " height="100" :src="selectedFiles.length >= 1
                        ? selectedFiles[0].url
                        : '/images/placeholder.jpg'
                        "></v-img>
                    <v-col cols="12">
                        <div v-if="!file" class="mt-5">
                            <toast />
                            <div :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true"
                                @dragleave="dragging = false">
                                <div class="dropZone-info" @drag="onFileSelect">
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
                                <input type="file" @change="onFileSelect" />
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
                <v-btn icon="mdi-close" color="error" class="close-btn" variant="text" elevation="0" @click="reset()">
                </v-btn>
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-img aspect-ratio="1/1" :src="image_URL + editingItem.image_url" max-height="125"
                            class="bg-grey-lighten-2 border rounded-lg my-5"></v-img>
                        <v-text-field variant="outlined" density="compact" label="Title" v-model="editingItem.title"
                            color="primary"></v-text-field>

                        <v-btn :disabled="loading" :loading="loading" @click="updateCategory()" class="my-2" color="success"
                            size="large" block flat>Update Category</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <!-- ADD NEW RECORD -->
        <v-col cols="12" v-show="state == 4" md="4">
            <UiParentCard :title="'Add Sub Category'" class="text-success">
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">
                        <v-img aspect-ratio="1/1" :src="image_URL + editingItem.image_url" max-height="125"
                            class="bg-grey-lighten-2 border rounded-lg my-5"></v-img>
                        <v-text-field variant="outlined" density="compact" label="Category" disabled="true"
                            v-model="editingItem.title" color="primary"></v-text-field>
                        <v-text-field variant="outlined" density="compact" label="Sub category"
                            v-model="editingItem.sub_category" color="primary"></v-text-field>

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
                            <v-btn prepend-icon="mdi-vuetify" color="primary" class="mx-2" variant="outlined">
                                Filters
                            </v-btn>
                            <v-btn prepend-icon="mdi-plus" @click="state = 2" color="success" class="mx-2" variant="tonal">
                                Add New
                            </v-btn>
                        </v-col>
                    </v-row>
                    <ClientOnly>
                        <EasyDataTable empty-message="No Product found" :search-value="search" theme-color="#f97316"
                            table-class-name="eztable" :headers="headers" :items="categories" :loading="loading">
                            <template #item-image_url="item">
                                <v-img :src="image_URL + item.image_url" height="40" class="rounded-lg"></v-img>
                            </template>
                            <template #empty-message>
                                <div class="d-flex justify-center align-center py-3">
                                    <v-img src="/images/products/not_found.png" height="150"></v-img>
                                </div>
                                <p class="text-muted font-weight-light"> No Found</p>
                            </template>
                            <template #item-count_subcategory="item">
                                <div @click="viewSubCategory(item)">
                                    <div
                                        class="font-bold text priamry hover:underline underline-offset-4 hover:cursor-pointer transition duration-200">
                                        {{ item.count_subcategory }}
                                        Subcategories
                                    </div>
                                </div>
                            </template>
                            <template #item-actions="item">
                                <div>
                                    <v-btn size="small" variant="outlined" color="primary" class="mx-1"
                                        @click="addNewItem(item)">
                                        Add new</v-btn>

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
                                    class="mx-1" prepend-icon="mdi-delete" @click="deleteCategory(editingItem.id)">
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
                                                    @click="deleteSubCategory(item.id, item.title)" color="error">
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
const selectedCategory = ref("");
const productType = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
];
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
const categories = ref([]);
const sub_categories = ref([]);
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
    selectedFiles.value = [];
}
function reset() {
    resetFields()
    file.value = ''
    state.value = 1
    selectedFiles.value = []
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



const headers: Header[] = [
    { text: "Photo", value: "image_url", sortable: true },
    { text: "Category", value: "title", sortable: true },
    { text: "Sub Category", value: "count_subcategory", sortable: true },
    { text: "Actions", value: "actions", width: 300 },
];

const editingItem = reactive({
    image_url: "",
    title: "",
    sub_category: "",
    id: 0,
});

const addNewItem = (val: Item) => {
    state.value = 4;
    const { image_url, title, id } = val;
    editingItem.image_url = image_url;
    editingItem.title = title;
    editingItem.id = id;
};

const viewSubCategory = (val: Item) => {
    isViewing.value = true;

    const { image_url, title, id } = val;
    editingItem.image_url = image_url;
    editingItem.title = title;
    editingItem.id = id;

    getSubCategories(id);
};
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
    formData.append("category", form.productName.$value);
    formData.append("image", file.value);
    formData.append("id", "");
    http
        .fetch("create_category", {
            method: "post",
            body: formData,
        })
        .then((data: any) => {
            useToast().success(data.message);
            getCategories();
            removeFile();
        })
        .catch((data: any) => {
            useToast().error(data.data.message);
            console.log(data);
        })
        .finally(() => {
            loading.value = false;
            state.value = 1;
            form.productName.$value = "";

        });
}

async function updateCategory() {
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
            getCategories();
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

async function createSubCategory() {
    loading.value = true;
    var formData = new FormData();
    formData.append("category", editingItem.id.toString());
    formData.append("title", editingItem.sub_category);
    http
        .fetch("create_sub_category", {
            method: "post",
            body: formData,
        })
        .then((data: any) => {
            useToast().success(data.message);
            getCategories();
        })
        .catch((data: any) => {
            useToast().error(data.data.message);
            console.log(data);
        })
        .finally(() => {
            loading.value = false;
            editingItem.sub_category = ""
        });
}
function getCategories() {
    loading.value = true;

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

function deleteCategory(id: any) {
    btnDeleteLoading.value = true;

    var formData = new FormData();
    formData.append("title", editingItem.title);
    formData.append("id", id.toString());
    http
        .fetch("delete_category", {
            method: "post",
            body: formData,
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

function deleteSubCategory(id: any, title: any) {
    btnDeleteLoading.value = true;

    var formData = new FormData();
    formData.append("title", title.toString());
    formData.append("id", id.toString());
    http
        .fetch("delete_sub_category", {
            method: "post",
            body: formData,
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
            isViewing.value = false;
        });
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
