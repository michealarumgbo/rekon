<template>
    <div class="gradient-bg min-h-screen flex items-center justify-center p-4">
        <div class="max-w-md w-full space-y-8">
            <!-- Header -->
            <div class="text-center">
                <div class="flex items-center justify-center mb-4">
                    <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3">
                        <i class="fas fa-camera text-indigo-600 text-xl"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-white">REKON</h1>
                </div>
                <h2 class="text-2xl font-bold text-white">Verify Your Email</h2>
                <p class="mt-2 text-indigo-100">We've sent a verification code to your email</p>
            </div>

            <!-- Verification Form -->
            <div class="form-container rounded-2xl shadow-2xl p-8">
                <!-- Success Icon -->
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-envelope text-green-600 text-2xl"></i>
                    </div>
                    <p class="text-gray-600">Enter the 6-digit code sent to:</p>
                    <p class="font-semibold text-indigo-700">{{ user?.email ?? '' }}</p>
                    <p v-if="errors.length != 0" v-for="error in errors" class="text-red-500 mb-3">Error {{ error }}</p>
                </div>

                <!-- OTP Inputs -->
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3 text-center">
                            6-Digit Verification Code
                        </label>
                        <div class="flex justify-center space-x-3">
                            <input v-for="(digit, index) in otp" :key="index" v-model="otp[index]"
                                @input="handleInput(index, $event)" @keydown="handleKeydown(index, $event)" type="text"
                                maxlength="1" ref="otpInputs"
                                class="w-9 md:w-12 h-9 md:h-12 text-center text-xl font-bold border-2 border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors"
                                :class="{ 'border-red-300 bg-red-50': error && !otp[index] }" />
                        </div>
                    </div>

                    <!-- Countdown Timer -->
                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            Code expires in
                            <span :class="['font-medium', { 'text-red-500': codeExpired }]" id="countdown">
                                {{ formatTime(codeTimer) }}
                            </span>
                        </p>
                    </div>

                    <!-- Verify Button -->
                    <button @click="verifyEmail"
                        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center pulse-animation">
                        <i class="fas fa-check-circle mr-2"></i>
                        Verify Email
                    </button>

                    <!-- Resend Code -->
                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            Didn't receive the code?
                            <button @click="resendCode" :disabled="resendCountdown > 0"
                                class="text-indigo-600 font-medium hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed">
                                {{ resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend now' }}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center text-indigo-100 text-sm">
                <p>
                    Need help?
                    <a href="#" class="font-medium text-white hover:text-indigo-200">Contact Support</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user';
import router from '@/router';

const { accessToken, sendCode, getMe, verifyCode } = useUserStore()
const errors = ref([])
const user = ref()


// Reactive state
const otp = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const codeTimer = ref(120) // 2 minutes
const codeExpired = ref(false)
const resendCountdown = ref(60)
const error = ref(false)

// Format seconds to MM:SS
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
}

// Auto-focus next input
const handleInput = async (index, event) => {
    const value = event.target.value
    if (/^\d$/.test(value)) {
        otp.value[index] = value
        if (index < 5) {
            await nextTick()
            otpInputs.value[index + 1]?.focus()
        }
    } else {
        otp.value[index] = ''
    }
}

// Handle backspace
const handleKeydown = (index, event) => {
    if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
        otpInputs.value[index - 1]?.focus()
    }
}

// Start main countdown
const startCodeTimer = () => {
    const interval = setInterval(() => {
        if (codeTimer.value > 0) {
            codeTimer.value--
        } else {
            codeExpired.value = true
            clearInterval(interval)
        }
    }, 1000)
}

// Start resend countdown
const startResendTimer = () => {
    const interval = setInterval(() => {
        if (resendCountdown.value > 0) {
            resendCountdown.value--
        } else {
            clearInterval(interval)
        }
    }, 1000)
}

// Resend code
const resendCode = async (event) => {
    errors.value.length = 0
    if (resendCountdown.value > 0) return

    // Reset everything
    codeTimer.value = 120
    codeExpired.value = false
    resendCountdown.value = 60
    otp.value = ['', '', '', '', '', '']

    // Restart timers
    startCodeTimer()
    startResendTimer()

    // Temporary feedback
    const originalText = event.target.innerHTML
    const msg = await sendCode()
    if (msg.error) {
        return errors.value.push(msg.error + " while sending mail")
    }

    event.target.innerHTML = 'Code sent!'
    setTimeout(() => {
        event.target.innerHTML = originalText
    }, 2000)
}

// Verify email
const verifyEmail = async () => {
    errors.value.length = 0
    const isComplete = otp.value.every(digit => digit !== '')

    if (isComplete) {
        const verify = await verifyCode(otp.value.join(""))
        if (verify.error) {
            return errors.value.push(verify.error)
        }
        localStorage.setItem('email_verified', 'true')
        alert(verify.message + ' Redirecting...')
        router.push('/face-reg')
    } else {
        error.value = true
        await nextTick()
        setTimeout(() => {
            error.value = false
        }, 2000)
    }
}

// Start timers on mount
onMounted(async () => {
    errors.value.length = 0
    if (accessToken) {
        const data = await getMe()
        user.value = data?.user
        const msg = await sendCode()
        if (msg.error) {
            return errors.value.push(msg.error + " while sending mail")
        }
        // console.log(msg)
    }
    startCodeTimer()
    startResendTimer()
    otpInputs.value[0]?.focus()
})
</script>

<style scoped>
.pulse-animation {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}
</style>
