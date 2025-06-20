import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useStoreUsuarios } from './usuarios'

export const useStoreSolicitudes = defineStore(
  'Solicitud',
  () => {
    let loading = ref(false)
    let solicitudes = ref([])
    const useUsuario = useStoreUsuarios()

const obtenerResumenPorEmail = async (email) => {
  loading.value = true
  try {
    let response = await axios.get(`api/solicitudes/resumen/email/${email}`, {
      headers: {
        "x-token": localStorage.getItem('x-token')
      },
    })
    console.log('Respuesta resumen por email:', response.data)
    return response.data 
  } catch (error) {
    console.error('No se pudo obtener el resumen por email', error)
    return { resumen: null }
  } finally {
    loading.value = false
  }
}

const obtenerResumenPorSolicitante = async (email) => {
  loading.value = true
  try {
    // CORREGIR: faltaba la barra antes de /email
    let response = await axios.get(`api/solicitudes/resumensolicitante/email/${email}`, {
      headers: {
        "x-token": localStorage.getItem('x-token')
      },
    })
    console.log('Respuesta resumen solicitante:', response.data)
    return response.data // Retornar toda la respuesta
  } catch (error) {
    console.error('No se pudo obtener el resumen del solicitante', error)
    return { resumen: null }
  } finally {
    loading.value = false
  }
}

const obtenerResumenJefe = async () => {
  loading.value = true
  try {
    let response = await axios.get(`api/solicitudes/resumenjefe`, {
      headers: {
        "x-token": localStorage.getItem('x-token')
      },
    })
    console.log('Respuesta resumen jefe:', response.data)
    return response.data
  } catch (error) {
    console.error('No se pudo obtener el resumen del jefe', error)
    return { resumen: null }
  } finally {
    loading.value = false
  }
}

    const obtenerEstadoConsecutivo = async (consecutivo) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/emailestado/consecutivo/${consecutivo}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
       return response.data
      } catch (error) {
        console.error('No se pudo obtener las solicitudes', error)
        return []
      } finally {
        loading.value = false
      }
    }

    const obtenerConsecutivosFiltrado = async (estado) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/emailestado/estado/${estado}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes', error)
        return []
      } finally {
        loading.value = false
      }
    }

    const obtenerBusquedaAvanzada = async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/buscar`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes', error)
        return []
      } finally {
        loading.value = false
      }
    }

    const obtenerdatodessolicitud = async (consecutivo) => {
      try {
        let response = await axios.get(`api/solicitudes/obtenerdatossolicitud/${consecutivo}`, {
          headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return response.data
      } catch (error) {
        console.error('No se pudo obtener los datos de la solicitud', error)
        return null
      } finally {
        loading.value = false
      }
    }

    const postSolicitud = async (formData) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.post('api/solicitudes/crear', formData, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'solicitud creada correctamente',
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

    const putSolicitud = async (consecutivo, formData) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.put(`api/solicitudes/editar/${consecutivo}`, formData, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'solicitud editada correctamente',
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


    const putAprobarSolicitud = async (consecutivo, numeroserie, piloto, notas = '') => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        
        const response = await axios.put(
          `api/solicitudes/aprobar/${consecutivo}`,
          {
            numeroserie,
            piloto,
            notas
          },
          {
            headers: {
              "x-token": localStorage.getItem('x-token')
            },
          }
        )
        
        console.log('Respuesta recibida:', response)
        
        Notify.create({
          message: 'Solicitud aprobada correctamente',
          color: 'positive',
          position: 'bottom',
        })
        
        return response
      } catch (error) {
        Notify.create({
          type: 'negative',
          message: error.response?.data?.errors?.[0]?.msg || 'Error al aprobar la solicitud',
        })
        loading.value = true
        console.log(error)
        return error
      } finally {
        loading.value = false
      }
    }

    const putDenegarSolicitud =  async (consecutivo) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.put(`api/solicitudes/denegar/${consecutivo}`,
          {},
          {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'solicitud denegada',
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

    const putCancelarSolicitud =  async (consecutivo) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.put(`api/solicitudes/cancelar/${consecutivo}`,
          {},
          {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'solicitud cancelada',
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

    const putEnesperaSolicitud =  async (consecutivo) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.put(`api/solicitudes/enespera/${consecutivo}`,
          {},
          {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'solicitud puesta en espera',
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
      obtenerdatodessolicitud,
      obtenerResumenPorEmail,
      obtenerResumenPorSolicitante,
      obtenerResumenJefe,
      obtenerEstadoConsecutivo,
      obtenerConsecutivosFiltrado,
      obtenerBusquedaAvanzada,
      postSolicitud,
      putSolicitud,
      putAprobarSolicitud,
      putDenegarSolicitud,
      putCancelarSolicitud,
      putEnesperaSolicitud,
      loading,
      solicitudes,
      useUsuario,
    }
  },
  { persist: true },
)
