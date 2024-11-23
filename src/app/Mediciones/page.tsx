"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAreas } from "../context/areascontext";
import { useRouter } from "next/navigation";
import MedicionesGeneral from "../components/ComponentsMediciones/medicionesGeneral";
import ResumenMedicion from "../components/ComponentsMediciones/resumenMedicion";

const NIVELES_ILUMINACION = [20, 50, 100, 200, 300, 500, 750, 1000, 2000];

// Función reutilizable para inicializar datos de medición
const createMedicionesData = (tipo: string) =>
  Array.from({ length: tipo === "ARTIFICIAL" ? 1 : 4 }, () => ({
    hora: "",
    trabajoE1: "",
    trabajoE2: "",
    paredesE1: "N/A",
    paredesE2: "N/A",
  }));

export default function MedicionesPage() {
  const { areas, setAreas } = useAreas();
  const router = useRouter();

  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedPuesto, setSelectedPuesto] = useState<string>("");
  const [identificacion, setIdentificacion] = useState<string>("");
  const [departamento, setDepartamento] = useState<string>("");
  const [planoTrabajo, setPlanoTrabajo] = useState<string>("");
  const [nivelIluminacion, setNivelIluminacion] = useState<number | "">("");
  const [tipoIluminacion, setTipoIluminacion] = useState<string>("");
  const [globalPointCounter, setGlobalPointCounter] = useState<number>(1);
  const [showResumen, setShowResumen] = useState<boolean>(false);
  const [medicionesData, setMedicionesData] = useState(
    createMedicionesData("")
  );

  // Calcular puestos de trabajo dinámicamente
  const puestosTrabajo = useMemo(() => {
    const area = areas.find((area) => area.idArea.toString() === selectedArea);
    return area?.puestosData.map((puesto) => puesto.nombrePuesto) || [];
  }, [selectedArea, areas]);

  // Inicializar contador de puntos
  useEffect(() => {
    const savedAreas = JSON.parse(localStorage.getItem("areas") || "[]");
    const lastPoint = savedAreas
      .flatMap((area: any) => area.puestosData)
      .flatMap((puesto: any) => puesto.puntos)
      .pop();
    setGlobalPointCounter(lastPoint ? lastPoint.numeroPunto + 1 : 1);
  }, []);

  // Actualizar datos de medición según tipo de iluminación
  useEffect(() => {
    setMedicionesData(createMedicionesData(tipoIluminacion));
  }, [tipoIluminacion]);

  // Función para guardar datos
  const handleGuardar = () => {
    const updatedAreas = areas.map((area) => {
      if (area.idArea.toString() === selectedArea) {
        const updatedPuestos = area.puestosData.map((puesto) => {
          if (puesto.nombrePuesto === selectedPuesto) {
            return {
              ...puesto,
              puntos: [
                ...puesto.puntos,
                {
                  numeroPunto: globalPointCounter,
                  identificacion,
                  departamento,
                  planoTrabajo,
                  nivelIluminacion,
                  tipoIluminacion,
                  mediciones: medicionesData,
                },
              ],
            };
          }
          return puesto;
        });
        return { ...area, puestosData: updatedPuestos };
      }
      return area;
    });

    setAreas(updatedAreas);
    localStorage.setItem("areas", JSON.stringify(updatedAreas));
    alert("Datos guardados con éxito");
  };

  // Función para agregar un nuevo punto
  const handleAgregarPunto = () => {
    setGlobalPointCounter((prev) => prev + 1);
    resetInputs();
  };

  // Función para avanzar al siguiente departamento
  const handleSiguienteDepartamento = () => {
    setGlobalPointCounter((prev) => prev + 1);
    setDepartamento("");
    resetInputs();
  };

  // Función para resetear inputs
  const resetInputs = () => {
    setIdentificacion("");
    setPlanoTrabajo("");
    setNivelIluminacion("");
    setTipoIluminacion("");
    setMedicionesData(createMedicionesData(""));
  };

  // Función para borrar todos los datos
  const borrarDatos = () => {
    localStorage.removeItem("areas");
    setAreas([]);
    setGlobalPointCounter(1);
    alert("Datos eliminados con éxito");
  };

  // Navegar entre puntos
  const navigateToPoint = (direction: "next" | "previous") => {
    const allPoints = areas
      .flatMap((area) => area.puestosData)
      .flatMap((puesto) => puesto.puntos)
      .sort((a, b) => a.numeroPunto - b.numeroPunto);

    const currentIndex = allPoints.findIndex(
      (punto) => punto.numeroPunto === globalPointCounter
    );

    if (direction === "next" && currentIndex < allPoints.length - 1) {
      updatePointData(allPoints[currentIndex + 1]);
    } else if (direction === "previous" && currentIndex > 0) {
      updatePointData(allPoints[currentIndex - 1]);
    }
  };

  // Actualizar datos según el punto seleccionado
  const updatePointData = (point: any) => {
    setGlobalPointCounter(point.numeroPunto);
    setIdentificacion(point.identificacion);
    setDepartamento(point.departamento);
    setPlanoTrabajo(point.planoTrabajo);
    setNivelIluminacion(point.nivelIluminacion);
    setTipoIluminacion(point.tipoIluminacion);
    setMedicionesData(point.mediciones);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      {showResumen ? (
        <>
          <ResumenMedicion />
          <button
            onClick={() => setShowResumen(false)}
            className="bg-blue-600 text-white p-3 rounded-md mt-4"
          >
            Volver a Mediciones
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">
            Mediciones - Área: {selectedArea || "Sin Seleccionar"} - Departamento:{" "}
            {departamento || "Sin Seleccionar"} - Punto: {globalPointCounter}
          </h1>
          <div className="flex flex-col space-y-4 mb-8">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Seleccione un Área
              </option>
              {areas.map((area) => (
                <option key={area.idArea} value={area.idArea}>
                  Área {area.idArea} - {area.identificacionData.areaIluminada || area.nombreArea}
                </option>
              ))}
            </select>
            <select
              value={selectedPuesto}
              onChange={(e) => setSelectedPuesto(e.target.value)}
              disabled={!selectedArea}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Seleccione un Puesto
              </option>
              {puestosTrabajo.map((puesto, index) => (
                <option key={index} value={puesto}>
                  {puesto}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              placeholder="Departamento"
              className="p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              placeholder="Identificación"
              className="p-3 border border-gray-300 rounded-md"
            />
            <select
              value={planoTrabajo}
              onChange={(e) => setPlanoTrabajo(e.target.value)}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Seleccione Plano de Trabajo
              </option>
              <option value="HORIZONTAL">Horizontal</option>
              <option value="VERTICAL">Vertical</option>
              <option value="OBLICUO">Oblicuo</option>
            </select>
            <select
              value={nivelIluminacion}
              onChange={(e) =>
                setNivelIluminacion(Number(e.target.value) || "")
              }
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Seleccione Nivel de Iluminación
              </option>
              {NIVELES_ILUMINACION.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel} lux
                </option>
              ))}
            </select>
            <select
              value={tipoIluminacion}
              onChange={(e) => setTipoIluminacion(e.target.value)}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Seleccione Tipo de Iluminación
              </option>
              <option value="NATURAL">Natural</option>
              <option value="ARTIFICIAL">Artificial</option>
              <option value="COMBINADA">Combinada</option>
            </select>
          </div>

          {tipoIluminacion && (
            <MedicionesGeneral
              tipoMedicion={tipoIluminacion}
              numMediciones={tipoIluminacion === "ARTIFICIAL" ? 1 : 4}
              areaId={Number(selectedArea)}
              puestoIndex={puestosTrabajo.indexOf(selectedPuesto)}
              medicionesData={medicionesData}
              setMedicionesData={setMedicionesData}
            />
          )}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            
          <button
            onClick={() => navigateToPoint("previous")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Punto Anterior
          </button>
          <button
            onClick={() => navigateToPoint("next")}
            className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Siguiente Punto
          </button>
          <button
            onClick={handleGuardar}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Guardar
          </button>
          <button
            onClick={handleAgregarPunto}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Agregar Punto
          </button>
          <button
            onClick={handleSiguienteDepartamento}
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Siguiente Departamento
          </button>
          <button
            onClick={() => setShowResumen(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Ir a Resumen
          </button>
          <button
            onClick={() => router.push("/Reconocimiento")}
            className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Ir a Reconocimiento
          </button>
          <button
            onClick={borrarDatos}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Borrar Datos
          </button>
        </div>

        </>
      )}
    </div>
  );
}
