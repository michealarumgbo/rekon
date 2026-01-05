<template>
    <div class="w-full">
        <!-- Header -->
        <header class="bg-indigo-600 text-white shadow-md">
            <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full p-1 bg-white flex items-center justify-center mr-3">
                        <img src="@/assets/images/logo.png" alt="">
                    </div>
                    <h1 class="text-xl font-bold">REKON</h1>
                </div>
                <div v-if="user" class="flex items-center  space-x-4">
                    <span class="hidden md:flex text-indigo-100">Welcome, {{ user.firstname + " " + user.lastname
                    }}</span>
                    <button @click="logoutFunction"
                        class="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg transition duration-200">
                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                </div>
            </div>
        </header>
    </div>
</template>

<script setup>
import router from '@/router';

const logoutFunction = () => {
    router.push('/logout')
}

const { user } = defineProps(['user'])
</script>

<style scoped></style>