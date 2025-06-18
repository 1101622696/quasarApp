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


      const listarPrevuelos = async () => {
        loading.value = true
        try {
          let response = await axios.get(`api/prevuelos`, {
            headers: {
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          
          if (response.data && response.data.data && Array.isArray(response.data.data)) {
            return response.data.data;
          }
          else if (Array.isArray(response.data)) {
            return response.data;
          }
          else if (response.data && response.data.prevuelos) {
            return response.data.prevuelos;
          }
          else {
            return [];
          }
        } catch (error) {
          console.error('No se pudo obtener los prevuelos', error)
          return []
        } finally {
          loading.value = false
        }
      }

  const listarPrevuelosPendientes = async () => {
    loading.value = true
    try {
      let response = await axios.get(`api/prevuelos/pendientes`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return Array.isArray(response.data) ? response.data : 
             (response.data.prevuelos || []);
    } catch (error) {
      console.error('No se pudo obtener los prevuelos pendientes', error)
      return error
    } finally {
      loading.value = false
    }
  }

  const listarEsPrevueloPendiente = async (consecutivo) => {
    loading.value = true
    try {
      let response = await axios.get(`api/prevuelos/pendientes/verificar${consecutivo}`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return response.data.EsPendiente;
    } catch (error) {
      console.error('No se pudo obtener si el prevuelo es pendiente', error)
      return error
    } finally {
      loading.value = false
    }
  }

  const listarPrevuelosAprobados = async () => {
    loading.value = true
    try {
      let response = await axios.get(`api/prevuelos/aprobados`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return Array.isArray(response.data) ? response.data : 
             (response.data.prevuelos || []);
    } catch (error) {
      console.error('No se pudo obtener los prevuelos aprobados', error)
      return error
    } finally {
      loading.value = false
    }
  }

  const listarPrevuelosEnproceso = async () => {
    loading.value = true
    try {
      let response = await axios.get(`api/prevuelos/enproceso`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return Array.isArray(response.data) ? response.data : 
             (response.data.prevuelos || []);
    } catch (error) {
      console.error('No se pudo obtener los prevuelos enproceso', error)
      return error
    } finally {
      loading.value = false
    }
  }

  const listarPrevuelosPendientesEmail = async (email) => {
    loading.value = true
    try {
      let response = await axios.get(`api/prevuelos/pendientes/email/${email}`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return Array.isArray(response.data) ? response.data : 
             (response.data.prevuelos || []);
    } catch (error) {
      console.error('No se pudo obtener los prevuelos pendientes por email', error)
      return error
    } finally {
      loading.value = false
    }
  }

  const listarPrevuelosEnprocesoEmail = async (email) => {
    loading.value = true
    try {
      let response = await axios.get(`api/prevuelos/enproceso/email/${email}`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return Array.isArray(response.data) ? response.data : 
             (response.data.prevuelos || []);
    } catch (error) {
      console.error('No se pudo obtener las prevuelos en proceso por email', error)
      return error
    } finally {
      loading.value = false
    }
  }
  
  const listarPrevuelosAprobadosEmail = async (email) => {
    loading.value = true
    try {
      let response = await axios.get(`api/prevuelos/aprobados/email/${email}`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return Array.isArray(response.data) ? response.data : 
             (response.data.prevuelos || []);
    } catch (error) {
      console.error('No se pudo obtener las prevuelos aprobadas por email', error)
      return error
    } finally {
      loading.value = false
    }
  }
  
      const listarPrevuelosEtapasConsecutivo = async (consecutivo) => {
        loading.value = true
        try {
          let response = await axios.get(`api/prevuelos/etapas/${consecutivo}`, {
            headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          return response.data
        } catch (error) {
          console.error('No se pudo obtener las etapas de ese prevuelos', error)
          return error
        } finally {
          loading.value = false
        }
      }
  
      const listarPrevuelosConEtapas = async () => {
        loading.value = true
        try {
          let response = await axios.get('api/prevuelos/conetapas/', {
            headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          return Array.isArray(response.data) ? response.data : (response.data.prevuelos || [])
        } catch (error) {
          console.error('No se pudo obtener las etapas de los prevuelos', error)
          return error
        } finally {
          loading.value = false
        }
      }

      const listarPrevuelosConEtapasPorEmail = async (email) => {
        loading.value = true
        try {
          let response = await axios.get(`api/prevuelos/conetapas/email/${email}`, {
            headers: {
              "x-token": localStorage.getItem('x-token')
            },
          });
          return Array.isArray(response.data) ? response.data : 
                 (response.data.prevuelos || []);
        } catch (error) {
          console.error('No se pudo obtener los prevuelos con etapas por email', error);
          return [];  
        } finally {
          loading.value = false;
        }
      };
  
      const listarPrevuelosPorEstado = async (estado) => {
        loading.value = true
        try {
          let response = await axios.get(`api/prevuelos/estadoproceso/${estado}`, {
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

  const listarPrevuelosEmail = async (email) => {
    loading.value = true
    try {
      let response = await axios.get(`api/prevuelos/email/${email}`, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta desde store:', response.data)
      return response
    } catch (error) {
      console.error('No se pudo obtener los prevuelos por email', error)
      return error
    } finally {
      loading.value = false
    }
  }

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
    listarPrevuelos,
    listarPrevuelosAprobados,
    listarPrevuelosPendientes,
    listarEsPrevueloPendiente,
    listarPrevuelosEnproceso,
    listarPrevuelosAprobadosEmail,
    listarPrevuelosEtapasConsecutivo,
    listarPrevuelosConEtapas,
    listarPrevuelosConEtapasPorEmail,
    listarPrevuelosPorEstado,
    listarPrevuelosPendientesEmail,
    listarPrevuelosEnprocesoEmail,
    listarPrevuelosEmail,
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

