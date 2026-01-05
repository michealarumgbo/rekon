<script setup>
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import router from '@/router';
const { logIn } = useUserStore()

const form = reactive({
    email: '',
    password: '',
})
const errors = ref([])
const handleSubmit = async () => {
    errors.value.length = 0
    const { email, password } = form

    if (email.trim() == '' || password.trim() == '') {
        return errors.value.push("All fields must be filled")
    }

    if (!/^([A-Za-z0-9._%+-]+)@[a-z0-9-]{3,}\.[a-z]{2,}(\.[a-z]{2,})?$/.test(email)) {
        return errors.value.push("Enter a valid email")
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_]).{8,40}/.test(password)) {
        return errors.value.push("Password must be atleast 8 characters and must contain atleast a number, 1 uppercase, lowercase, and a special character")
    }

    const data = await logIn({ ...form })
    if (data.error) {
        return errors.value.push(data.error)
    } else {
        router.push('/verify-email')
    }
    console.log(data)

    // console.log({ ...form })
}
</script>

<template>
    <div class="gradient-bg min-h-screen flex  items-center justify-center p-4">
        <div class="max-w-md w-full space-y-8">
            <!-- Header -->
            <div class="text-center">
                <div class="flex items-center justify-center mb-4">
                    <div class="w-12 h-12 p-1 rounded-full bg-white flex items-center justify-center mr-3">
                        <img src="../assets/images/logo.png" alt="">
                    </div>
                    <h1 class="text-3xl font-bold text-white">REKON</h1>
                </div>
                <p class="mt-2 text-indigo-100">Login to to customize your account...</p>
            </div>


            <!-- Admin login Form -->
            <div class="form-container rounded-2xl shadow-2xl p-8">
                <form @submit.prevent="handleSubmit" class="mt-8 space-y-5">
                    <div class="space-y-4">
                        <p v-if="errors.length != 0" v-for="error in errors" class="text-red-500 mb-3">Error {{ error }}
                        </p>


                        <!-- Email -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                            <div class="mt-1 relative">
                                <input v-model="form.email" name="email" type="email"
                                    class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                                    placeholder="Enter your email address">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <i class="fas fa-envelope text-gray-400"></i>
                                </div>
                            </div>
                        </div>


                        <!-- Password -->
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                            <div class="mt-1 relative">
                                <input v-model="form.password" name="password" type="password"
                                    class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                                    placeholder="Enter your Password">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <i class="fas fa-lock text-gray-400"></i>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Submit Button -->
                    <div>
                        <button type="submit"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                <i class="fas fa-user-plus text-indigo-300 group-hover:text-indigo-200"></i>
                            </span>
                            Login
                        </button>
                    </div>

                    <p class="text-sm text-gray-700">Don't have an account? <a class="text-indigo-600" href="/">Sign
                            Up</a></p>
                </form>
            </div>

        </div>
    </div>
</template>
<style scoped></style>