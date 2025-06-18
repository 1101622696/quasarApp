// import { ref, onMounted } from 'vue';
import { ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging'; // Paquete correcto
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useStoreUsuarios } from '../stores/usuarios';

export default function useNotifications() {
  const tokenFCM = ref(null);
  const notificationPermission = ref('default');
  const useUsuario = useStoreUsuarios();
  const notificationsEnabled = ref(false);
  
  // Inicializa las notificaciones
  const inicializarNotificaciones = async () => {
    try {
      // Comprobar si estamos en dispositivo nativo o web
      const isNative = Capacitor.isNativePlatform();
      
      if (isNative) {
        return await inicializarNotificacionesNativas();
      } else {
        return await inicializarNotificacionesWeb();
      }
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
      return false;
    }
  };
  
  // Para dispositivos móviles (Android/iOS)
  const inicializarNotificacionesNativas = async () => {
    try {
      if (Capacitor.getPlatform() === 'android') {
        // Usar FirebaseMessaging para Android
        const { token } = await FirebaseMessaging.getToken();
        console.log('Token FCM obtenido:', token);
        tokenFCM.value = token;
        
        // Registrar para recibir notificaciones
        await FirebaseMessaging.requestPermissions();
        
        // Configurar listeners
        FirebaseMessaging.addListener('notificationReceived', (notification) => {
          console.log('Notificación recibida:', notification);
        });

        FirebaseMessaging.addListener('notificationActionPerformed', (notification) => {
          console.log('Acción realizada en notificación:', notification);
        });
      } else {
        // Usar PushNotifications para iOS
        const permissionStatus = await PushNotifications.requestPermissions();
        
        if (permissionStatus.receive !== 'granted') {
          console.log('Permiso de notificaciones denegado');
          return false;
        }
        
        // Registrar para recibir notificaciones
        await PushNotifications.register();
        
        // Configurar listeners
        PushNotifications.addListener('registration', async (token) => {
          console.log('Token de notificaciones obtenido:', token.value);
          tokenFCM.value = token.value;
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Notificación recibida:', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Acción realizada en notificación:', notification);
        });
      }
      
      // Guardar token en backend
      if (tokenFCM.value) {
        await guardarTokenEnServidor(tokenFCM.value);
        notificationsEnabled.value = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en notificaciones nativas:', error);
      return false;
    }
  };
  
  // Para navegadores web
  const inicializarNotificacionesWeb = async () => {
    try {
      // Comprobar si el navegador soporta notificaciones
      if (!('Notification' in window)) {
        console.log('Este navegador no soporta notificaciones');
        return false;
      }
      
      // Verificar/solicitar permiso
      notificationPermission.value = Notification.permission;
      if (notificationPermission.value !== 'granted') {
        const permission = await Notification.requestPermission();
        notificationPermission.value = permission;
        if (permission !== 'granted') {
          console.log('Permiso de notificaciones denegado');
          return false;
        }
      }
      
      // Configurar Firebase (asegúrate de reemplazar estos valores)
      const firebaseConfig = {
        apiKey: "AIzaSyAs0y_P1sYmyHBkGzoaTqaCbVtig-rjDnw",
        authDomain: "appsva.firebaseapp.com",
        projectId: "appsva",
        storageBucket: "appsva.firebasestorage.app",
        messagingSenderId: "825865011263",
        appId: "com.misva.app"
      };
      
      // Inicializar Firebase solo si no está ya inicializado
      let firebaseApp;
      try {
        firebaseApp = initializeApp(firebaseConfig);
      } catch (err) {
        console.warn('Error al inicializar Firebase, se usará la instancia existente:', err);
        // Si ya está inicializado, obtener la instancia existente
        firebaseApp = initializeApp();
      }
      
      const messaging = getMessaging(firebaseApp);
      
      // Configurar manejo de mensajes en primer plano
      onMessage(messaging, (payload) => {
        console.log('Mensaje recibido en primer plano:', payload);
        // Puedes mostrar una notificación personalizada aquí
        const { title, body } = payload.notification;
        new Notification(title, {
          body,
          icon: '/icons/favicon-128x128.png' // Ajusta la ruta a tu ícono
        });
      });
      
      // Obtener token FCM
      const token = await getToken(messaging, {
        vapidKey: 'BDxCtpJDr8WtwSlTYcDLRz5hxXDaHhdOks98nZCKq6reYNrKTI4rNZZHy0Fw30ofy1lDDHF7lKumdhK0qBBM9OI'
      });
      
      if (!token) {
        console.log('No se pudo obtener token FCM');
        return false;
      }
      
      tokenFCM.value = token;
      
      // Guardar token en backend
      await guardarTokenEnServidor(token);
      notificationsEnabled.value = true;
      
      return true;
    } catch (error) {
      console.error('Error en notificaciones web:', error);
      return false;
    }
  };
  
  // Guardar token en el backend
  const guardarTokenEnServidor = async (token) => {
    try {
      const resultado = await useUsuario.registrarTokenFCM(token);
      return resultado;
    } catch (error) {
      console.error('Error al guardar token en el servidor:', error);
      throw error;
    }
  };
  
  return {
    tokenFCM,
    notificationPermission,
    inicializarNotificaciones,
    notificationsEnabled
  };
}