<script setup>
import Header from '@/components/Header.vue';
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import router from '@/router';

const { registerUser, sendCode } = useUserStore()

const form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  matricNumber: '',
  password: '',
  department: ''
})
const errors = ref([])
const handleSubmit = async () => {
  errors.value.length = 0
  const { firstname, lastname, email, password, matricNumber, department } = form
  // verify matric year is valid
  const matricYear = matricNumber.slice(0, 4)

  if (firstname.trim() == '' || lastname.trim() == '' || email.trim() == '' || password.trim() == '' || matricNumber.trim() == '' || department.trim() == '') {
    return errors.value.push("All fields must be filled")
  }

  if (!/^([A-Za-z0-9._%+-]+)@[a-z0-9-]{3,}\.[a-z]{2,}(\.[a-z]{2,})?$/.test(email)) {
    return errors.value.push("Enter a valid email")
  }

  if (!/^\d{4}\/\d{6}$/.test(matricNumber)) {
    return errors.value.push("Enter a valid UNN matric number")
  }

  if (new Date().getFullYear() < Number(matricYear)) {
    return errors.value.push("Invalid Matric year")
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_]).{8,40}/.test(password)) {
    return errors.value.push("Password must be atleast 8 characters and must contain atleast a number, 1 uppercase, lowercase, and a special character")
  }

  const data = await registerUser({ ...form })
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
        <h2 class="text-2xl font-bold text-white">Create Your Account</h2>
        <p class="mt-2 text-indigo-100">Register for our face recognition system</p>
      </div>


      <!-- Registration Form -->
      <div class="form-container rounded-2xl shadow-2xl p-8">
        <form @submit.prevent="handleSubmit" class="mt-8 space-y-5">
          <div class="space-y-4">
            <p v-if="errors.length != 0" v-for="error in errors" class="text-red-500 mb-3">Error: {{ error }}</p>
            <!-- First Name -->
            <div>
              <label for="firstname" class="block text-sm font-medium text-gray-700">First Name</label>
              <div class="mt-1 relative">
                <input v-model="form.firstname" name="firstname" type="text"
                  class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                  placeholder="Enter your first name">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i class="fas fa-user text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastname" class="block text-sm font-medium text-gray-700">Last Name</label>
              <div class="mt-1 relative">
                <input v-model="form.lastname" name="lastname" type="text"
                  class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                  placeholder="Enter your last name">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i class="fas fa-user text-gray-400"></i>
                </div>
              </div>
            </div>

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

            <!-- Matric Number -->
            <div>
              <label for="matric" class="block text-sm font-medium text-gray-700">Matric Number</label>
              <div class="mt-1 relative">
                <input v-model="form.matricNumber" name="matric" type="text"
                  class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                  placeholder="Enter your matric number">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i class="fas fa-id-card text-gray-400"></i>
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

            <!-- Department -->
            <div>
              <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
              <div class="mt-1 relative">
                <select v-model="form.department" name="department"
                  class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10">
                  <option value="" disabled selected>Select your department</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="electrical-engineering">Electrical Engineering</option>
                  <option value="mechanical-engineering">Mechanical Engineering</option>
                  <option value="civil-engineering">Civil Engineering</option>
                  <option value="business-administration">Business Administration</option>
                  <option value="law">Law</option>
                  <option value="medicine">Medicine</option>
                  <option value="medical-laboratory">Mediacl Laboratory</option>
                  <option value="medical-rehabilitation">Mediacl Rehabilitation</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
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
              Register for REKON
            </button>
          </div>
          <p class="text-sm text-gray-700">Already have an account? <a class="text-indigo-600" href="/login">Log
              In</a></p>

          <!-- Additional Info -->
          <div class="text-center text-sm text-gray-600 mt-4">
            <p>By registering, you agree to our <a href="#"
                class="font-medium text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#"
                class="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>.</p>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
<style scoped></style>