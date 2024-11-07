"use client";

import { FaTrash } from 'react-icons/fa';
import { PuestoData as Puesto } from '../../context/areascontext';


interface PuestosProps {
  puestos: Puesto[];
  setPuestos: React.Dispatch<React.SetStateAction<Puesto[]>>;
}

const nivelIluminacionOptions: Record<number, { visualTask: string; workArea: string; }> = {
  20: {
    visualTask: 'En exteriores: distinguir el área de tránsito, desplazarse caminando, vigilancia, movimiento de vehículos.',
    workArea: 'Exteriores generales: patios y estacionamientos.',
  },
  50: {
    visualTask: 'En interiores: distinguir el área de tránsito, desplazarse caminando, vigilancia, movimiento de vehículos.',
    workArea: 'Interiores generales: almacenes de poco movimiento, pasillos, escaleras, estacionamientos cubiertos, labores en minas subteráneas, iluminación de emergencia.',
  },
  100: {
    visualTask: 'En interiores.',
    workArea: 'Áreas de circulación y pasillos; salas de espera; salas de descanso; cuartos de almacén; plataformas; cuartos de calderas.',
  },
  200: {
    visualTask: 'Requerimiento visual simple: inspección visual, recuento de piezas, trabajo en banco y máquina.',
    workArea: 'Servicios al personal: almacenaje rudo, recepción y despacho, casetas de vigilancia, cuartos de compresores y pailería.'
  },
  300: {
    visualTask: 'Distinción moderada de detalles: ensamble simple, trabajo medio en banco y máquina, inspección simple, empaque y trabajos de oficina.',
    workArea: 'Talleres: áreas de empaque y ensamble, aulas y oficinas.'
  },
  500: {
    visualTask: 'Distinción clara de detalles: maquinado y acabados delicados, ensamble de inspección moderadamente difícil, captura y procesamiento de información, manejo de instrumentos y equipo de laboratorio.',
    workArea: 'Talleres de precisión: salas de cómputo, áreas de dibujo, laboratorios.'
  },
  750: {
    visualTask: 'Distinción fina de detalles: maquinado de precisión, ensamble e inspección de trabajos delicados, manejo de instrumentos y equipo de precisión, manejo de piezas pequeñas.',
    workArea: 'Talleres de alta precisión: de pintura y acabado de superficies y laboratorios de control de calidad.'
  },
  1000: {
    visualTask: 'Alta exactitud en la distinción de detalles: ensamble, proceso e inspección de piezas pequeñas y complejas, acabado con pulidos finos.',
    workArea: 'Proceso: ensamble e inspección de piezas complejas y acabados con pulidos finos.'
  },
  2000: {
    visualTask: 'Alto grado de especialización en la distinción de detalles.',
    workArea: 'Proceso de gran exactitud. Ejecución de tareas visuales: -de bajo contraste y tamaño muy pequeño por periodos prolongados; exactas y muy prolongadas, y muy especiales de extremadamente bajo contraste y pequeño tamaño.'
  }
};

export default function Puestos({ puestos, setPuestos }: PuestosProps) {
  // Función para manejar cambios en los campos individuales
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPuestos((prevPuestos) => {
      const updatedPuestos = [...prevPuestos];
      updatedPuestos[index] = {
        ...updatedPuestos[index],
        [name]: name === "numTrabajadores"
          ? Math.max(0, parseInt(value, 10) || 0) // Garantizar que no se obtenga NaN
          : name === "nivelSeleccionado"
          ? (value !== "" ? parseInt(value, 10) : undefined) // Asegurar que sea siempre un número o `undefined`
          : value,
      };
      return updatedPuestos;
    });
  };

  // Función para agregar un nuevo puesto
  const handleAddPuesto = () => {
    setPuestos((prevPuestos) => [
      ...prevPuestos,
      {
        indice: prevPuestos.length + 1,
        nombrePuesto: "",
        numTrabajadores: 0,
        descripcionActividades: "",
        nivelSeleccionado: undefined,
        puntos: [],
      },
    ]);
  };

  // Función para eliminar un puesto
  const handleDeletePuesto = (index: number) => {
    setPuestos((prevPuestos) =>
      prevPuestos
        .filter((_, i) => i !== index)
        .map((puesto, i) => ({ ...puesto, indice: i + 1 }))
    );
  };

  const getIluminacionInfo = (nivel: number | undefined) => {
    return nivel !== undefined ? nivelIluminacionOptions[nivel] : null;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Datos del Puesto
      </h2>
      {puestos.map((data, index) => {
        const iluminacionInfo = getIluminacionInfo(
          typeof data.nivelSeleccionado === "string"
            ? parseInt(data.nivelSeleccionado, 10)
            : data.nivelSeleccionado
        );
        return (
          <div key={data.indice} className="space-y-6 mb-6 relative border-t border-gray-300 pt-4">
            {/* Ícono para Eliminar Puesto */}
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleDeletePuesto(index)}
                className="absolute top-0 right-0 p-2 text-red-600 hover:text-red-800"
                aria-label="Eliminar Puesto"
              >
                <FaTrash />
              </button>
            )}

            {/* Índice del Puesto */}
            <div className="text-lg font-semibold text-gray-800 mb-2">
              <p>Puesto #{data.indice}</p>
            </div>

            {/* Puesto del Trabajador */}
            <div>
              <label htmlFor={`nombrePuesto-${index}`} className="block text-lg font-semibold text-gray-800 mb-2">
                Puesto del Trabajador:
              </label>
              <input
                type="text"
                id={`nombrePuesto-${index}`}
                name="nombrePuesto"
                value={data.nombrePuesto}
                onChange={(e) => handleChange(index, e)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Ingrese el nombre del puesto del trabajador"
              />
            </div>

            {/* Número de Trabajadores */}
            <div>
              <label htmlFor={`numTrabajadores-${index}`} className="block text-lg font-semibold text-gray-800 mb-2">
                Número de Trabajadores:
              </label>
              <input
                type="number"
                id={`numTrabajadores-${index}`}
                name="numTrabajadores"
                value={data.numTrabajadores !== null && data.numTrabajadores !== undefined ? data.numTrabajadores.toString() : "0"} // Aseguramos que siempre tenga un valor válido
                onChange={(e) => handleChange(index, e)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Ingrese el número de trabajadores"
              />
            </div>

            {/* Descripción de Actividades */}
            <div>
              <label htmlFor={`descripcionActividades-${index}`} className="block text-lg font-semibold text-gray-800 mb-2">
                Descripción de Actividades:
              </label>
              <textarea
                id={`descripcionActividades-${index}`}
                name="descripcionActividades"
                value={data.descripcionActividades}
                onChange={(e) => handleChange(index, e)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Ingrese una descripción de las actividades"
              />
            </div>

            {/* Nivel Mínimo de Iluminación (lux) */}
            <div>
              <label htmlFor={`nivelSeleccionado-${index}`} className="block text-lg font-semibold text-gray-800 mb-2">
                Nivel Mínimo de Iluminación:
              </label>
              <select
                id={`nivelSeleccionado-${index}`}
                name="nivelSeleccionado"
                value={data.nivelSeleccionado ?? ""}
                onChange={(e) => handleChange(index, e)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Selecciona un nivel</option>
                {Object.keys(nivelIluminacionOptions).map((nivel) => (
                  <option key={nivel} value={nivel}>
                    {nivel} lux
                  </option>
                ))}
              </select>
            </div>

            {/* Tarea Visual del Puesto de Trabajo y Área de Trabajo */}
            {iluminacionInfo && (
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-lg font-semibold text-gray-800 mb-2">Tarea Visual:</p>
                <p className="text-gray-700 mb-4">{iluminacionInfo.visualTask}</p>
                <p className="text-lg font-semibold text-gray-800 mb-2">Área de Trabajo:</p>
                <p className="text-gray-700">{iluminacionInfo.workArea}</p>
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={handleAddPuesto}
        className="w-full p-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700"
      >
        Agregar Nuevo Puesto
      </button>
    </div>
  );
}