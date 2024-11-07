"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';  // Añadido useEffect

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registrado con éxito:', registration);
            if (registration.installing) {
              console.log('Service Worker instalándose');
            } else if (registration.waiting) {
              console.log('Service Worker esperando');
            } else if (registration.active) {
              console.log('Service Worker activo');
            }
          })
          .catch((error) => {
            console.error('Error al registrar el Service Worker:', error);
          });
      });
    } else {
      console.log('Service Worker no es compatible con este navegador');
    }
    
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      {/* Botón para abrir/cerrar la barra lateral */}
      <button
        onClick={toggleSidebar}
        className="p-4 bg-blue-600 text-white fixed top-4 left-4 z-10 rounded-lg shadow-lg lg:hidden"
      >
        {isSidebarOpen ? 'Cerrar Menú' : 'Abrir Menú'}
      </button>

      {/* Barra Lateral Desplegable */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transform lg:translate-x-0 transition-transform fixed lg:relative top-0 left-0 w-64 lg:w-1/4 bg-blue-600 text-white p-6 h-full lg:h-auto shadow-lg z-10`}
      >
        <nav className="space-y-4">
          <h2 className="text-xl font-bold mb-6">Navegación</h2>
          <ul>
            <li>
              <Link href="/Reconocimiento" className="text-lg hover:underline">Reconocimiento</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <div className="container mx-auto p-4 w-full lg:w-3/4">
        {/* Encabezado */}
        <header className="bg-white shadow p-4 rounded-lg mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            NORMA Oficial Mexicana NOM-025-STPS-2008
          </h1>
        </header>

        {/* Información General */}
        <section className="generalInfo bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Levantamiento NORMA Oficial Mexicana NOM-025-STPS-2008
          </h2>
          <p className="text-lg text-gray-700">
            Bienvenido a la página de levantamiento de la NORMA Oficial Mexicana
            NOM-025-STPS-2008. Esta norma está enfocada en las condiciones de
            iluminación de los centros de trabajo.
          </p>
        </section>

        {/* Footer */}
        <footer className="footer text-center p-4 bg-gray-100 w-full">
          <p>&copy; 2024 NOM-025-STPS-2008. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
