<template>
    <div class="gradient-bg min-h-screen flex flex-col">
        <!-- Header -->
        <header class="bg-white/20 backdrop-blur-md text-white shadow-md">
            <div class="container mx-auto px-4 py-4 flex justify-center items-center">
                <div class="flex items-center">
                    <div class="w-12 h-12 p-1 rounded-full bg-white flex items-center justify-center mr-3">
                        <img src="../assets/images/logo.png" alt="">
                    </div>
                    <h1 class="text-xl font-bold">REKON</h1>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="grow flex items-center justify-center p-4">
            <div class="max-w-2xl w-full">
                <!-- Camera Container -->
                <div class="camera-container rounded-2xl shadow-2xl overflow-hidden mb-6 relative">
                    <!-- Scanning Line Animation -->
                    <div v-if="isScanning" class="scanning-animation"></div>

                    <!-- Face Guide Overlay -->
                    <div class="face-overlay"></div>

                    <!-- Video Feed -->
                    <video v-show="streamActive" ref="video" autoplay playsinline muted
                        class="w-full h-96 object-cover"></video>

                    <!-- Placeholder when no camera -->
                    <div v-if="!streamActive" class="w-full h-96 bg-indigo-50 flex items-center justify-center">
                        <div class="text-center text-indigo-600">
                            <i class="fas fa-camera text-5xl mb-4"></i>
                            <p class="text-lg font-medium">Camera feed will appear here</p>
                            <p class="text-sm mt-2 text-indigo-500">Position your face within the frame</p>
                        </div>
                    </div>

                    <!-- Status Bar -->
                    <div class="bg-indigo-600 text-white p-4 flex justify-between items-center">
                        <div class="flex items-center">
                            <div :class="['w-3 h-3 rounded-full mr-2', statusColor]"></div>
                            <span class="text-sm font-medium">{{ statusText }}</span>
                        </div>
                        <div class="text-sm text-indigo-100">
                            <i class="fas fa-lightbulb mr-1"></i>
                            Ensure good lighting
                        </div>
                    </div>
                </div>

                <!-- Scan Button -->
                <div class="text-center">
                    <button @click="startFaceScan" :disabled="isScanning || !streamActive"
                        class="inline-flex items-center justify-center gap-3 bg-white hover:bg-indigo-50 text-indigo-600 font-bold py-2 px-9 rounded-xl text-lg transition-all transform shadow-lg border-2 border-indigo-200"
                        :class="scanButtonClasses">
                        <i v-if="isScanning" class="fas fa-spinner fa-spin"></i>
                        <i v-else class="fas fa-fingerprint"></i>
                        {{ scanButtonText }}
                    </button>
                </div>
            </div>
        </main>


    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useUserStore } from '@/stores/user'


const { verifyFace } = useUserStore()

const video = ref(null)
const stream = ref(null)
const streamActive = ref(false)
const isScanning = ref(false)

const statusText = ref('Initializing camera...')
const statusColor = ref('bg-yellow-400')

// Button state
const scanButtonText = computed(() =>
    isScanning.value ? 'Scanning...' : 'Scan Face'
)

const scanButtonClasses = computed(() => {
    if (isScanning.value || !streamActive.value) {
        return 'bg-indigo-100 text-indigo-400 cursor-not-allowed hover:scale-100'
    }
    return 'hover:scale-105'
})

// Start camera
const startCamera = async () => {
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 1280, height: 720 }
        })
        stream.value = mediaStream
        if (video.value) {
            video.value.srcObject = mediaStream
            streamActive.value = true
            statusText.value = 'Camera ready • Look straight'
            statusColor.value = 'bg-green-500'
        }
    } catch (err) {
        console.error('Camera access failed:', err)
        statusText.value = 'Camera access denied'
        statusColor.value = 'bg-red-500'
    }
}

// Face Scan Simulation (with 80% success rate like original)
const startFaceScan = async () => {
    if (isScanning.value || !streamActive.value) return
    if (statusText.value == 'Camera access denied') return
    isScanning.value = true
    const detections = await faceapi
        .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detections) {
        alert("No face detected, try again!");
        isScanning.value = false;
        return;
    }
    const embeddings = Array.from(detections.descriptor);
    const face = await verifyFace(embeddings)
    if (face?.error) {
        alert(face.error)
        console.log(face.error)
        isScanning.value = false;
        return
    }

    alert(face.message)
    isScanning.value = false;
    return
    statusText.value = 'Scanning in progress...'
    statusColor.value = 'bg-blue-400'

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 80% success rate (just like your original code)
    const isSuccess = Math.random() > 0.2

    if (isSuccess) {
        statusColor.value = 'bg-green-500'
        statusText.value = 'Face recognized successfully! Welcome back!'

    } else {
        statusColor.value = 'bg-red-500'
        statusText.value = 'Face not recognized – please try again'
    }

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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.gradient-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.camera-container {
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
}

.scanning-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, transparent, #4f46e5, transparent);
    animation: scanning 2s linear infinite;
    z-index: 20;
}

@keyframes scanning {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

.face-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px dashed rgba(79, 70, 229, 0.7);
    border-radius: 10px;
    /* Square with rounded corners */
    width: 70%;
    height: 70%;
    pointer-events: none;
    z-index: 10;
}
</style>
