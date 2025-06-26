import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useStoreUsuarios } from './usuarios'

export const useStorePostvuelos = defineStore(
  'Postvuelo',
  () => {
    let loading = ref(false)
    let postvuelos = ref([])
    const useUsuario = useStoreUsuarios()

        const listarPostvuelosAprobados = async () => {
          loading.value = true
          try {
            let response = await axios.get(`api/postvuelos/aprobados`, {
              headers: {
                // 'x-token': useUsuario.token,
                "x-token": localStorage.getItem('x-token')
              },
            })
            console.log('Respuesta desde store:', response.data)
            // Return just the data array
            return Array.isArray(response.data) ? response.data : 
                   (response.data.postvuelos || []);
          } catch (error) {
            console.error('No se pudo obtener los postvuelos', error)
            return []
          } finally {
            loading.value = false
          }
        }

  const listarPostvuelosOrdenados = async (tipo = 'fecha', orden = 'desc') => {
    loading.value = true;    
    try {
      const response = await axios.get(`api/postvuelos/ordenados`, {
        params: { tipo, orden },
        headers: {
          "x-token": localStorage.getItem('x-token')
        },
      });
      
      return response.data;
    } catch (err) {
      console.error(`No se pudo obtener los postvuelos ordenados por ${tipo}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

    const obtenerdatodepostvuelo = async (consecutivo) => {
      loading.value = true
      try {
        let response = await axios.get(`api/postvuelos/obtenerdatospostvuelo/${consecutivo}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return response.data
      } catch (error) {
        console.error('No se pudo obtener los datos del postvuelo', error)
        return null
      } finally {
        loading.value = false
      }
    }

    const postPostvuelo = async (formData) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.post('api/postvuelos/crear', formData, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'postvuelo creado correctamente',
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

    const putPostvuelo = async (consecutivo, formData) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.put(`api/postvuelos/editar/${consecutivo}`, formData, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'postvuelo editado correctamente',
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

    const putAprobarPostvuelo = async (consecutivo) => {
          try {
            loading.value = true
            console.log('Enviando datos al servidor...')
            const response = await axios.put(`api/postvuelos/aprobar/${consecutivo}`,
              {},
              {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'postvuelo aprobado correctamente',
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

    const putDenegarPostvuelo = async (consecutivo) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.put(`api/postvuelos/denegar/${consecutivo}`,
          {},
          {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'postvuelo denegado',
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
      obtenerdatodepostvuelo,
      listarPostvuelosAprobados,
      listarPostvuelosOrdenados,
      postPostvuelo,
      putPostvuelo,
      putAprobarPostvuelo,
      putDenegarPostvuelo,
      loading,
      postvuelos,
      useUsuario,
    }
  },
  { persist: true },
)
