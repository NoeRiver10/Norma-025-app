"use client";

import { useState, SetStateAction, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IdentificacionArea from '../components/ComponentsReconocimiento/IdentificacionArea';
import DimensionesArea from '../components/ComponentsReconocimiento/DimensionesArea';
import Luminarias from '../components/ComponentsReconocimiento/Luminarias';
import Percepcion from '../components/ComponentsReconocimiento/Percepcion';
import Puestos from '../components/ComponentsReconocimiento/Puestos';
import ResumenAreas from '../components/ComponentsReconocimiento/ResumenAreas';
import { useAreas, Area } from '../context/areascontext'; // Importar el tipo Area

export default function ReconocimientoPage() {
  const router = useRouter();
  const { areas, setAreas } = useAreas();
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [showResumen, setShowResumen] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleAgregarArea = () => {
    const nuevaAreaId = areas.length + 1;
    const nuevaArea: Area = {
      idArea: nuevaAreaId,
      nombreArea: `Área ${nuevaAreaId}`,
      identificacionData: {
        idArea: `${nuevaAreaId}`,
        areaIluminada: '',
        descripcionSuperficie: '',
      },
      dimensionesData: {
        altura: '',
        largo: '',
        ancho: '',
        indiceArea: 0,
      },
      luminariasData: {
        tipoLuminaria: '',
        potencia: 0,
        distribucion: 'LINEAL',
        iluminacionLocalizada: 'SÍ',
        cantidad: 0,
      },
      percepcionData: {
        nombreTrabajador: '',
        descripcion: '',
        puesto: '',
      },
      puestosData: [
        {
          indice: 1,
          nombrePuesto: '',
          numTrabajadores: 0,
          descripcionActividades: '',
          nivelSeleccionado: undefined,
          puntos: [],
        },
      ],
    };

    setAreas((prevAreas) => [...prevAreas, nuevaArea]);
    setCurrentAreaIndex(areas.length);
    setMensaje('Área agregada con éxito');
  };

  const handleEliminarArea = (index: number) => {
    if (areas.length > 1) {
      setAreas((prevAreas) => prevAreas.filter((_, i) => i !== index));
      setCurrentAreaIndex(0);
      setMensaje('Área eliminada con éxito');
    }
  };

  const actualizarArea = <K extends keyof Area>(
    index: number,
    key: K,
    data: SetStateAction<Area[K]>
  ) => {
    setAreas((prevAreas) => {
      const newAreas = [...prevAreas];
      newAreas[index] = {
        ...newAreas[index],
        [key]: typeof data === 'function' ? (data as any)(newAreas[index][key]) : data,
      };
      return newAreas;
    });
  };

  const handleSelectArea = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentAreaIndex(Number(event.target.value));
  };

  const handleGuardar = () => {
    console.log(areas);
    setMensaje('Datos guardados con éxito');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">
        Reconocimiento
      </h1>
      {showResumen ? (
        <>
          <ResumenAreas areas={areas} />
          <button
            type="button"
            onClick={() => setShowResumen(false)}
            className="bg-yellow-600 text-white p-3 rounded-md mt-4"
          >
            Volver a la Edición de Áreas
          </button>
        </>
      ) : (
        <>
          {areas.length > 0 && (
            <>
              <div className="mb-8">
                <label htmlFor="selectArea" className="block text-lg font-semibold mb-2">
                  Selecciona un Área:
                </label>
                <select
                  id="selectArea"
                  value={currentAreaIndex}
                  onChange={handleSelectArea}
                  className="w-full p-3 border border-gray-300 rounded-md mb-4"
                >
                  {areas.map((area, index) => (
                    <option key={area.idArea} value={index}>
                      {area.nombreArea} ({area.identificacionData.areaIluminada || 'Sin Nombre'})
                    </option>
                  ))}
                </select>
                <h2 className="text-2xl font-bold mb-4 text-gray-700">
                  {areas[currentAreaIndex].nombreArea}
                </h2>
                <IdentificacionArea
                  data={areas[currentAreaIndex].identificacionData}
                  setData={(data) => actualizarArea(currentAreaIndex, 'identificacionData', data)}
                />
                <DimensionesArea
                  data={areas[currentAreaIndex].dimensionesData}
                  setData={(data) => actualizarArea(currentAreaIndex, 'dimensionesData', data)}
                />
                <Luminarias
                  data={areas[currentAreaIndex].luminariasData}
                  setData={(data) => actualizarArea(currentAreaIndex, 'luminariasData', data)}
                />
                <Percepcion
                  data={areas[currentAreaIndex].percepcionData}
                  setData={(data) => actualizarArea(currentAreaIndex, 'percepcionData', data)}
                />
                <Puestos
                  puestos={areas[currentAreaIndex].puestosData}
                  setPuestos={(data) =>
                    actualizarArea(currentAreaIndex, 'puestosData', data)
                  }
                />
              </div>
            </>
          )}
          <button
            type="button"
            onClick={handleAgregarArea}
            className="bg-green-600 text-white p-3 rounded-md mt-4"
          >
            Agregar Área
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            className="bg-blue-600 text-white p-3 rounded-md mt-4"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => router.push('/Mediciones')}
            className="bg-purple-600 text-white p-3 rounded-md mt-4"
          >
            Ir a Mediciones
          </button>
          <button
            type="button"
            onClick={() => setShowResumen(true)}
            className="bg-teal-600 text-white p-3 rounded-md mt-4"
          >
            Ir al Resumen de Áreas
          </button>
          {areas.length > 1 && (
            <button
              type="button"
              onClick={() => handleEliminarArea(currentAreaIndex)}
              className="bg-red-600 text-white p-3 rounded-md mt-4"
            >
              Eliminar Área
            </button>
          )}
        </>
      )}
      {mensaje && (
        <div className="mt-8 p-4 bg-green-100 text-green-800 border border-green-300 rounded-md">
          {mensaje}
        </div>
      )}
    </div>
  );
}
