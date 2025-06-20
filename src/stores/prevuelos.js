import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useStoreUsuarios } from "./usuarios";


export const useStorePrevuelos = defineStore(
    "Prevuelo",
    () => {
      let loading = ref(false);
      let prevuelos = ref([]);
      const useUsuario = useStoreUsuarios();

  const obtenerdatodeprevuelo = async (consecutivo) => {
    loading.value = true
    try {
      let response = await axios.get(`api/prevuelos/obtenerdatosprevuelo/${consecutivo}`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return response.data
    } catch (error) {
      console.error('No se pudo obtener los datos del prevuelo', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const postPrevuelo = async (data) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.post("api/prevuelos/crear", data, {
        headers: {
          // "x-token": useUsuario.token
          "x-token": localStorage.getItem('x-token')
        }
      });

      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'prevuelo creado correctamente',
        color: "positive",
        position: "bottom",
      })

      return response;

  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response.data.errors[0].msg
    })
      loading.value =true
      console.log(error);
      return error;
  } finally {
      loading.value = false;
    }
  };

  const putPrevuelo = async (consecutivo, formData) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/prevuelos/editar/${consecutivo}`, formData, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'prevuelo editado correctamente',
        color: 'positive',
        position: 'bottom',
      })

      return response
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response.data.errors[0].msg,
      })
      loading.value = true
      console.log(error)
      return error
    } finally {
      loading.value = false
    }
  }

  const putAprobarPrevuelo = async (consecutivo) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/prevuelos/aprobar/${consecutivo}`,
        {},
        {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'prevuelo aprobado correctamente',
        color: 'positive',
        position: 'bottom',
      })

      return response
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response.data.errors[0].msg,
      })
      loading.value = true
      console.log(error)
      return error
    } finally {
      loading.value = false
    }
  }

  const putDenegarPrevuelo = async (consecutivo) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/prevuelos/denegar/${consecutivo}`,
        {},
        {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'prevuelo denegado',
        color: 'positive',
        position: 'bottom',
      })

      return response
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response.data.errors[0].msg,
      })
      loading.value = true
      console.log(error)
      return error
    } finally {
      loading.value = false
    }
  }

  return {
    obtenerdatodeprevuelo,
    postPrevuelo,
    putPrevuelo,
    putAprobarPrevuelo,
    putDenegarPrevuelo,
    loading,
    prevuelos,
    useUsuario,

  };
}, { persist: true });

