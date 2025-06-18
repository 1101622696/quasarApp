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

    const listarSolicitudes = async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes`, {
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

      const listarSolicitudesPorCliente = async (cliente) => {
        loading.value = true
        try {
          let response = await axios.get(`api/solicitudes/porcliente${cliente}`, {
            headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          return Array.isArray(response.data) ? response.data : 
                 (response.data.solicitudes || []);
        } catch (error) {
          console.error('No se pudo obtener si la solicitud por cliente', error)
          return error
        } finally {
          loading.value = false
        }
      }

    const listarSolicitudesPendientes = async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/pendientes`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes pendientes', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarEsSolicitudPendiente = async (consecutivo) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/pendientes/verificar${consecutivo}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener si la solicitud es pendiente', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesAprobadas = async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/aprobadas`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes aprobadas', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesEnproceso = async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/enproceso`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes enproceso', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesCanceladas = async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/canceladas`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes canceladas', error)
        return error
      } finally {
        loading.value = false
      }
    }


    const listarSolicitudesPendientesEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/pendientes/email/${email}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes pendientes por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesAprobadasEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/aprobadas/email/${email}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes aprobadas por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesEnprocesoEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/enproceso/email/${email}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes en proceso por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesCanceladasEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/canceladas/email/${email}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes pendientes por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesEtapasConsecutivo = async (consecutivo) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/etapas/${consecutivo}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return response.data
      } catch (error) {
        console.error('No se pudo obtener las etapas de esa solicitud', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesConEtapas = async () => {
      loading.value = true
      try {
        let response = await axios.get('api/solicitudes/conetapas/', {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las etapas de las solicitudes', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesConEtapasPorEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/conetapas/email/${email}`, {
          headers: {
            "x-token": localStorage.getItem('x-token')
          },
        })
        // console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes con etapas por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesPorEstado = async (estado) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/estadoproceso/${estado}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return response.data
      } catch (error) {
        console.error('No se pudo obtener el estado de solicitudes', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const listarSolicitudesEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/email/${email}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

        const listarSolicitudesPorUltimoEmail = async (email) => {
      loading.value = true
      try {
        let response = await axios.get(`api/solicitudes/ultimoemail/${email}`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.solicitudes || []);
      } catch (error) {
        console.error('No se pudo obtener las solicitudes por email', error)
        return error
      } finally {
        loading.value = false
      }
    }

    const obtenerdatodessolicitud = async (consecutivo) => {
      loading.value = true
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

    return {
      listarSolicitudes,
      listarSolicitudesPorCliente,
      listarSolicitudesAprobadas,
      listarSolicitudesPendientes,
      listarEsSolicitudPendiente,
      listarSolicitudesEnproceso,
      listarSolicitudesCanceladas,
      listarSolicitudesAprobadasEmail,
      listarSolicitudesPendientesEmail,
      listarSolicitudesEnprocesoEmail,
      listarSolicitudesCanceladasEmail,
      listarSolicitudesEmail,
      listarSolicitudesPorUltimoEmail,
      listarSolicitudesEtapasConsecutivo,
      listarSolicitudesConEtapas,
      listarSolicitudesConEtapasPorEmail,
      listarSolicitudesPorEstado,
      obtenerdatodessolicitud,
      postSolicitud,
      putSolicitud,
      putAprobarSolicitud,
      putDenegarSolicitud,
      putCancelarSolicitud,
      loading,
      solicitudes,
      useUsuario,
    }
  },
  { persist: true },
)
