"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaHome, FaUserCircle } from 'react-icons/fa'; // Importando íconos

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Simulación de conexión a una plataforma para habilitar Norma 25

    if ('serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registrado con éxito:', registration);
          if (registration.installing) {
            console.log('Service Worker instalándose');
          } else if (registration.waiting) {
            console.log('Service Worker esperando');
          } else if (registration.active) {
            console.log('Service Worker activo');
          }
        } catch (error) {
          console.error('Error al registrar el Service Worker:', error);
        }
      };
      window.addEventListener('load', registerServiceWorker);
    } else {
      console.log('Service Worker no es compatible con este navegador');
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const isActive = (linkPath) => pathname === linkPath;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex">
      {/* Botón para abrir/cerrar la barra lateral */}
      <button
        onClick={toggleSidebar}
        className="p-4 bg-blue-600 text-white fixed top-4 left-4 z-10 rounded-lg shadow-lg lg:hidden"
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
      >
        <div className="w-6 h-6 flex flex-col justify-between">
          <span className="block w-full h-0.5 bg-white"></span>
          <span className="block w-full h-0.5 bg-white"></span>
          <span className="block w-full h-0.5 bg-white"></span>
        </div>
      </button>

      {/* Barra Lateral Desplegable con Botón */}
      <aside
        id="sidebar"
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transform lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:relative top-0 left-0 w-64 lg:w-1/4 bg-blue-600 text-white p-6 h-full lg:h-auto shadow-lg z-10`}
        role="navigation"
        aria-label="Barra lateral de navegación"
      >
        <button
          onClick={toggleSidebar}
          className="p-2 bg-blue-500 text-white rounded-lg shadow-lg lg:hidden mb-4"
        >
          <div className="w-6 h-6 flex flex-col justify-between">
            <span className="block w-full h-0.5 bg-white"></span>
            <span className="block w-full h-0.5 bg-white"></span>
            <span className="block w-full h-0.5 bg-white"></span>
          </div>
        </button>
        <nav className="space-y-4">
          <h2 className="text-xl font-bold mb-6">Navegación</h2>
          <ul>
            <li>
              <Link
                href="/Reconocimiento"
                className={`text-lg hover:underline flex items-center ${isActive('/Reconocimiento') ? 'font-bold underline' : ''}`}
                onClick={handleLinkClick}
              >
                <FaHome className="mr-2" /> Reconocimiento
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <div className="container mx-auto p-4 w-full lg:w-4/5">
        {/* Encabezado con Información de la Empresa */}
        <header className="bg-white shadow p-4 rounded-lg mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/icons/lictus-logo-1-192x192.png" alt="Logo Lictus" className="w-16 h-16 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Lictus S.A. de C.V.</h1>
              <p className="text-gray-600">Soluciones en Seguridad y Salud en el Trabajo</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center">
            <FaUserCircle className="text-4xl text-gray-800 mr-2" />
            <p className="text-lg text-gray-800">Bienvenido, Usuario</p>
          </div>
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
          <p>&copy; 2024 Lictus S.A. de C.V. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
