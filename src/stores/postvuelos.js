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

    const listarPostvuelos = async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/postvuelos`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.postvuelos || []);
      } catch (error) {
        console.error('No se pudo obtener los postvuelos', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarPostvuelosPendientes = async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/postvuelos/pendientes`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.postvuelos || []);
      } catch (error) {
        console.error('No se pudo obtener los postvuelos pendientes', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarEsPostvueloPendiente = async (consecutivo) => {
      loading.value = true
      try {
        let response = await axios.get(`api/postvuelos/pendientes/verificar${consecutivo}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return response.data.EsPendiente;
      } catch (error) {
        console.error('No se pudo obtener si el postvuelo es pendiente', error)
        return error
      } finally {
        loading.value = false
      }
    }  

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
        return Array.isArray(response.data) ? response.data : 
               (response.data.postvuelos || []);
      } catch (error) {
        console.error('No se pudo obtener los postvuelos aprobados', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarPostvuelosPendientesEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/postvuelos/pendientes/email/${email}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.postvuelos || []);
      } catch (error) {
        console.error('No se pudo obtener los postvuelos pendientes por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarPostvuelosAprobadosEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/postvuelos/aprobados/email/${email}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.postvuelos || []);
      } catch (error) {
        console.error('No se pudo obtener los postvuelos aprobados por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

  const listarPostvuelosEtapasConsecutivo = async (consecutivo) => {
        loading.value = true
        try {
          let response = await axios.get(`api/postvuelos/etapas/${consecutivo}`, {
            headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          return response.data
        } catch (error) {
          console.error('No se pudo obtener las etapas de ese postvuelo', error)
          return error
        } finally {
          loading.value = false
        }
      }
  
      const listarPostvuelosConEtapas = async () => {
        loading.value = true
        try {
          let response = await axios.get('api/postvuelos/conetapas/', {
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
          console.error('No se pudo obtener las etapas de los postvuelos', error)
          return error
        } finally {
          loading.value = false
        }
      }

      const listarPostvuelosConEtapasPorEmail = async (email) => {
        loading.value = true
        try {
          
          let response = await axios.get(`api/postvuelos/conetapas/email/${email}`, {
            headers: {
              "x-token": localStorage.getItem('x-token')
            },
          });
          return Array.isArray(response.data) ? response.data : 
                 (response.data.postvuelos || []);
        } catch (error) {
          console.error('No se pudo obtener las postvuelos con etapas por email', error);
          return []; 
        } finally {
          loading.value = false;
        }
      };
  
      const listarPostvuelosPorEstado = async (estado) => {
        loading.value = true
        try {
          let response = await axios.get(`api/postvuelos/estadoproceso/${estado}`, {
            headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          return response.data
        } catch (error) {
          console.error('No se pudo obtener el estado de ese prevuelo', error)
          return error
        } finally {
          loading.value = false
        }
      }


    const listarPostvuelosEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/postvuelos/email/${email}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return response
      } catch (error) {
        console.error('No se pudo obtener las postvuelos por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

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
      listarPostvuelos,
      listarPostvuelosAprobados,
      listarPostvuelosPendientes,
      listarEsPostvueloPendiente,
      listarPostvuelosAprobadosEmail,
      listarPostvuelosPendientesEmail,
      listarPostvuelosEmail,
      listarPostvuelosPorEstado,
      listarPostvuelosConEtapas,
      listarPostvuelosConEtapasPorEmail,
      listarPostvuelosEtapasConsecutivo,
      obtenerdatodepostvuelo,
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
