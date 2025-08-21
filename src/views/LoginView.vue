<template>
  <div class="login">
    <h1>Login</h1>
    <button @click="socialLogin('google')">Login com Google</button>
    <button @click="socialLogin('github')">Login com GitHub</button>
    <button @click="socialLogin('microsoft')">Login com Microsoft</button>
    <button @click="socialLogin('apple')">Login com Apple</button>
  </div>
</template>

<script setup>
import { useAuth } from "../composables/useAuth";

const { loginUrl } = useAuth();

const socialLogin = (provider) => {
  window.location.href = loginUrl(provider);
};
</script>
