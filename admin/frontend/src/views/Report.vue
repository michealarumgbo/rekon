<script setup>
import Header from '@/components/Header.vue';
import { reactive, ref, computed } from 'vue';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
const { getAttendance } = useUserStore()

const user = {
    firstname: "Micheal",
    lastname: "Chinedu"
}

const attendanceData = ref();
onMounted(async () => {
    const attendanceRequestData = await getAttendance()
    if (attendanceRequestData?.error) {
        console.log(attendanceRequestData.error)
        return
    }
    console.log(attendanceRequestData.records)
    attendanceData.value = attendanceRequestData.records
})

const errors = ref([])
const date = ref('2022-12-09')
const presentToday = computed(() => {
    return attendanceData.value.filter((data) => data.status.toLowerCase() == 'present').length
})
const absentToday = computed(() => {
    return attendanceData.value.filter((data) => data.status.toLowerCase() == 'absent').length
})
const lateToday = computed(() => {
    return attendanceData.value.filter((data) => data.status.toLowerCase() == 'late').length

})
const searchItem = ref('')
const filteredAttendanceData = ref([])
const search = () => {
    if (searchItem.value.trim() == '') {
        return filteredAttendanceData.value = attendanceData.value
    }

    filteredAttendanceData.value = attendanceData.value.filter((data) => {
        return [data.firstname, data.lastname, data.matricNumber].some((field) => {
            return field.toLowerCase().includes(searchItem.value.toLowerCase())
        })
    })
}
const currentPage = ref(1);
const itemsPerPage = ref(6)

setInterval(() => {
    search()
}, 1000)

const start = computed(() => {
    return ((currentPage.value - 1) * itemsPerPage.value) + 1
})
const end = computed(() => {
    if (currentPage.value == totalPages.value) {
        return filteredAttendanceData.value.length
    }
    return (start.value + itemsPerPage.value) - 1
})
const paginatedData = computed(() => {
    const start = ref()
    const end = ref()
    start.value = (currentPage.value - 1) * itemsPerPage.value;
    end.value = start.value + itemsPerPage.value;
    return filteredAttendanceData.value.slice(start.value, end.value);
});
const totalPages = computed(() => {
    return Math.ceil(filteredAttendanceData.value.length / itemsPerPage.value);
});
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};



</script>

<template>
    <div class="bg-gray-50 min-h-screen">
        <!-- Header -->
        <Header :user="user" />

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
            <div class="glass-card rounded-2xl shadow-2xl p-6">
                <!-- Page Header -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold ">Attendance Records</h1>
                    <p class="">View and manage user attendance for selected dates</p>
                </div>

                <!-- Filters Section -->
                <div class="bg-indigo-50 rounded-xl p-6 mb-8">
                    <div class="flex flex-col md:flex-row gap-6">
                        <!-- Date Filter -->
                        <div class="flex-1">
                            <label class="block text-sm font-medium  mb-2">
                                <i class="fas fa-calendar-alt mr-2"></i>Select Date
                            </label>
                            <div class="relative">
                                <input v-model="date" type="date"
                                    class="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-indigo-700">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">

                                </div>
                            </div>
                        </div>

                        <!-- Search Bar -->
                        <div class="flex-1">
                            <label class="block text-sm font-medium  mb-2">
                                <i class="fas fa-search mr-2"></i>Search Users
                            </label>
                            <div class="relative">
                                <input v-model="searchItem" type="text" placeholder="Search by name or matric number..."
                                    class="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-indigo-700 placeholder-indigo-400">
                                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">

                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <!-- Attendance Table -->
                <div class="overflow-hidden rounded-xl border border-indigo-100">
                    <div class="overflow-x-auto">
                        <table v-if="paginatedData.length != 0" class="min-w-full divide-y divide-indigo-200">
                            <thead class="bg-indigo-500">
                                <tr>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        First Name
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Last Name
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Matric Number
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Check-In Time
                                    </th>
                                    <th scope="col"
                                        class="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Check-Out Time
                                    </th>

                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-indigo-100">
                                <!-- Row 1 -->
                                <tr v-for="data in paginatedData" class="hover:bg-indigo-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                                        {{ data.firstname }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm ">
                                        {{ data.lastname }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm ">
                                        {{ data.matricNumber }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm ">
                                        {{ data.checkInTime }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm ">
                                        {{ data.checkOutTime }}
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="flex flex-col items-center justify-center w-full py-10 text-slate-400">
                            <i class="fas fa-users-slash text-4xl mb-3"></i>
                            <p class="text-sm font-medium">No users found</p>
                        </div>
                    </div>
                </div>

                <!-- Table Footer -->
                <div class="flex items-center justify-between mt-4">

                    <div v-if="paginatedData.length != 0" class="flex space-x-2">
                        <button @click="prevPage"
                            class="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors"
                            :class="(currentPage == 1) ? 'cursor-not-allowed! bg-gray-300! hover:bg-gray-300! text-gray-100!' : ''">
                            Previous
                        </button>
                        <button @click="nextPage"
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                            :class="(currentPage == totalPages) ? 'cursor-not-allowed! bg-gray-600! hover:bg-gray-600!' : ''">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped></style>
