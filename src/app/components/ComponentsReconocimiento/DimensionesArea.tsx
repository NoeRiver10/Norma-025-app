// src/app/components/ComponentsReconocimiento/DimensionesArea.tsx
"use client";

import { useEffect } from 'react';
import { useHandleChange } from '../../hooks/useHandleChange';

interface DimensionesAreaProps {
  data: {
    altura: string;
    largo: string;
    ancho: string;
    indiceArea: number;
  };
  setData: React.Dispatch<React.SetStateAction<{
    altura: string;
    largo: string;
    ancho: string;
    indiceArea: number;
  }>>;
}

const calculateIndiceArea = (altura: string, largo: string, ancho: string): number => {
  const alturaParsed = parseFloat(altura) || 0;
  const largoParsed = parseFloat(largo) || 0;
  const anchoParsed = parseFloat(ancho) || 0;

  if (alturaParsed > 0 && largoParsed + anchoParsed > 0) {
    return (largoParsed * anchoParsed) / (alturaParsed * (largoParsed + anchoParsed));
  }
  return 0;
};

const calculateMinAreas = (indiceArea: number): number => {
  if (indiceArea < 1) return 4;
  if (indiceArea < 2) return 9;
  if (indiceArea < 3) return 16;
  return 25;
};

const calculateMaxAreas = (indiceArea: number): number => {
  if (indiceArea < 1) return 6;
  if (indiceArea < 2) return 12;
  if (indiceArea < 3) return 20;
  return 30;
};

export default function DimensionesArea({ data, setData }: DimensionesAreaProps) {
  const handleChange = useHandleChange<{
    altura: string;
    largo: string;
    ancho: string;
    indiceArea: number;
  }>(setData);

  useEffect(() => {
    const calculatedIC = calculateIndiceArea(data.altura, data.largo, data.ancho);
    if (calculatedIC !== data.indiceArea) {
      setData((prevData) => ({
        ...prevData,
        indiceArea: calculatedIC,
      }));
    }
  }, [data.altura, data.largo, data.ancho, data.indiceArea, setData]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-center text-blue-600">
        Dimensiones del Área
      </h2>
      <form className="space-y-6">
        {/* Altura */}
        <div>
          <label htmlFor="altura" className="block text-lg font-semibold text-gray-800 mb-2">
            Altura (mts):
          </label>
          <input
            type="number"
            id="altura"
            name="altura"
            value={data.altura}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Ingrese la altura"
          />
        </div>

        {/* Largo */}
        <div>
          <label htmlFor="largo" className="block text-lg font-semibold text-gray-800 mb-2">
            Largo (mts):
          </label>
          <input
            type="number"
            id="largo"
            name="largo"
            value={data.largo}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Ingrese el largo"
          />
        </div>

        {/* Ancho */}
        <div>
          <label htmlFor="ancho" className="block text-lg font-semibold text-gray-800 mb-2">
            Ancho (mts):
          </label>
          <input
            type="number"
            id="ancho"
            name="ancho"
            value={data.ancho}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Ingrese el ancho"
          />
        </div>

        {/* Índice de Área */}
        <div>
          <label htmlFor="indiceArea" className="block text-lg font-semibold text-gray-800 mb-2">
            Índice de Área (IC):
          </label>
          <input
            type="number"
            id="indiceArea"
            name="indiceArea"
            value={data.indiceArea.toFixed(2)}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        {/* Mínimo de Áreas */}
        <div>
          <label htmlFor="minAreas" className="block text-lg font-semibold text-gray-800 mb-2">
            Mínimo de Áreas:
          </label>
          <input
            type="number"
            id="minAreas"
            name="minAreas"
            value={calculateMinAreas(data.indiceArea)}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        {/* Máximo de Áreas */}
        <div>
          <label htmlFor="maxAreas" className="block text-lg font-semibold text-gray-800 mb-2">
            Máximo de Áreas:
          </label>
          <input
            type="number"
            id="maxAreas"
            name="maxAreas"
            value={calculateMaxAreas(data.indiceArea)}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </form>
    </div>
  );
}
