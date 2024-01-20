<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { Header, Item } from "vue3-easy-data-table"
import { Field, useValidation } from 'vue3-form-validation';

definePageMeta({
    layout: "admin",
});
const http = useHttpRequest()
const instance = getCurrentInstance();
const search = ref("");
const loading = ref(false);
const isEditing = ref(false);
const isDeleting = ref(false);
const lists = ref([]);

interface FormData {
    names: Field<string>;
    phone: Field<string>;
}

const { form, validateFields, resetFields } = useValidation<FormData>({
    names: {
        $value: "",
        $rules: [rules.required("Please name must be provided")],
    },
    phone: {
        $value: "",
        $rules: [rules.required("Please name must be provided")],
    },
});

const headers: Header[] = [
    { text: "ID", value: "id", sortable: true },
    { text: "Names", value: "names", sortable: true },
    { text: "Phone", value: "phone", sortable: true },
    { text: "Type", value: "type", sortable: true },
    { text: "Code", value: "code", sortable: true },
    { text: "Actions", value: "actions", width: 120 },
]
const state = ref(1);


const editingItem = reactive({
    names: "",
    phone: "",
    code: "",
    type: "",
    document: "",
    id: 0,
});
const editItem = (val: Item) => {
    isEditing.value = true;
    state.value = 3;
    const { names, code, phone, type, document, id } = val;
    editingItem.names = names;
    editingItem.phone = phone;
    editingItem.code = code;
    editingItem.type = type;
    editingItem.id = id;
};
const deleteItem = (val: Item) => {
    isDeleting.value = true;
    const { names, id } = val;
    editingItem.names = names;
    editingItem.id = id;
};

async function createDriver() {
    loading.value = true;
    var formData = new FormData();
    formData.append("names", form.names.$value);
    formData.append("phone", form.phone.$value);
    formData.append("type", editingItem.type);
    http
        .fetch("create_driver", {
            method: "post",
            body: formData,
        })
        .then((data: any) => {
            useToast().success(data.message);
            loadAllDrivers();
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


function loadAllDrivers() {
    loading.value = true
    http.fetch("get_all_drivers")
        .then((data: any) => {
            if (data.status == 200) {
                lists.value = data.drivers;
                instance?.proxy?.$forceUpdate();
            }
        })
        .catch(() => { })
        .finally(() => (loading.value = false));
}

const statusStr = (status: string) => {
    if (status == "1") {
        return "Active";
    } else {
        return "Blocked";
    }
}

const statusClr = (status: string) => {
    if (status == "1") {
        return "success";
    } else {
        return "warning";
    }
}

async function handleSubmit() {
    try {
        const formData = await validateFields();
    } catch (e) {
        console.log(e);
    }
}
onMounted(() => {
    loadAllDrivers();
})

</script>
<template>
    <v-row>
        <!-- ADD NEW RECORD -->
        <v-col cols="12" v-show="state == 2" md="4">
            <UiParentCard :title="'Create Driver'" class="text-success">
                <form ref="myForm" role="form" @submit.prevent="handleSubmit">
                    <v-col cols="12">


                        <v-text-field variant="outlined" density="compact" label="Name" v-model="form.names.$value"
                            @blur="form.names.$validate()" color="primary"
                            :error-messages="form.names.$errors"></v-text-field>
                        <v-text-field variant="outlined" density="compact" label="Phone" v-model="form.phone.$value"
                            @blur="form.phone.$validate()" color="primary"
                            :error-messages="form.phone.$errors"></v-text-field>

                        <v-text-field variant="outlined" density="compact" label="Category" v-model="editingItem.type"
                            color="primary"></v-text-field>

                        <v-btn :disabled="loading" :loading="loading" @click="createDriver()" class="my-2" color="primary"
                            size="large" block flat>Save Driver</v-btn>
                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" :md="state == 1 ? '12' : '8'">
            <UiParentCard parent-title="Dashboard" title="Drivers">
                <v-row class=" flex mb-4 justify-between">
                    <v-col cols="12" md="8">
                        <v-text-field v-model="search" :loading="loading" variant="outlined" density="compact"
                            label="Search for Title or Something" prepend-inner-icon="mdi-magnify" single-line hide-details>
                        </v-text-field>
                    </v-col>
                    <v-col class="flex justify-end" cols="12" md="4">
                        <v-btn prepend-icon="mdi-vuetify" color="primary" class="mx-2" variant="outlined">
                            Filters
                        </v-btn>
                        <v-btn prepend-icon="mdi-plus" @click="state = 2" color="success" class="mx-2" variant="tonal">
                            Add New Driver
                        </v-btn>
                    </v-col>
                </v-row>
                <ClientOnly>
                    <EasyDataTable empty-message="No Order found" :search-value="search" theme-color="#5d87ff"
                        table-class-name="eztable" :headers="headers" buttons-pagination :loading="loading" :items="lists">
                        <template #item-type="item">
                            <v-chip size="small" :color="statusClr(item.type)"> {{ statusStr(item.type) }} </v-chip>
                        </template>
                        <template #item-actions="item">
                            <div class="flex justify-between space-x-3">
                                <v-btn variant="outlined" size="small" color="error"> <v-icon
                                        color="error">mdi-close</v-icon> Block</v-btn>
                            </div>
                        </template>

                        <template #empty-message>
                            <div class="d-flex justify-center align-center py-3">
                                <v-img src="/images/products/not_found.png" height="150"></v-img>
                            </div>
                            <p class="text-muted font-weight-light"> No Found</p>
                        </template>
                    </EasyDataTable>
                </ClientOnly>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
