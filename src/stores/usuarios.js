import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";


export const useStoreUsuarios = defineStore("Usuarios", () => {
  const token = ref(localStorage.getItem('x-token') || "");

  const loading = ref(false);
  const usuarios = ref([]);
  const user = ref({});
  const perfile = ref("");  
  const correo = ref("");  

      const listarUsuario = async () => {
        loading.value = true
        try {
          let response = await axios.get(`api/usuarios`, {
            headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          // Return just the data array
          return Array.isArray(response.data) ? response.data : 
                 (response.data.usuarios || []);
        } catch (error) {
          console.error('No se pudo obtener los usuarios', error)
          return []
        } finally {
          loading.value = false
        }
      }

      const listarUsuariosActivos = async () => {
        loading.value = true
        try {
          let response = await axios.get(`api/usuarios/aprobadas`, {
            headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          return Array.isArray(response.data) ? response.data : 
                 (response.data.usuarios || []);
        } catch (error) {
          console.error('No se pudo obtener las usuarios aprobadas', error)
          return error
        } finally {
          loading.value = false
        }
      }

      const listarUsuariosInactivos = async () => {
        loading.value = true
        try {
          let response = await axios.get(`api/usuarios/aprobadas`, {
            headers: {
              // 'x-token': useUsuario.token,
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          return Array.isArray(response.data) ? response.data : 
                 (response.data.usuarios || []);
        } catch (error) {
          console.error('No se pudo obtener las usuarios aprobadas', error)
          return error
        } finally {
          loading.value = false
        }
      }

      const listardatosUsuario = async (email) => {
        loading.value = true
        try {
          let response = await axios.get(`api/usuarios/poremail/${email}`, {
            headers: {
              "x-token": localStorage.getItem('x-token')
            },
          })
          console.log('Respuesta desde store:', response.data)
          return response.data
        } catch (error) {
          console.error('No se pudo obtener los usuarios', error)
          return error
        } finally {
          loading.value = false
        }
      }

  const listarUsuariosFiltrados = async (tipo, valor) => {
  loading.value = true;
  // console.log(`Enviando petición: tipo=${tipo}, valor=${valor}`);
  
  try {
    const response = await axios.get(`api/usuarios/filtrados`, {
      params: { tipo, valor }, 
      headers: {
        "x-token": localStorage.getItem('x-token')
      },
    });
    
    // console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (err) {
    console.error(`No se pudo obtener los usuarios filtrados por ${tipo}:`, err);
    console.error("Detalles del error:", err.response?.data || err.message);
    throw err;
  } finally {
    loading.value = false;
  }
};

  const postUsuario = async (data) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.post("api/usuarios/crear", data, {
        headers: {
          // "x-token": useStoreUsuarios().token
          "x-token": localStorage.getItem('x-token')
        }
      });
      Notify.create({
        message: 'usuario creado correctamente',
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

const registrarTokenFCM = async (token) => {
  try {
    loading.value = true;
    
    // Verificar si ya hay un token guardado
    const tokenActual = localStorage.getItem('fcm-token');
    
    // Si es el mismo token, no hay necesidad de enviarlo de nuevo
    if (tokenActual === token) {
      console.log('El token FCM ya está registrado');
      return { success: true };
    }
    
    // Guardar token en localStorage para referencia futura
    localStorage.setItem('fcm-token', token);
    
    const response = await axios.post("api/usuarios/registrar-token-fcm", 
      { token },
      {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      }
    );
    
    Notify.create({
      message: 'Notificaciones activadas correctamente',
      color: "positive",
      position: "bottom",
    });
    
    return response.data;
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.msg || 'Error al registrar notificaciones'
    });
    console.error(error);
    return { success: false };
  } finally {
    loading.value = false;
  }
};

  const putUsuarios = async (email, data) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.put(`api/usuarios/editar/${email}`, data, {
        headers: {
          // "x-token": useStoreUsuarios().token
          "x-token": localStorage.getItem('x-token')
        }
      });

      Notify.create({
        message: 'usuario actualizado correctamente',
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
  }finally {
      loading.value = false;
    }
  };
  const eliminarToken = () => {
    token.value = ""; 
    localStorage.removeItem('x-token');
    localStorage.removeItem('usuarios-store'); // Elimina también el store persistido
    user.value = {};
    perfile.value = "";
    correo.value = "";
    console.log('Token cleared');
  };
  
  // Update token setter
  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem('x-token', newToken);
    console.log('Token set:', newToken.substring(0, 10) + '...');
  };
  
  
   const login = async (email, password) => {
    try {
      // console.log('Iniciando solicitud de login a:', axios.defaults.baseURL + '/api/usuarios/login');
      const res = await axios.post("api/usuarios/login", { email, password }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true 
      });
      setToken(res.data.token)
      // token.value = res.data.token;
      user.value = res.data.usuario;
      perfile.value = res.data.usuario.perfil;
      correo.value = res.data.usuario.email;

      // localStorage.setItem('x-token', res.data.token);

// esto me sirvió para la aplicacion pero ya se puede eliminar porque ya no neesito esto 
      // console.log('Token guardado:', res.data.token); 
      // console.log('Perfil usuario:', perfile.value);
      // console.log('Intentando login con:', { email });
      // console.log('URL base:', axios.defaults.baseURL);

      Notify.create({
        message: 'Usuario registrado correctamente',
        color: "positive",
        position: "top",
      });

      console.log(res);
      console.log('Respuesta exitosa:', res.data);
      return res;
    } catch (error) {
      console.error('Error detallado:', error);
      // Manejo robusto del error
      let errorMessage = 'Usuario o contraseña incorrecta';
      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors[0] && error.response.data.errors[0].msg) {
        errorMessage = error.response.data.errors[0].msg;
      } else if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      Notify.create({
        type: 'negative',
        message: errorMessage,
      });
      console.log("Error en el login", error);
      return error;
    }
  };

  const validaremail = async (email) => {
    try {
      const res = await axios.get(`api/usuarios/email?email=${email}`);
      localStorage.setItem('x-token', res.data.token);
      return res;
    } catch (error) {
      console.error("No se pudo obtener la informacion requerida", error);
      return error;
    }};

    const putUsuariospassword = async (email, data) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        const response = await axios.put(`api/usuarios/editarpassword/${email}`, data, {
          headers: {
            // "x-token": useStoreUsuarios().token
            "x-token": localStorage.getItem('x-token')
          }
        });
        return response;
      } catch (error) {
        console.log("No se pudo actualizar el usuario", error);
        return error;
      } finally {
        loading.value = false;
      }
    };

    const putActivarUsuario =  async (email) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.put(`api/usuarios/activar/${email}`,
          {},
          {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'usuario activado',
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

    const putInactivarUsuario =  async (email) => {
      try {
        loading.value = true
        console.log('Enviando datos al servidor...')
        const response = await axios.put(`api/usuarios/inactivar/${email}`,
          {},
          {
          headers: {
            // 'x-token': useUsuario.token,
            "x-token": localStorage.getItem('x-token')
          },
        })
        console.log('Respuesta recibida:', response)

        Notify.create({
          message: 'usuario inactivado',
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
    listarUsuario,
    listarUsuariosActivos,
    listarUsuariosInactivos,
    listardatosUsuario,
    listarUsuariosFiltrados,
    postUsuario,
    putUsuarios,
    registrarTokenFCM,
    login,
    validaremail,
    putUsuariospassword,
    putActivarUsuario,
    putInactivarUsuario,
    token,
    loading,
    usuarios,
    user,
    perfile,
    correo,
    eliminarToken
  };
}, 
// { persist: true });
{
  persist: {
    key: 'usuarios-store',
    storage: localStorage,
    paths: ['token', 'user', 'perfile', 'correo'] // Specify which state to persist
  }
});
