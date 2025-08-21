import { ref } from "vue";
import axios from "axios";

export function useAuth() {
  const user = ref(null);
  const token = ref(localStorage.getItem("jwt_token") || null);

  // Função para manter o header Authorization sempre atualizado
  const setAxiosAuthHeader = (jwtToken) => {
    if (jwtToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Inicializa header com token existente
  setAxiosAuthHeader(token.value);

  // Buscar usuário autenticado
  const fetchUser = async () => {
    if (!token.value) {
      console.log("Nenhum token disponível. Usuário não autenticado.");
      user.value = null;
      return;
    }
    try {
      console.log("Buscando usuário autenticado com JWT...");
      const res = await axios.get("https://auth-tests.onrender.com/");
      console.log("Respos ta recebida:", res);
      user.value = res.data;
    } catch (e) {
      console.error("Erro ao buscar usuário:", e);
      user.value = null;
      token.value = null;
      localStorage.removeItem("jwt_token");
      setAxiosAuthHeader(null);
    }
  };

  // URL para login social
  const loginUrl = (provider) => {
    return `https://auth-tests.onrender.com/auth/${provider}`;
  };

  // Logout local
  const logout = () => {
    console.log("Realizando logout local...");
    token.value = null;
    localStorage.removeItem("jwt_token");
    setAxiosAuthHeader(null);
    user.value = null;
  };

  // Receber token do redirect após login social
  const handleLoginRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get("token");
    console.log(jwtToken);
    if (jwtToken) {
      token.value = jwtToken;
      localStorage.setItem("jwt_token", jwtToken);
      setAxiosAuthHeader(jwtToken);
      await fetchUser(); // Atualiza estado do usuário imediatamente
    }
  };

  return { user, token, fetchUser, loginUrl, logout, handleLoginRedirect };
}
