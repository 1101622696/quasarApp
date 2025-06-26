import { Capacitor } from '@capacitor/core';

export default () => {
  // Solo configurar Firebase si estamos en un dispositivo nativo
  if (Capacitor.isNativePlatform()) {
    console.log('Firebase configurado para dispositivo nativo');
  }
}