// // import { createRouter, createWebHashHistory } from 'vue-router';
// // import { useStoreUsuarios } from '../stores/usuarios.js'; // Ajusta esta ruta según tu estructura

import LoginPage from '../pages/LoginPage.vue';
import RescontrasenaPage from '../pages/RescontrasenaPage.vue';
import Home from '../layouts/MainLayout.vue'; 

const routes = [
  { 
    path: '/', 
    component: LoginPage 
  },
  { 
    path: '/Rescontrasena', 
    component: RescontrasenaPage 
  },
  { 
    path: '/IndexPage', 
    component: Home,
    children: [
      { path: '', component: () => import('../pages/HomePage.vue') },
      { 
        path: 'HomePage', 
        name: 'HomePage', 
        component: () => import('../pages/HomePage.vue'),
        meta: { perfiles: ['jefepiloto', 'coordinador', 'piloto', 'cliente'] } 
      },
      { 
        path: 'gpsPage', 
        name: 'gpsPage', 
        component: () => import('../pages/gpsPage.vue'),
        meta: { perfiles: ['jefepiloto'] } 
      },
      { 
        path: 'Solicitudes', 
        name: 'SolicitudesPage', 
        component: () => import('../pages/SolicitudesPage.vue'),
        meta: { perfiles: ['jefepiloto', 'coordinador', 'cliente'] }
      },
      { 
        path: 'PilotosPage', 
        name: 'PilotosPage', 
        component: () => import('../pages/PilotosPage.vue'),
        meta: { perfiles: ['jefepiloto', 'cliente'] }
      },
      { 
        path: 'DronesPage', 
        name: 'DronesPage', 
        component: () => import('../pages/DronesPage.vue'),
        meta: { perfiles: ['jefepiloto', 'cliente'] }
      },
      { 
        path: 'MantenimientoPage', 
        name: 'MantenimientoPage', 
        component: () => import('../pages/MantenimientoPage.vue'),
        meta: { perfiles: ['jefepiloto'] }
      },
      { 
        path: 'LookerPage', 
        name: 'LookerPage', 
        component: () => import('../pages/LookerPage.vue'),
        meta: { perfiles: ['jefepiloto', 'cliente'] }
      },
      { 
        path: 'BitacoraPage', 
        name: 'BitacoraPage', 
        component: () => import('../pages/BitacoraPage.vue'),
        meta: { perfiles: ['jefepiloto', 'coordinador', 'piloto', 'cliente'] }
      },
      { 
        path: 'UsuariosPage', 
        name: 'UsuariosPage', 
        component: () => import('../pages/UsuariosPage.vue'),
        meta: { perfiles: ['jefepiloto'] }
      }
    ]
  },
  // Ruta para manejar rutas no encontradas
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
];


export default routes;




// const routes = [
//   {
//     path: '/',
//     component: () => import('layouts/MainLayout.vue'),
//     children: [
//       { path: '', component: () => import('pages/IndexPage.vue') },
//       { path: 'gpsPage', name: 'gpsPage', component: () => import('pages/gpsPage.vue') },
//       { path: 'PrevuelosPage', name: 'PrevuelosPage', component: () => import('pages/PrevuelosPage.vue') },
//       { path: 'PostvuelosPage', name: 'PostvuelosPage', component: () => import('pages/PostvuelosPage.vue') },
//       { path: 'SolicitudesPage', name: 'SolicitudesPage', component: () => import('pages/SolicitudesPage.vue') },
//       { path: 'AprobarvueloPage', name: 'AprobarvueloPage', component: () => import('pages/AprobarvueloPage.vue') },
//       { path: 'AprobarprevueloPage', name: 'AprobarprevueloPage', component: () => import('pages/AprobarprevueloPage.vue') },
//       { path: 'AprobarpostvueloPage', name: 'AprobarpostvueloPage', component: () => import('pages/AprobarpostvueloPage.vue') },
//       { path: 'PilotosPage', name: 'PilotosPage', component: () => import('pages/PilotosPage.vue') },
//       { path: 'DronesPage', name: 'DronesPage', component: () => import('pages/DronesPage.vue') },
//       { path: 'MantenimientoPage', name: 'MantenimientoPage', component: () => import('pages/MantenimientoPage.vue') },
//       { path: 'LookerPage', name: 'LookerPage', component: () => import('pages/LookerPage.vue') },
//       { path: 'BitacoraPage', name: 'BitacoraPage', component: () => import('pages/BitacoraPage.vue') },
//       { path: 'UsuariosPage', name: 'UsuariosPage', component: () => import('pages/UsuariosPage.vue') },
//       // { path: 'LoginPage', name: 'LoginPage', component: () => import('pages/LoginPage.vue') }

//     ]
//   },

//   // Always leave this as last one,
//   // but you can also remove it
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/ErrorNotFound.vue')
//   }
// ]

// export default routes


