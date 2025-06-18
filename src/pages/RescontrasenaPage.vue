<template>
  <div class="todo">
    <div class="body">
      <section>
        <form @submit.prevent="restablecerContraseña">
          <h1>Restablecer Contraseña</h1>
          <div class="inputbox">
            <input type="password" v-model="nuevaContraseña" required />
            <label for="">Nueva Contraseña</label>
          </div>
          <div class="inputbox password-box">
            <ion-icon name="lock-closed-outline"></ion-icon>
            <input :type="passwordFieldType" v-model="confirmarContraseña" required />
            <label for="">Confirmar Contraseña</label>
            <ion-icon :name="eyeIcon" @click="togglePasswordVisibility"></ion-icon>
          </div>
          <button type="submit">Restablecer Contraseña</button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useStoreUsuarios } from "../stores/usuarios.js";

const nuevaContraseña = ref('');
const confirmarContraseña = ref('');
const $q = useQuasar();
const passwordVisible = ref(false);

const route = useRoute();
const router = useRouter();
const token = ref(route.query.token || '');
const _id = ref(''); // El _id del usuario

const passwordFieldType = computed(() => (passwordVisible.value ? 'text' : 'password'));
const eyeIcon = computed(() => (passwordVisible.value ? 'eye-off-outline' : 'eye-outline'));

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

const restablecerContraseña = async () => {
  try {
    if (nuevaContraseña.value !== confirmarContraseña.value) {
      mostrarMensajeError('Las contraseñas no coinciden');
      return;
    }

    if (!token.value) {
      mostrarMensajeError('Token no válido o faltante');
      return;
    }

    // Obtén el _id del usuario desde el token decodificado
    const decoded = JSON.parse(atob(token.value.split('.')[1]));
    _id.value = decoded.id;

    const data = {
      password: nuevaContraseña.value,
    };

    const response = await useStoreUsuarios().putUsuariospassword(_id.value, data);

    if (response.status === 200) {
      mostrarMensajeExito('Contraseña restablecida exitosamente');
      router.push('/login');
    } else {
      mostrarMensajeError('Error al restablecer la contraseña');
    }
  } catch (error) {
    mostrarMensajeError('Ha ocurrido un error en el servidor');
    console.error(error);
  }
};
</script>

<style scoped>
.todo {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "poppins", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url("https://preview.free3d.com/img/2016/04/1725656089682248848/2k6yk897.jpg") no-repeat center;
  background-size: cover;
}

.body {
  max-width: 400px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  padding: 2rem;
}

h1 {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 3vmax;
  text-align: center;
  line-height: 2;
}

.inputbox {
  position: relative;
  margin-bottom: 1.5rem;
}

.inputbox input {
  width: 100%;
  height: 40px;
  background: transparent;
  border: none;
  border-bottom: 2px solid #fff;
  outline: none;
  font-size: 1rem;
  color: #fff;
  padding-left: 5px;
}

.inputbox input:focus ~ label,
.inputbox input:valid ~ label {
  top: -15px;
  font-size: 0.8rem;
  color: #fff;
}

.inputbox label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.3s ease;
}

.password-box {
  position: relative;
}

.password-box ion-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
}

button {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
