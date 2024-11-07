"use client";

import React, { useState, useEffect } from 'react';

interface MedicionProps {
  tipoMedicion: string;
  numMediciones: number;
  areaId: number;
  puestoIndex: number;
  medicionesData: {
    hora: string;
    trabajoE1: string;
    trabajoE2: string;
    paredesE1: string;
    paredesE2: string;
  }[];
  setMedicionesData: React.Dispatch<React.SetStateAction<{
    hora: string;
    trabajoE1: string;
    trabajoE2: string;
    paredesE1: string;
    paredesE2: string;
  }[]>>;
}

const MedicionesGeneral: React.FC<MedicionProps> = ({ tipoMedicion, numMediciones, medicionesData, setMedicionesData, areaId, puestoIndex }) => {
  // Cargar las mediciones desde localStorage cuando se monta el componente
  useEffect(() => {
    const storedMediciones = localStorage.getItem(`mediciones-area-${areaId}-puesto-${puestoIndex}`);
    if (storedMediciones) {
      setMedicionesData(JSON.parse(storedMediciones));
    }
  }, [areaId, puestoIndex, setMedicionesData]);

  // Guardar las mediciones en localStorage cada vez que cambian los datos de mediciones
  useEffect(() => {
    localStorage.setItem(`mediciones-area-${areaId}-puesto-${puestoIndex}`, JSON.stringify(medicionesData));
  }, [areaId, puestoIndex, medicionesData]);

  const handleInputChange = (index: number, field: keyof typeof medicionesData[0], value: string) => {
    const newMediciones = [...medicionesData];
    newMediciones[index] = { ...newMediciones[index], [field]: value };
    setMedicionesData(newMediciones);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Medición {tipoMedicion}</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-red-600 text-white">
            {numMediciones > 1 && <th className="border p-3">Medición No.</th>}
            <th className="border p-3">Hora</th>
            <th className="border p-3">P. DE TRABAJO E1</th>
            <th className="border p-3">P. DE TRABAJO E2</th>
            <th className="border p-3">PAREDES E1</th>
            <th className="border p-3">PAREDES E2</th>
          </tr>
        </thead>
        <tbody>
          {medicionesData.map((medicion, index) => (
            <tr key={index}>
              {numMediciones > 1 && (
                <td className="border p-3 text-center font-bold text-blue-600">
                  Medición No. {index + 1}
                </td>
              )}
              <td className="border p-3">
                <input
                  type="time"
                  value={medicion.hora}
                  onChange={(e) => handleInputChange(index, 'hora', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </td>
              <td className="border p-3">
                <input
                  type="number"
                  min="0"
                  value={medicion.trabajoE1}
                  onChange={(e) => handleInputChange(index, 'trabajoE1', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </td>
              <td className="border p-3">
                <input
                  type="number"
                  min="0"
                  value={medicion.trabajoE2}
                  onChange={(e) => handleInputChange(index, 'trabajoE2', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </td>
              <td className="border p-3">
                <input
                  type="number"
                  min="0"
                  value={medicion.paredesE1}
                  onChange={(e) => handleInputChange(index, 'paredesE1', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="N/A"
                />
              </td>
              <td className="border p-3">
                <input
                  type="number"
                  min="0"
                  value={medicion.paredesE2}
                  onChange={(e) => handleInputChange(index, 'paredesE2', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="N/A"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicionesGeneral;
