<template>
    <div class="gradient-bg min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-white/20 backdrop-blur-md text-white shadow-md">
            <div class="container mx-auto px-4 py-4 flex justify-center items-center">
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                        <i class="fas fa-camera text-indigo-600"></i>
                    </div>
                    <h1 class="text-xl font-bold">REKON</h1>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="grow flex items-center justify-center p-4">
            <div class="max-w-4xl w-full">
                <div class="glass-card rounded-2xl shadow-2xl p-8">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Left: Camera Feed -->
                        <div class="space-y-6">
                            <div class="camera-container bg-indigo-50 rounded-xl overflow-hidden">
                                <div class="relative w-full h-80 flex items-center justify-center"
                                    :class="{ 'capture-animation': isCapturing }">
                                    <!-- Face Overlay Guide -->
                                    <div class="face-overlay"></div>

                                    <!-- Video Feed -->
                                    <video v-show="streamActive" ref="video" autoplay playsinline muted
                                        class="absolute inset-0 w-full h-full object-cover"></video>

                                    <!-- Placeholder when no camera -->
                                    <div v-if="!streamActive" class="text-center text-indigo-600 z-0">
                                        <i class="fas fa-camera text-5xl mb-4"></i>
                                        <p class="text-lg font-medium">Camera feed will appear here</p>
                                        <p class="text-sm mt-2 text-indigo-500">Position your face within the frame</p>
                                    </div>
                                </div>

                                <!-- Status Bar -->
                                <div class="bg-indigo-600 text-white p-3 text-center">
                                    <div class="flex items-center justify-center">
                                        <div :class="[
                                            'w-3 h-3 rounded-full mr-2',
                                            statusColor
                                        ]"></div>
                                        <span class="text-sm">{{ statusText }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Capture Button -->
                            <button @click="captureImage" :disabled="isCapturing || capturedImages >= 1"
                                class="w-full font-bold py-4 px-4 rounded-xl text-lg transition duration-300 transform shadow-lg border-2 border-indigo-200 flex items-center justify-center"
                                :class="captureButtonClasses">
                                <i v-if="isCapturing" class="fas fa-spinner fa-spin mr-3"></i>
                                <i v-else class="fas fa-camera mr-3"></i>
                                {{ captureButtonText }}
                            </button>

                            <!-- Complete Button -->
                            <button v-if="capturedImages === 1" @click="completeRegistration" :disabled="isProcessing"
                                class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl text-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center">
                                <i v-if="isProcessing" class="fas fa-spinner fa-spin mr-3"></i>
                                <i v-else class="fas fa-check mr-3"></i>
                                {{ isProcessing ? 'Processing...' : 'Complete Registration' }}
                            </button>
                        </div>

                        <!-- Right: Instructions -->
                        <div class="space-y-6">
                            <div class="bg-indigo-50 rounded-xl p-6 h-full">
                                <h3 class="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                                    <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>
                                    Capture Instructions
                                </h3>
                                <ul class="space-y-4 text-indigo-700">
                                    <li class="flex items-start">
                                        <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                                        <div>
                                            <span class="font-medium">Good Lighting</span>
                                            <p class="text-sm text-indigo-600 mt-1">Ensure even lighting on your face
                                                without shadows</p>
                                        </div>
                                    </li>
                                    <li class="flex items-start">
                                        <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                                        <div>
                                            <span class="font-medium">Face Position</span>
                                            <p class="text-sm text-indigo-600 mt-1">Look directly at the camera and keep
                                                your face centered</p>
                                        </div>
                                    </li>
                                    <li class="flex items-start">
                                        <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                                        <div>
                                            <span class="font-medium">Neutral Expression</span>
                                            <p class="text-sm text-indigo-600 mt-1">Keep a natural, neutral facial
                                                expression</p>
                                        </div>
                                    </li>
                                    <li class="flex items-start">
                                        <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                                        <div>
                                            <span class="font-medium">No Obstructions</span>
                                            <p class="text-sm text-indigo-600 mt-1">Remove sunglasses, hats, or face
                                                coverings</p>
                                        </div>
                                    </li>

                                </ul>
                                <!-- <div class="mt-6 text-center text-indigo-800 font-semibold">
                                    Progress: {{ capturedImages }} / 3 images captured
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-white/20 backdrop-blur-md text-indigo-100 py-4 text-center">
            <p>© {{ new Date().getFullYear() }} REKON Face Recognition App. All rights reserved.</p>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const { registerFace } = useUserStore()

const video = ref(null)
const streamActive = ref(false)
const stream = ref(null)
const capturedImages = ref(0)
const isCapturing = ref(false)
const isProcessing = ref(false)

const statusText = ref('Initializing camera...')
const statusColor = ref('bg-yellow-400')

// Computed button classes
const captureButtonClasses = computed(() => {
    if (isCapturing.value) {
        return 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
    }
    if (capturedImages.value >= 1) {
        return 'bg-gray-200 text-gray-500 cursor-not-allowed'
    }
    return 'bg-white hover:bg-indigo-50 text-indigo-600 hover:scale-105'
})

const captureButtonText = computed(() => {
    if (isCapturing.value) return 'Capturing...'
    if (capturedImages.value >= 1) return 'All Images Captured'
    return 'Capture Face'
})

// Start camera
const startCamera = async () => {
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 640, height: 480 }
        })
        stream.value = mediaStream

        if (video.value) {
            video.value.srcObject = mediaStream
            streamActive.value = true
            statusText.value = 'Camera ready'
            statusColor.value = 'bg-green-500'
        }
    } catch (err) {
        console.error('Camera access denied:', err)
        statusText.value = 'Camera access denied'
        statusColor.value = 'bg-red-500'
        streamActive.value = false
    }
}

// Capture image (simulated)
const captureImage = async () => {
    if (isCapturing.value || capturedImages.value >= 1) return
    if (statusText.value == 'Camera access denied') return
    const detections = await faceapi
        .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detections) {
        // capture.disabled = false;
        // capture.innerText = "Capture";
        alert("No face detected, try again!");
        return;
    }
    const embeddings = Array.from(detections.descriptor);
    const face = await registerFace(embeddings)
    if (face?.error) {
        alert(face.error)
    }

    alert(face.message)

    router.push('/user/manage-account/')


    return

    isCapturing.value = true
    statusText.value = 'Capturing image...'
    statusColor.value = 'bg-blue-400'


    // Simulate capture delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    capturedImages.value++
    isCapturing.value = false
    statusColor.value = 'bg-green-500'

    if (capturedImages.value === 1) {
        statusText.value = 'All images captured! Ready to complete.'
    } else {
        statusText.value = `Image ${capturedImages.value} captured successfully`
    }
}

// Complete registration
const completeRegistration = async () => {
    isProcessing.value = true
    statusText.value = 'Finalizing registration...'
    statusColor.value = 'bg-blue-400'

    await new Promise(resolve => setTimeout(resolve, 2000))

    alert('Face registration completed successfully! 🎉')
    // window.location.href = '/registration-complete'
}

// Lifecycle
onMounted(() => {
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("../models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("../models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("../models"),
    ]).then(startCamera)
})

onBeforeUnmount(() => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
    }
})
</script>

<style scoped>
.glass-card {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
}

.camera-container {
    position: relative;
    overflow: hidden;
}

.face-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px dashed rgba(79, 70, 229, 0.7);
    border-radius: 10px;
    width: 70%;
    height: 70%;
    pointer-events: none;
    z-index: 10;
}

.capture-animation {
    animation: captureFlash 0.5s ease-in-out;
}

@keyframes captureFlash {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.3;
    }
}
</style>
