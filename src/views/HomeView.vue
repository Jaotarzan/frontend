<template>
  <div>
    <h1>Home</h1>
    <p v-if="user">Bem-vindo, {{ user.name }}! <router-link to="/dashboard">Dashboard</router-link></p>
    <p v-else><router-link to="/login">Login</router-link></p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuth } from "../composables/useAuth";

const { user, fetchUser, handleLoginRedirect } = useAuth();

onMounted(async () => {
  await handleLoginRedirect(); // captura token do login social, se existir
  await fetchUser();           // busca dados do usuário se já tiver token
});
</script>

