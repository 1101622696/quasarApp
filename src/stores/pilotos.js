import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useStoreUsuarios } from "./usuarios";


export const useStorePilotos = defineStore(
    "Piloto",
    () => {
      let loading = ref(false);
      let pilotos = ref([]);
      const useUsuario = useStoreUsuarios();


    const listarPilotos = async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/pilotos`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        // Return just the data array
        return Array.isArray(response.data) ? response.data : 
               (response.data.pilotos || []);
      } catch (error) {
        console.error('No se pudo obtener los pilotos', error)
        return []
      } finally {
        loading.value = false
      }
    }

  const listarPilotosActivos = async () => {
    loading.value = true
    try {
      let response = await axios.get(`api/pilotos/activos`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return Array.isArray(response.data) ? response.data : 
             (response.data.pilotos || []);
    } catch (error) {
      console.error('No se pudo obtener los pilotos activos', error)
      return error
    } finally {
      loading.value = false
    }
  }

   const listarPilotosOrdenados = async (tipo = 'fecha', orden = 'desc') => {
    loading.value = true;    
    try {
      const response = await axios.get(`api/pilotos/ordenados`, {
        params: { tipo, orden },
        headers: {
          "x-token": localStorage.getItem('x-token')
        },
      });
      
      return response.data;
    } catch (err) {
      console.error(`No se pudo obtener los pilotos ordenados por ${tipo}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

    const listarPilotosFiltrados = async (tipo, valor) => {
    loading.value = true;
    
    try {
      const response = await axios.get(`api/pilotos/filtrados`, {
        params: { tipo, valor },  
        headers: {
          "x-token": localStorage.getItem('x-token')
        },
      });
      
      // console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (err) {
      console.error(`No se pudo obtener los pilotos filtrados por ${tipo}:`, err);
      console.error("Detalles del error:", err.response?.data || err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const obtenerdatospiloto = async (identificacion) => {
    loading.value = true
    try {
      let response = await axios.get(`api/pilotos/obtenerdatospiloto/${identificacion}`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return response.data
    } catch (error) {
      console.error('No se pudo obtener los datos del piloto', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const postPilotos = async (formData) => {
    try {
      loading.value = true;
      console.log('Enviando datos al servidor...')

      const response = await axios.post("api/pilotos/crear", formData, {
        headers: {
          // "x-token": useUsuario.token
          "x-token": localStorage.getItem('x-token')
        }
      });
      Notify.create({
        message: 'piloto creado correctamente',
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

  const putPiloto = async (identificacion, formData) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/pilotos/editar/${identificacion}`, formData, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'piloto editado correctamente',
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

  const putActivarPiloto = async (identificacion) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/pilotos/activar/${identificacion}`,
        {},
        {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'piloto activado correctamente',
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

  const putDesactivarPiloto = async (identificacion) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/pilotos/desactivar/${identificacion}`,
        {},
        {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'piloto desactivado correctamente',
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
    listarPilotos,
    listarPilotosActivos,
    listarPilotosOrdenados,
    listarPilotosFiltrados,
    obtenerdatospiloto,
    postPilotos,
    putPiloto,
    putActivarPiloto,
    putDesactivarPiloto,
    loading,
    pilotos,
    useUsuario,

  };
}, { persist: true });

