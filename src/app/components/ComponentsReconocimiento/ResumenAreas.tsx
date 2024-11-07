"use client";

import React, { useState } from 'react';

interface ResumenAreasProps {
  areas: {
    idArea: number;
    nombreArea: string;
    identificacionData: {
      idArea: string;
      areaIluminada: string;
      descripcionSuperficie: string;
    };
    dimensionesData: {
      altura: string;
      largo: string;
      ancho: string;
      indiceArea: number;
    };
    luminariasData: {
      tipoLuminaria: string;
      potencia: number;
      distribucion: string;
      iluminacionLocalizada: string;
      cantidad: number;
    };
    percepcionData: {
      nombreTrabajador: string;
      descripcion: string;
      puesto: string;
    };
    puestosData: {
      indice: number;
      nombrePuesto: string;
      numTrabajadores: number;
      descripcionActividades: string;
      nivelSeleccionado?: number | string;
    }[];
  }[];
}

const ResumenAreas: React.FC<ResumenAreasProps> = ({ areas }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">
        Resumen de Áreas
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {areas.map((area, index) => (
          <div key={area.idArea} className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg shadow-lg overflow-hidden border-l-4 border-blue-500">
            <button
              onClick={() => toggleExpand(index)}
              className="w-full p-4 text-left flex justify-between items-center focus:outline-none"
            >
              <span className="text-2xl font-bold text-gray-700">
                {area.nombreArea} ({area.identificacionData.areaIluminada || 'Sin Nombre'})
              </span>
              <span className="text-xl text-blue-600">{expandedIndex === index ? '-' : '+'}</span>
            </button>
            {expandedIndex === index && (
              <div className="p-6 bg-white">
                {/* Identificación del Área */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Identificación del Área:</h3>
                  <p>ID Área: {area.identificacionData.idArea}</p>
                  <p>Área Iluminada: {area.identificacionData.areaIluminada}</p>
                  <p>Descripción de la Superficie: {area.identificacionData.descripcionSuperficie}</p>
                </div>

                {/* Dimensiones del Área */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Dimensiones del Área:</h3>
                  <p>Altura: {area.dimensionesData.altura} m</p>
                  <p>Largo: {area.dimensionesData.largo} m</p>
                  <p>Ancho: {area.dimensionesData.ancho} m</p>
                  <p>Índice de Área: {area.dimensionesData.indiceArea.toFixed(2)}</p>
                </div>

                {/* Luminarias */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Luminarias:</h3>
                  <p>Tipo de Luminaria: {area.luminariasData.tipoLuminaria}</p>
                  <p>Potencia: {area.luminariasData.potencia} W</p>
                  <p>Distribución: {area.luminariasData.distribucion}</p>
                  <p>Iluminación Localizada: {area.luminariasData.iluminacionLocalizada}</p>
                  <p>Cantidad: {area.luminariasData.cantidad}</p>
                </div>

                {/* Percepción del Trabajo */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Percepción del Trabajo:</h3>
                  <p>Nombre del Trabajador: {area.percepcionData.nombreTrabajador}</p>
                  <p>Descripción: {area.percepcionData.descripcion}</p>
                  <p>Puesto: {area.percepcionData.puesto}</p>
                </div>

                {/* Puestos */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Puestos:</h3>
                  {area.puestosData.map((puesto) => (
                    <div key={puesto.indice} className="mb-4">
                      <p>Puesto #{puesto.indice}</p>
                      <p>Nombre del Puesto: {puesto.nombrePuesto}</p>
                      <p>Número de Trabajadores: {puesto.numTrabajadores}</p>
                      <p>Descripción de Actividades: {puesto.descripcionActividades}</p>
                      <p>Nivel de Iluminación Seleccionado: {puesto.nivelSeleccionado ?? 'No Seleccionado'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumenAreas;
