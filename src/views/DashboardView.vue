<template>
  <div>
    <h1>Dashboard</h1>
    <p v-if="user">Olá, {{ user.username }}</p>
    <button @click="logout">Sair</button>

    <h2>Biometria / WebAuthn</h2>
    <button @click="registerCredential">Registrar biometria</button>
    <button @click="loginCredential">Autenticar biometria</button>

    <h1>{{ errorMessage }}</h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { startRegistration, startAuthentication  } from "@simplewebauthn/browser";
import { useAuth } from "../composables/useAuth";

const BASE_URL = "https://auth-tests.onrender.com";
const { user, handleLoginRedirect, logout } = useAuth();
const errorMessage = ref("");

// -----------------------
// Função utilitária para converter base64url em ArrayBuffer
// -----------------------

onMounted(async () => {
  await handleLoginRedirect();
  console.log("Usuário logado:", user?.value);
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  console.log("JWT token:", token);
  return { Authorization: `Bearer ${token}` };
};

// -------------------------------
// Registrar biometria
// -------------------------------
const registerCredential = async () => {
  try {
    console.log("Chamando endpoint de registro...");
    const options = (
      await axios.get(`${BASE_URL}/webauthn/register/options/${user.value.id}`, {
        headers: getAuthHeaders(),
      })
    ).data;
    console.log("Opções de registro recebidas:", options);

    const attResp = await startRegistration(options);
    console.log("Resposta de registro do browser:", attResp);

    const verifyResp = await axios.post(
      `${BASE_URL}/webauthn/register/verify/${user.value.id}`,
      { attestationResponse: attResp },
      { headers: getAuthHeaders() }
    );
    console.log("Resposta do backend após verificação:", verifyResp.data);

    alert("Biometria registrada com sucesso!");
  } catch (err) {
    console.error("Erro no registro:", err);
    errorMessage.value = err.response?.data || err.message || "Erro ao registrar biometria";
    alert("Erro ao registrar biometria");
  }
};

// -------------------------------
// Autenticar biometria
// -------------------------------
const loginCredential = async () => {
  try {
    console.log("Chamando endpoint de autenticação...");
    const options = (
      await axios.get(`${BASE_URL}/webauthn/authn/options/${user.value.id}`, {
        headers: getAuthHeaders(),
      })
    ).data;
    console.log("Opções de autenticação recebidas:", options);

    const assertionResp = await startAuthentication(options);
    console.log("Resposta de autenticação do browser:", assertionResp);

    const verifyResp = await axios.post(
      `${BASE_URL}/webauthn/authn/verify/${user.value.id}`,
      { assertionResponse: assertionResp },
      { headers: getAuthHeaders() }
    );
    console.log("Resposta do backend após verificação:", verifyResp.data);

    alert("Autenticação biométrica concluída!");
  } catch (err) {
    console.error("Erro na autenticação:", err);
    errorMessage.value = err.response?.data || err.message || "Erro na autenticação biométrica";
    alert("Erro na autenticação biométrica");
  }
};
</script>
