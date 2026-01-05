<template>
    <div>
        {{ error }}
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
const router = useRouter()
const { logout } = useUserStore()

let error = ref()

onMounted(async () => {
    const loggedOut = await logout()
    if (loggedOut?.message) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('email_verified')
        router.push('/login')
    } else {
        console.log(loggedOut)
        error.value = loggedOut
    }
})


</script>

<style scoped></style>