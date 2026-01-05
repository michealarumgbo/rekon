<script setup>
import Header from '@/components/Header.vue';
import { reactive, ref } from 'vue';

const user = {
    firstname: "Micheal",
    lastname: "Chinedu"
}
const confirmDelete = ref(false)

// Toggle password visibility
function togglePassword(event) {
    const icon = event.target;

    // Go up to .relative container, then find the input inside it
    const wrapper = icon.closest('.relative');
    const input = wrapper.querySelector('input');

    if (!input) return; // safety

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
}
const openDeleteModal = () => {
    confirmDelete.value = true
}
const closeDeleteModal = () => {
    confirmDelete.value = false
}
const deleteAccount = () => {
    alert("Account Deleted")
    confirmDelete.value = false
}
const errors = ref([])
const updateForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
})
const updatePassword = () => {
    errors.value.length = 0
    const { confirmNewPassword, currentPassword, newPassword } = updateForm

    if (confirmNewPassword == '', currentPassword == '', newPassword == '') {
        return errors.value.push('All fields must be filled')
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_]).{8,40}/.test(newPassword)) {
        return errors.value.push("Password must be atleast 8 characters and must contain atleast a number, 1 uppercase, lowercase, and a special character")
    }

    if (confirmNewPassword != newPassword) {
        return errors.value.push("Passwords must match")
    }

    console.log({ ...form })
}
</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Header -->
        <Header :user="user" />

        <div class="container mx-auto px-4 py-8 max-w-2xl">
            <!-- Page Title -->
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-gray-800">Account Settings</h1>
                <p class="text-gray-600">Manage your REKON account security</p>
            </div>

            <!-- Update Password Form -->
            <div class="bg-white rounded-xl shadow-md p-6 mb-8">
                <div class="flex items-center mb-6">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <i class="fas fa-lock text-indigo-600"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-800">Update Password</h2>
                </div>

                <form @submit.prevent="updatePassword" class="space-y-4">

                    <p v-if="errors.length != 0" v-for="error in errors" class="text-red-500 mb-3">
                        Error {{ error }}
                    </p>

                    <!-- Current Password -->
                    <div>
                        <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>

                        <div class="relative">
                            <input v-model="updateForm.currentPassword" name="currentPassword" type="password"
                                id="currentPassword" autocomplete="current-password"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your current password">

                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <i class="fas fa-eye-slash text-gray-400 cursor-pointer"
                                    @click="togglePassword($event)"></i>
                            </div>
                        </div>
                    </div>

                    <!-- New Password -->
                    <div>
                        <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>

                        <div class="relative">
                            <input v-model="updateForm.newPassword" name="newPassword" type="password"
                                autocomplete="newPassword"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your new password">

                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <!-- ADDED CLICK HANDLER -->
                                <i class="fas fa-eye-slash text-gray-400 cursor-pointer"
                                    @click="togglePassword($event)"></i>
                            </div>
                        </div>

                        <p class="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                    </div>

                    <!-- Confirm Password -->
                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>

                        <div class="relative">
                            <input v-model="updateForm.confirmNewPassword" autocomplete="confirmPassword"
                                name="confirmPassword" type="password"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Confirm your new password">

                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <!-- ADDED CLICK HANDLER -->
                                <i class="fas fa-eye-slash text-gray-400 cursor-pointer"
                                    @click="togglePassword($event)"></i>
                            </div>
                        </div>
                    </div>

                    <div class="pt-2">
                        <button type="submit"
                            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                            <i class="fas fa-key mr-2"></i>Update Password
                        </button>
                    </div>
                </form>
            </div>

            <!-- Delete Account Section -->
            <div class="bg-white rounded-xl shadow-md p-6 border border-red-200">
                <div class="flex items-center mb-6">
                    <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <i class="fas fa-exclamation-triangle text-red-600"></i>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-800">Delete Account</h2>
                </div>

                <div class="mb-6">
                    <p class="text-gray-700 mb-4">
                        Once you delete your account, there is no going back. This action is permanent and will remove
                        all your data from REKON.
                    </p>

                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p class="text-red-700 font-medium flex items-center">
                            <i class="fas fa-exclamation-circle mr-2"></i>
                            Warning: This action cannot be undone
                        </p>
                    </div>
                </div>

                <button @click="openDeleteModal"
                    class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                    <i class="fas fa-trash-alt mr-2"></i>Delete My Account
                </button>
            </div>

            <!-- Delete Account Confirmation Modal -->
            <div v-if="confirmDelete" class="fixed inset-0 bg-black/78 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl shadow-lg p-6 max-w-md mx-4">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-3"> <i
                                class="fas fa-exclamation-triangle text-red-600 text-xl"></i> </div>
                        <h3 class="text-xl font-bold text-gray-800">Confirm Account Deletion</h3>
                    </div>
                    <p class="text-gray-700 mb-6">Are you sure you want to delete your account? This action is permanent
                        and cannot be undone.</p>
                    <div class="flex space-x-4">
                        <button @click="closeDeleteModal"
                            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200">
                            Cancel
                        </button>
                        <button @click="deleteAccount"
                            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
