// Importa el paquete `next-pwa`
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', // Desactiva PWA en desarrollo para evitar problemas de caché
  });
  
  // Exporta la configuración de Next.js con la configuración de PWA
  module.exports = withPWA({
    reactStrictMode: true, // Puedes agregar otras configuraciones de Next.js aquí
  });
  