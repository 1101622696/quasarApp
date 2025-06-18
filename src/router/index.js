import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useStoreUsuarios } from '../stores/usuarios.js'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })
 
  // esto es del nuevo beforeEach, por lo del rol 
  Router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    if (to.meta.perfiles) {
      const useUsuario = useStoreUsuarios();
      const userRole = useUsuario.perfile;
      const token = useUsuario.token;
      console.log('Token existe:', !!useUsuario.token);
      console.log('perfil de usuario:', useUsuario.perfile);
      // const userRole = useUsuario.perfile;
      
      console.log('Current perfil de usuario:', userRole);
      console.log('Required profiles:', to.meta.perfiles);
      
      // If there's no profile or token, redirect to login
      if (!userRole || !token) {
        console.log('redirigiendo al login - no hay token o perfil');
      console.log('Token existe sin saber porque se pierde el token:', !!useUsuario.token);
        useUsuario.eliminarToken(); // Limpiar para asegurar
        return next('/');
      }
      // Check if user has the required profile
      if (to.meta.perfiles.includes(userRole)) {
        console.log('Usuario autorizado');
        return next();
      } else {
        console.log('usuario no autorizado para esta ruta');
        // Redirect to home or unauthorized page
        return next('/IndexPage');
      }
    }
    
    // Routes without profile restrictions
    return next();
  });

  return Router
})
