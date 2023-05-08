
<template>
    <v-row>
        <v-col cols="12" md="4">
            <UiParentCard title="New Products">
                <form role="form" @submit.prevent="handleSubmit">
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

                        <v-select label="Category" variant="outlined" density="compact" color="primary"
                            :items="['Accessories', 'Gas']"></v-select>

                        <v-text-field variant="outlined" density="compact" label="Product In KG"
                            v-model="form.productKg.$value" @blur="form.productKg.$validate()" color="primary"
                            :error-messages="form.productKg.$errors"></v-text-field>


                        <v-text-field variant="outlined" density="compact" label="Price" v-model="form.productPrice.$value"
                            @blur="form.productPrice.$validate()" color="primary"
                            :error-messages="form.productPrice.$errors"></v-text-field>

                        <v-textarea variant="outlined" :error-messages="form.productDesc.$errors" density="compact"
                            label="Description" v-model="form.productDesc.$value" @blur="form.productDesc.$validate()"
                            color="primary"></v-textarea>


                        <v-btn @click.prevent="saveData" :disabled="loading" class="my-4" color="primary" size="large"
                            block flat>{{
                                loading ? 'Creating Item...' : 'Create Product' }}</v-btn>

                    </v-col>
                </form>
            </UiParentCard>
        </v-col>
        <v-col cols="12" md="8">
            <UiParentCard title="List Products">

            </UiParentCard>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Field, useValidation } from "vue3-form-validation";
import { rules } from "~/utils/rules";
import { useHttpRequest } from '~~/composables/useHttpRequest';
import UiParentCard from '@/components/shared/UiParentCard.vue';
definePageMeta({
    layout: "admin",
});
const url = useHttpRequest();
interface FormData {
    productName: Field<string>;
    productPrice: Field<string>;
    productKg: Field<string>;
    productDesc: Field<string>;
    fileRecords: Field<File[]>;
    gas: Field<boolean>;
}

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
const loading = ref(false);
const products = ref([])

const getPosts = async () => {
    const { data } = await useFetch('http://localhost:8080/web/api/v1/products', {
        method: 'GET',
        // body: JSON.stringify(form)
    })
    // @ts-ignore
    products.value = data || []
}
onMounted(getPosts)
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

async function saveData() {
    await $fetch('create_product', { 
            method: 'POST',
            baseURL: 'http://192.168.1.69:8080/api/web/v1/',
            body: {
                'message': "",
                'name': ""
            }
        } ).then((res) => {
            console.log('====================================');
            console.log(res);
            console.log('====================================');
        })
}

</script>