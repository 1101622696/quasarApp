<template>
  <div class="todo">
    <div class="body">
      <section>
        <form @submit.prevent="iniciar">
          <h1>Inicio</h1>
          <div class="inputbox">
            <input type="email" required v-model="email" />
            <label for="">Usuario</label>
          </div>
          <div class="inputbox password-box">
            <input :type="passwordFieldType" required v-model="passwordLogin" />
            <label for="">Contraseña</label>
            <i :class="['eye-icon', passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye']" @click="togglePasswordVisibility"></i>
          </div>
          <button type="submit">Iniciar</button>
          <div class="register"></div>
          <button class="btrecuperar" @click="activador()">¿Olvidaste la contraseña?</button>
        </form>
      </section>
      <div class="recuperarcontrasena" v-if="vifRecontrasena">
        <div class="divbtx">
          <button type="submit" class="btx" @click="cerrar()">X</button>
        </div>
        <div class="inputbox">
          <input type="email" required v-model="emailrecuperador" />
          <label for="">Ingresar correo</label>
        </div>
        <button type="submit" @click="recuperar()">Recuperar contraseña</button>
      </div>
    </div>
  </div>
</template>


<script setup>


import { ref, computed } from 'vue';
import { useStoreUsuarios } from '../stores/usuarios';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';

const router = useRouter();
const UseUsuario = useStoreUsuarios();
const email = ref('');
const passwordLogin = ref('');
const passwordVisible = ref(false);
const $q = useQuasar();
const vifRecontrasena = ref(false);
const emailrecuperador = ref('');

const passwordFieldType = computed(() => (passwordVisible.value ? 'text' : 'password'));

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const mostrarMensajeError = (mensaje) => {
  $q.notify({
    type: 'negative',
    message: mensaje,
    position: 'bottom-right',
  });
};

const mostrarMensajeExito = (mensaje) => {
  $q.notify({
    type: 'positive',
    message: mensaje,
    position: 'bottom-right',
  });
};

const iniciar = async () => {
  try {
    if (email.value === '' || passwordLogin.value === '') {
      mostrarMensajeError('El correo electrónico y la contraseña son obligatorios');
      return;
    }

    // Usar el método login del store y no manipular localStorage directamente
    const res = await UseUsuario.login(email.value, passwordLogin.value);
    
    // El token ya se guarda en el store, así que solo verificamos si la operación fue exitosa
       
    if (res && res.status === 200) {
      router.push('/IndexPage');
    } else {
      mostrarMensajeError('Correo electrónico o contraseña incorrectos');
    }
  } catch (error) {
    if (error.response && error.response.data) {
      mostrarMensajeError(error.response.data.msg);
    } else {
      // mostrarMensajeError('Ha ocurrido un error en el servidor');
      console.log(error);
    }
  }
};

function activador() {
  vifRecontrasena.value = true;
}

function cerrar() {
  vifRecontrasena.value = false;
}

async function recuperar() {
  try {
    if (emailrecuperador.value === '') {
      mostrarMensajeError('Ingrese correo electrónico');
      return;
    }

    const res = await axios.post('api/usuarios/recuperar-password', { email: emailrecuperador.value });

    if (res.status === 200) {
      mostrarMensajeExito('Correo de recuperación enviado');
      vifRecontrasena.value = false;
    } else {
      mostrarMensajeError('Correo no encontrado en ningún usuario');
    }
  } catch (error) {
    mostrarMensajeError('Ha ocurrido un error en el servidor');
    console.log(error);
  }
}

defineOptions({
  name: 'LoginPage'
})


</script>


<style scoped>
.todo {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.password-box {
  position: relative;
  display: flex;
  align-items: center;
}

.password-box input {
  width: 100%;
}

.eye-icon {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  z-index: 2;
}

.eye-icon:hover {
  color: #333;
}

.body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: url("https://i.postimg.cc/L8Z31yrP/DISE-OS-LOGOS-DRON-19.png") no-repeat center;
  background-size: cover;
}

section {
  position: relative;
  max-width: 400px;
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(55px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 3rem;
}

.inputbox input {
  width: 100%;
  height: 60px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0 35px 0 5px;
  color: #fff;
}

.inputbox i {
  position: absolute;
  right: 8px;
  color: #fff;
  font-size: 1.2rem;
  top: 20px;
}

h1 {
  font-size: 2rem;
  color: #fff;
  text-align: center;
}

.inputbox {
  position: relative;
  margin: 30px 0;
  max-width: 310px;
  border-bottom: 2px solid #fff;
}

.inputbox label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  color: #fff;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.5s ease-in-out;
}

input:focus ~ label,
input:valid ~ label {
  top: -5px;
}

button {
  width: 100%;
  height: 40px;
  border-radius: 40px;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.4s ease;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.register {
  font-size: 0.9rem;
  color: #fff;
  text-align: center;
  margin: 25px 0 10px;
}

.register p a {
  text-decoration: none;
  color: #fff;
  font-weight: 600;
}

.register p a:hover {
  text-decoration: underline;
}

.btrecuperar {
  background-color: rgba(0, 0, 0, 0);
  font-size: medium;
  color: rgb(255, 255, 255);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.btrecuperar:hover {
  background-color: #ffffff00;
  color: black;
}

.recuperarcontrasena {
  position: absolute;
  max-width: 405px;
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(55px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 3rem;
  height: 38vmax;
}

.btx {
  position: absolute;
  font-size: medium;
  color: rgb(255, 255, 255);
  background-color: #ffffff00;
  width: 3vmax;
  top: 1%;
  right: 1%;
}

.btx:hover {
  background-color: #ffffff00;
  color: black;
}

.divbtx {
  display: flex;
  justify-content: right;
}
</style>

