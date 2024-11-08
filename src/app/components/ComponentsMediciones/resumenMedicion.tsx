import React, { useState } from 'react';
import { useAreas } from '../../context/areascontext';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ResumenMedicion: React.FC = () => {
  const { areas, setAreas } = useAreas();
  const [expandedIndex, setExpandedIndex] = useState<{ areaIndex: number; puestoIndex: number; puntoIndex: number } | null>(null);
  const router = useRouter();

  const exportarDatos = () => {
    const workbook = XLSX.utils.book_new();

    // Encabezados generales para el Excel
    const encabezados = [
      [
        "Med.", "Fecha de muestreo", "Departamento", "Área", "Puesto de trabajo", "Identificación",
        "Plano de trabajo", "Tarea o actividad", "Tipo de iluminación", "Nivel de iluminación", "Observaciones", "Rango",
        "Medición No. 1", "", "", "", "", "Medición No. 2", "", "", "", "",
        "Medición No. 3", "", "", "", "", "Medición No. 4", "", "", "", ""
      ],
      [
        "", "", "", "", "", "", "", "", "", "", "", "",
        "Hora", "E1", "E2", "Paredes E1", "Paredes E2",
        "Hora", "E1", "E2", "Paredes E1", "Paredes E2",
        "Hora", "E1", "E2", "Paredes E1", "Paredes E2",
        "Hora", "E1", "E2", "Paredes E1", "Paredes E2"
      ]
    ];

    // Datos de cada punto de medición
    const datos = areas.flatMap((area) =>
      area.puestosData.flatMap((puesto) =>
        puesto.puntos.map((punto) => {
          const mediciones = punto.mediciones || [];
          const fila = [
            "", "00-ene-00", punto.departamento, area.nombreArea, puesto.nombrePuesto,
            punto.identificacion, punto.planoTrabajo, "Tarea o actividad", punto.tipoIluminacion, punto.nivelIluminacion, "Ninguna", "",
          ];

          // Añadir datos de cada medición (hasta 4)
          for (let i = 0; i < 4; i++) {
            const medicion = mediciones[i] || { hora: "", trabajoE1: "", trabajoE2: "", paredesE1: "", paredesE2: "" };
            fila.push(medicion.hora, medicion.trabajoE1, medicion.trabajoE2, medicion.paredesE1, medicion.paredesE2);
          }

          return fila;
        })
      )
    );

    // Unir encabezado y datos
    const hoja = encabezados.concat(datos);

    // Crear una hoja de trabajo con los datos
    const worksheet = XLSX.utils.aoa_to_sheet(hoja);

    // Agregar la hoja de trabajo al libro de Excel
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mediciones");

    // Exportar el libro de Excel
    const archivoExcel = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([archivoExcel]), 'resumen_mediciones.xlsx');
  };

  const handleDeletePunto = (areaIndex: number, puestoIndex: number, puntoIndex: number) => {
    const updatedAreas = [...areas];
    updatedAreas[areaIndex].puestosData[puestoIndex].puntos.splice(puntoIndex, 1);
    setAreas(updatedAreas);
  };

  const handleEditPunto = (areaIndex: number, puestoIndex: number, puntoIndex: number) => {
    router.push(`/Mediciones?edit=true&areaIndex=${areaIndex}&puestoIndex=${puestoIndex}&puntoIndex=${puntoIndex}`);
  };

  const toggleExpand = (areaIndex: number, puestoIndex: number, puntoIndex: number) => {
    if (
      expandedIndex &&
      expandedIndex.areaIndex === areaIndex &&
      expandedIndex.puestoIndex === puestoIndex &&
      expandedIndex.puntoIndex === puntoIndex
    ) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex({ areaIndex, puestoIndex, puntoIndex });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">
        Resumen de Mediciones
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {areas.map((area, areaIndex) =>
          area.puestosData.map((puesto, puestoIndex) =>
            puesto.puntos?.map((punto, puntoIndex) => (
              <div
                key={`${area.idArea}-${puestoIndex}-${puntoIndex}`}
                className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg shadow-lg overflow-hidden border-l-4 border-blue-500"
              >
                <div
                  className="w-full p-4 text-left flex justify-between items-center focus:outline-none cursor-pointer"
                  onClick={() => toggleExpand(areaIndex, puestoIndex, puntoIndex)}
                >
                  <span className="text-2xl font-bold text-gray-700">
                    Punto {punto.numeroPunto} - Área {area.nombreArea}
                  </span>
                  <div className="flex space-x-2">
                    <div
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePunto(areaIndex, puestoIndex, puntoIndex);
                      }}
                    >
                      <FiTrash2 />
                    </div>
                    <div
                      className="text-green-500 hover:text-green-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPunto(areaIndex, puestoIndex, puntoIndex);
                      }}
                    >
                      <FiEdit />
                    </div>
                  </div>
                </div>
                {expandedIndex?.areaIndex === areaIndex &&
                  expandedIndex.puestoIndex === puestoIndex &&
                  expandedIndex.puntoIndex === puntoIndex && (
                    <div className="p-6 bg-white">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Detalles del Punto:
                        </h3>
                        <p>
                          <strong>Área:</strong> {area.nombreArea}
                        </p>
                        <p>
                          <strong>Departamento:</strong> {punto.departamento}
                        </p>
                        <p>
                          <strong>Puesto:</strong> {puesto.nombrePuesto}
                        </p>
                        <p>
                          <strong>Tipo de Iluminación:</strong> {punto.tipoIluminacion}
                        </p>
                        <p>
                          <strong>Nivel de Iluminación:</strong> {punto.nivelIluminacion}
                        </p>
                      </div>

                      <div className="mb-4 overflow-x-auto">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Mediciones:
                        </h3>
                        {punto.mediciones && punto.mediciones.length > 0 ? (
                          <table className="min-w-full table-auto border-collapse">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="border p-2">Hora</th>
                                <th className="border p-2">P. DE TRABAJO E1</th>
                                <th className="border p-2">P. DE TRABAJO E2</th>
                                <th className="border p-2">PAREDES E1</th>
                                <th className="border p-2">PAREDES E2</th>
                              </tr>
                            </thead>
                            <tbody>
                              {punto.mediciones.map((medicion, medicionIndex) => (
                                <tr key={medicionIndex}>
                                  <td className="border p-2">{medicion.hora}</td>
                                  <td className="border p-2">{medicion.trabajoE1}</td>
                                  <td className="border p-2">{medicion.trabajoE2}</td>
                                  <td className="border p-2">{medicion.paredesE1}</td>
                                  <td className="border p-2">{medicion.paredesE2}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No hay mediciones registradas para este punto.</p>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ))
          )
        )}
      </div>
      <button
        type="button"
        onClick={exportarDatos}
        className="bg-green-600 text-white p-3 rounded-md mb-8"
      >
        Exportar a Excel
      </button>
    </div>
  );
};

export default ResumenMedicion;
