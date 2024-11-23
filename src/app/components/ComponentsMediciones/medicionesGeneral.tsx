"use client";

import React, { useState, useEffect } from "react";

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
  setMedicionesData: React.Dispatch<
    React.SetStateAction<
      {
        hora: string;
        trabajoE1: string;
        trabajoE2: string;
        paredesE1: string;
        paredesE2: string;
      }[]
    >
  >;
}

const MedicionesGeneral: React.FC<MedicionProps> = ({
  tipoMedicion,
  numMediciones,
  medicionesData,
  setMedicionesData,
  areaId,
  puestoIndex,
}) => {
  const [localData, setLocalData] = useState(medicionesData);

  // Sincronizar el estado de localData con el número de mediciones dinámicamente
  useEffect(() => {
    const updatedData = Array.from({ length: numMediciones }, (_, index) => ({
      hora: localData[index]?.hora || "",
      trabajoE1: localData[index]?.trabajoE1 || "",
      trabajoE2: localData[index]?.trabajoE2 || "",
      paredesE1: localData[index]?.paredesE1 || "N/A",
      paredesE2: localData[index]?.paredesE2 || "N/A",
    }));
    setLocalData(updatedData);
  }, [numMediciones, tipoMedicion]);

  // Guardar datos en localStorage al cambiar localData
  useEffect(() => {
    localStorage.setItem(
      `mediciones-area-${areaId}-puesto-${puestoIndex}`,
      JSON.stringify(localData)
    );
    setMedicionesData(localData); // Actualizar el estado global
  }, [localData, areaId, puestoIndex, setMedicionesData]);

  // Manejar cambios en los inputs
  const handleInputChange = (
    index: number,
    field: keyof typeof localData[0],
    value: string
  ) => {
    const updatedData = [...localData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    setLocalData(updatedData);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Medición {tipoMedicion}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse text-sm">
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
            {localData.map((medicion, index) => (
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
                    onChange={(e) =>
                      handleInputChange(index, "hora", e.target.value)
                    }
                    className="w-full p-2 border rounded-md text-xs sm:text-sm"
                  />
                </td>
                <td className="border p-3">
                  <input
                    type="number"
                    min="0"
                    value={medicion.trabajoE1}
                    onChange={(e) =>
                      handleInputChange(index, "trabajoE1", e.target.value)
                    }
                    className="w-full p-2 border rounded-md text-xs sm:text-sm"
                  />
                </td>
                <td className="border p-3">
                  <input
                    type="number"
                    min="0"
                    value={medicion.trabajoE2}
                    onChange={(e) =>
                      handleInputChange(index, "trabajoE2", e.target.value)
                    }
                    className="w-full p-2 border rounded-md text-xs sm:text-sm"
                  />
                </td>
                <td className="border p-3">
                  <input
                    type="number"
                    min="0"
                    value={medicion.paredesE1}
                    onChange={(e) =>
                      handleInputChange(index, "paredesE1", e.target.value)
                    }
                    className="w-full p-2 border rounded-md text-xs sm:text-sm"
                    placeholder="N/A"
                  />
                </td>
                <td className="border p-3">
                  <input
                    type="number"
                    min="0"
                    value={medicion.paredesE2}
                    onChange={(e) =>
                      handleInputChange(index, "paredesE2", e.target.value)
                    }
                    className="w-full p-2 border rounded-md text-xs sm:text-sm"
                    placeholder="N/A"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicionesGeneral;
