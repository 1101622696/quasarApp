import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";
import { useStoreUsuarios } from "./usuarios";


export const useStoreMantenimiento = defineStore(
    "Mantenimiento",
    () => {
      let loading = ref(false);
      let mantenimientos = ref([]);
      const useUsuario = useStoreUsuarios();


    const listarMantenimientos= async () => {
      loading.value = true
      try {
        let response = await axios.get(`api/mantenimiento`, {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta desde store:', response.data)
        return Array.isArray(response.data) ? response.data : 
               (response.data.mantenimientos || []);
      } catch (error) {
        console.error('No se pudo obtener los mantenimientos', error)
        return []
      } finally {
        loading.value = false
      }
    }


  const listarMantenimientosPorValor = async (payload) => {
    try {
      loading.value = true;
      console.log(` este es el local ${localStorage.getItem('x-token')}`);
      let ruta;
      if (payload == null) ruta = "api/mantenimiento/";
      else ruta=`api/mantenimientos/ordenados?busqueda=${payload}`;
      const response = await axios.get(ruta, {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return response;
    } catch (error) {
      console.error("No se pudo obtener las mantenimientos", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

 const listarMantenimientosOrdenados = async (tipo = 'fecha', orden = 'desc') => {
    loading.value = true;    
    try {
      const response = await axios.get(`api/mantenimiento/ordenados`, {
        params: { tipo, orden },
        headers: {
          "x-token": localStorage.getItem('x-token')
        },
      });
      
      return response.data;
    } catch (err) {
      console.error(`No se pudo obtener los mantenimiento ordenados por ${tipo}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const listarMantenimientosFiltrados = async (tipo, valor) => {
  loading.value = true;
  // console.log(`Enviando petición: tipo=${tipo}, valor=${valor}`);
  
  try {
    const response = await axios.get(`api/mantenimiento/filtrados`, {
      params: { tipo, valor },  // Asegúrate de que estos nombres coincidan con el backend
      headers: {
        "x-token": localStorage.getItem('x-token')
      },
    });
    
    // console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (err) {
    console.error(`No se pudo obtener los mantenimiento filtrados por ${tipo}:`, err);
    console.error("Detalles del error:", err.response?.data || err.message);
    throw err;
  } finally {
    loading.value = false;
  }
};

        const obtenerdatodemantenimiento = async (codigomantenimiento) => {
          loading.value = true
          try {
            let response = await axios.get(`api/mantenimiento/obtenerdatosmantenimiento/${codigomantenimiento}`, {
              headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
              },
            })
            console.log('Respuesta desde store:', response.data)
            return response.data
          } catch (error) {
            console.error('No se pudo obtener los datos del mantenimiento', error)
            return null
          } finally {
            loading.value = false
          }
        }
    

  const postMantenimiento = async (formData) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.post("api/mantenimiento/crear", formData, {
        headers: {
          // "x-token": useUsuario.token
          "x-token": localStorage.getItem('x-token')
        }
      });
      Notify.create({
        message: 'mantenimiento creado correctamente',
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

  const putMantenimiento = async (codigomantenimiento, formData) => {
    try {
      loading.value = true
      console.log('Enviando datos al servidor...')
      const response = await axios.put(`api/mantenimiento/editar/${codigomantenimiento}`, formData, {
        headers: {
          // 'x-token': useUsuario.token,
          "x-token": localStorage.getItem('x-token')
        },
      })
      console.log('Respuesta recibida:', response)

      Notify.create({
        message: 'mantenimiento editado correctamente',
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
    listarMantenimientos,
    listarMantenimientosOrdenados,
    listarMantenimientosFiltrados,
    listarMantenimientosPorValor,
    obtenerdatodemantenimiento,
    postMantenimiento,
    putMantenimiento,
    loading,
    mantenimientos,
    useUsuario,

  };
}, { persist: true });

