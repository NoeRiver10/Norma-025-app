// src/app/components/ComponentsReconocimiento/Luminarias.tsx
"use client";

import { useHandleChange } from '../../hooks/useHandleChange';

interface PercepcionProps {
  data: {
    nombreTrabajador: string;
    descripcion: string;
    puesto: string;
  };
  setData: React.Dispatch<React.SetStateAction<{
    nombreTrabajador: string;
    descripcion: string;
    puesto: string;
  }>>;
}

export default function Percepcion({ data, setData }: PercepcionProps) {
  const handleChange = useHandleChange<{
    nombreTrabajador: string;
    descripcion: string;
    puesto: string;
  }>(setData);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Percepción del Trabajador
      </h2>
      <form className="space-y-6">
        {/* Nombre del Trabajador */}
        <div>
          <label htmlFor="nombreTrabajador" className="block text-lg font-semibold text-gray-800 mb-2">
            Nombre del Trabajador:
          </label>
          <input
            type="text"
            id="nombreTrabajador"
            name="nombreTrabajador"
            value={data.nombreTrabajador}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Ingrese el nombre del trabajador"
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-lg font-semibold text-gray-800 mb-2">
            Descripción de la Percepción:
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={data.descripcion}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Ingrese una descripción"
          />
        </div>

        {/* Puesto del Trabajador */}
        <div>
          <label htmlFor="puesto" className="block text-lg font-semibold text-gray-800 mb-2">
            Puesto del Trabajador:
          </label>
          <textarea
            id="puesto"
            name="puesto"
            value={data.puesto}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Ingrese el puesto del trabajador"
          />
        </div>
      </form>
    </div>
  );
}
