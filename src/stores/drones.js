import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useStoreUsuarios } from "./usuarios";


export const useStoreDrones = defineStore(
    "Dron",
    () => {
      let loading = ref(false);
      let drones = ref([]);
      const useUsuario = useStoreUsuarios();


      const listarDrones = async () => {
        loading.value = true
        try {
          let response = await axios.get(`api/drones`, {
            headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          // Return just the data array
          return Array.isArray(response.data) ? response.data : 
                 (response.data.drones || []);
        } catch (error) {
          console.error('No se pudo obtener los drones', error)
          return []
        } finally {
          loading.value = false
        }
      }

  const listarDronesActivos = async () => {
    loading.value = true
    try {
      let response = await axios.get(`api/drones/activos`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return response
    } catch (error) {
      console.error('No se pudo obtener los drones activos', error)
      return error
    } finally {
      loading.value = false
    }
  };

    const listarDronesInactivos = async () => {
    loading.value = true
    try {
      let response = await axios.get(`api/drones/inactivos`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return response
    } catch (error) {
      console.error('No se pudo obtener los drones inactivos', error)
      return error
    } finally {
      loading.value = false
    }
  };

  const listarDronesActivosNoOcupados = async () => {
    loading.value = true
    try {
      let response = await axios.get(`api/drones/activosnoOcupados`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return Array.isArray(response.data) ? response.data : 
             (response.data.drones || []);
    } catch (error) {
      console.error('No se pudo obtener los drones activos no ocupados', error)
      return error
    } finally {
      loading.value = false
    }
  };

 const listarDronesOrdenados = async (tipo = 'fecha', orden = 'desc') => {
    loading.value = true;    
    try {
      const response = await axios.get(`api/drones/ordenados`, {
        params: { tipo, orden },
        headers: {
          "x-token": localStorage.getItem('x-token')
        },
      });
      
      return response.data;
    } catch (err) {
      console.error(`No se pudo obtener los drones ordenados por ${tipo}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const listarDronesFiltrados = async (tipo, valor) => {
  loading.value = true;
  // console.log(`Enviando petición: tipo=${tipo}, valor=${valor}`);
  
  try {
    const response = await axios.get(`api/drones/filtrados`, {
      params: { tipo, valor },  // Asegúrate de que estos nombres coincidan con el backend
      headers: {
        "x-token": localStorage.getItem('x-token')
      },
    });
    
    // console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (err) {
    console.error(`No se pudo obtener los drones filtrados por ${tipo}:`, err);
    console.error("Detalles del error:", err.response?.data || err.message);
    throw err;
  } finally {
    loading.value = false;
  }
};

  const obtenerdatosdron = async (numeroserie) => {
    loading.value = true
    try {
      let response = await axios.get(`api/drones/obtenerdatosdron/${numeroserie}`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return response.data
    } catch (error) {
      console.error('No se pudo obtener los datos del dron', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const postDron = async (formData) => {
    try {
      loading.value = true;
      console.log('Enviando datos al servidor...')

      const response = await axios.post("api/drones/crear", formData, {
        headers: {
          // "x-token": useUsuario.token
          "x-token": localStorage.getItem('x-token')
        }
      });
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'dron creado correctamente',
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

  const putDron = async (numeroserie, formData) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/drones/editar/${numeroserie}`, formData, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'dron editado correctamente',
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

  const putActivarDron = async (numeroserie) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/drones/activar/${numeroserie}`,
        {},
        {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'dron activado correctamente',
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

  const putDesactivarDron = async (numeroserie) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/drones/activar/${numeroserie}`,
        {},
        {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'dron desactivado correctamente',
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
    listarDrones,
    listarDronesActivos,
    listarDronesInactivos,
    listarDronesActivosNoOcupados,
    listarDronesOrdenados,
    listarDronesFiltrados,
    obtenerdatosdron,
    postDron,
    putDron,
    putActivarDron,
    putDesactivarDron,
    loading,
    drones,
    useUsuario,

  };
}, { persist: true });

