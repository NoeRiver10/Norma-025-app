"use client";

import React, { useState, useEffect } from 'react';
import { useAreas } from '../context/areascontext';
import { useRouter } from 'next/navigation';
import MedicionesGeneral from '../components/ComponentsMediciones/medicionesGeneral';
import ResumenMedicion from '../components/ComponentsMediciones/resumenMedicion';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const NIVELES_ILUMINACION = [20, 50, 100, 200, 300, 500, 750, 1000, 2000];

export default function MedicionesPage() {
  const { areas, setAreas } = useAreas();
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [puestosTrabajo, setPuestosTrabajo] = useState<string[]>([]);
  const [selectedPuesto, setSelectedPuesto] = useState<string>('');
  const [identificacion, setIdentificacion] = useState<string>('');
  const [departamento, setDepartamento] = useState<string>('');
  const [planoTrabajo, setPlanoTrabajo] = useState<string>('');
  const [nivelIluminacion, setNivelIluminacion] = useState<number | ''>('');
  const [tipoIluminacion, setTipoIluminacion] = useState<string>('');
  const [globalPointCounter, setGlobalPointCounter] = useState<number>(1);
  const [showResumen, setShowResumen] = useState<boolean>(false);
  const [medicionesData, setMedicionesData] = useState(
    Array.from({ length: tipoIluminacion === 'ARTIFICIAL' ? 1 : 4 }, () => ({
      hora: '',
      trabajoE1: '',
      trabajoE2: '',
      paredesE1: 'N/A',
      paredesE2: 'N/A',
    }))
  );

  // Cargar `globalPointCounter` desde `localStorage` en el lado del cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAreas = JSON.parse(localStorage.getItem('areas') || '[]');
      const lastPoint = savedAreas.flatMap((area: any) => area.puestosData).flatMap((puesto: any) => puesto.puntos).pop();
      setGlobalPointCounter(lastPoint ? lastPoint.numeroPunto + 1 : 1);
    }
  }, []);

  useEffect(() => {
    if (selectedArea) {
      const selectedAreaData = areas.find((area) => area.idArea.toString() === selectedArea);
      setPuestosTrabajo(selectedAreaData ? selectedAreaData.puestosData.map((puesto) => puesto.nombrePuesto) : []);
      setSelectedPuesto('');
    }
  }, [selectedArea, areas]);

  useEffect(() => {
    setMedicionesData(
      Array.from({ length: tipoIluminacion === 'ARTIFICIAL' ? 1 : 4 }, () => ({
        hora: '',
        trabajoE1: '',
        trabajoE2: '',
        paredesE1: 'N/A',
        paredesE2: 'N/A',
      }))
    );
  }, [tipoIluminacion]);

  const handleSelectArea = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAreaId = event.target.value;
    setSelectedArea(selectedAreaId);
  };

  const handleSelectPuesto = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPuesto(event.target.value);
  };

  const handleSelectPlanoTrabajo = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPlanoTrabajo(event.target.value);
  };

  const handleSelectNivelIluminacion = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setNivelIluminacion(isNaN(value) ? '' : value);
  };

  const handleSelectTipoIluminacion = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoIluminacion(event.target.value);
    setMedicionesData(
      Array.from({ length: event.target.value === 'ARTIFICIAL' ? 1 : 4 }, () => ({
        hora: '',
        trabajoE1: '',
        trabajoE2: '',
        paredesE1: 'N/A',
        paredesE2: 'N/A',
      }))
    );
  };

  const handleGuardar = () => {
    let newPointCounter = globalPointCounter;
    const updatedAreas = areas.map((area) => {
      if (area.idArea.toString() === selectedArea) {
        const updatedPuestos = area.puestosData.map((puesto) => {
          if (puesto.nombrePuesto === selectedPuesto) {
            puesto.puntos.push({
              numeroPunto: newPointCounter,
              identificacion,
              departamento,
              planoTrabajo,
              nivelIluminacion,
              tipoIluminacion,
              mediciones: medicionesData,
            });
            newPointCounter++;
            return { ...puesto, puntos: [...puesto.puntos] };
          }
          return puesto;
        });
        return { ...area, puestosData: updatedPuestos };
      }
      return area;
    });
    setAreas(updatedAreas);

    if (typeof window !== "undefined") {
      localStorage.setItem('areas', JSON.stringify(updatedAreas));
    }

    alert('Datos guardados con éxito');
  };

  const handleAgregarPunto = () => {
    setGlobalPointCounter((prevCounter) => prevCounter + 1);
    setIdentificacion('');
    setPlanoTrabajo('');
    setNivelIluminacion('');
    setTipoIluminacion('');
    setMedicionesData(
      Array.from({ length: 4 }, () => ({
        hora: '',
        trabajoE1: '',
        trabajoE2: '',
        paredesE1: 'N/A',
        paredesE2: 'N/A',
      }))
    );
  };

  const handleSiguienteDepartamento = () => {
    setGlobalPointCounter((prevCounter) => prevCounter + 1);
    setDepartamento('');
    setIdentificacion('');
    setNivelIluminacion('');
    setTipoIluminacion('');
    setMedicionesData(
      Array.from({ length: 4 }, () => ({
        hora: '',
        trabajoE1: '',
        trabajoE2: '',
        paredesE1: 'N/A',
        paredesE2: 'N/A',
      }))
    );
  };

  const navigateToPoint = (direction: 'next' | 'previous') => {
    const existingPoints = areas.flatMap((area) => area.puestosData).flatMap((puesto) => puesto.puntos);
    const sortedPoints = existingPoints.sort((a, b) => a.numeroPunto - b.numeroPunto);
    const currentPointIndex = sortedPoints.findIndex((punto) => punto.numeroPunto === globalPointCounter);
    if (direction === 'next' && currentPointIndex < sortedPoints.length - 1) {
      const nextPoint = sortedPoints[currentPointIndex + 1];
      setGlobalPointCounter(nextPoint.numeroPunto);
      setIdentificacion(nextPoint.identificacion);
      setDepartamento(nextPoint.departamento);
      setNivelIluminacion(nextPoint.nivelIluminacion);
      setTipoIluminacion(nextPoint.tipoIluminacion);
      setMedicionesData(nextPoint.mediciones);
      setPlanoTrabajo(nextPoint.planoTrabajo);
    } else if (direction === 'previous' && currentPointIndex > 0) {
      const prevPoint = sortedPoints[currentPointIndex - 1];
      setGlobalPointCounter(prevPoint.numeroPunto);
      setIdentificacion(prevPoint.identificacion);
      setDepartamento(prevPoint.departamento);
      setNivelIluminacion(prevPoint.nivelIluminacion);
      setTipoIluminacion(prevPoint.tipoIluminacion);
      setMedicionesData(prevPoint.mediciones);
      setPlanoTrabajo(prevPoint.planoTrabajo);
    }
  };

  const borrarDatos = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('areas'); // Elimina los datos almacenados de las áreas
    }
    setAreas([]); // Restablece el estado a una lista vacía
    setGlobalPointCounter(1); // Restablece el contador de puntos
    alert('Datos eliminados con éxito');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      {showResumen ? (
        <>
          <ResumenMedicion />
          <button
            type="button"
            onClick={() => setShowResumen(false)}
            className="bg-blue-600 text-white p-3 rounded-md mt-4"
          >
            Volver a Mediciones
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">
            Mediciones - Área: {selectedArea || 'Sin Seleccionar'} - Departamento: {departamento || 'Sin Seleccionar'} - Punto: {globalPointCounter}
          </h1>
          <div className="flex flex-col space-y-4 mb-8">
            <select
              value={selectedArea}
              onChange={handleSelectArea}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Seleccione un Área</option>
              {areas.map((area) => (
                <option key={area.idArea} value={area.idArea}>Área {area.idArea} - {area.identificacionData.areaIluminada || area.nombreArea}</option>
              ))}
            </select>
            <select
              value={selectedPuesto}
              onChange={handleSelectPuesto}
              className="p-3 border border-gray-300 rounded-md"
              disabled={!selectedArea}
            >
              <option value="" disabled>Seleccione un Puesto</option>
              {puestosTrabajo.map((puesto, index) => (
                <option key={index} value={puesto}>
                  {puesto}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              placeholder="Identificación"
              className="p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              placeholder="Departamento"
              className="p-3 border border-gray-300 rounded-md"
            />
            <select
              value={planoTrabajo}
              onChange={handleSelectPlanoTrabajo}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Seleccione Plano de Trabajo</option>
              <option value="HORIZONTAL">Horizontal</option>
              <option value="VERTICAL">Vertical</option>
              <option value="OBLICUO">Oblicuo</option>
            </select>
            <select
              value={nivelIluminacion}
              onChange={handleSelectNivelIluminacion}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Seleccione Nivel de Iluminación</option>
              {NIVELES_ILUMINACION.map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel} lux
                </option>
              ))}
            </select>
            <select
              value={tipoIluminacion}
              onChange={handleSelectTipoIluminacion}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="" disabled>Seleccione Tipo de Iluminación</option>
              <option value="NATURAL">Natural</option>
              <option value="ARTIFICIAL">Artificial</option>
              <option value="COMBINADA">Combinada</option>
            </select>
          </div>

          {tipoIluminacion && (
            <MedicionesGeneral
              tipoMedicion={tipoIluminacion}
              numMediciones={tipoIluminacion === 'ARTIFICIAL' ? 1 : 4}
              areaId={Number(selectedArea)}
              puestoIndex={puestosTrabajo.indexOf(selectedPuesto)}
              medicionesData={medicionesData}
              setMedicionesData={setMedicionesData}
            />
          )}

          <div className="flex space-x-4 mb-8">
            <button
              type="button"
              onClick={() => navigateToPoint('previous')}
              className="bg-gray-600 text-white p-3 rounded-md"
            >
              Punto Anterior
            </button>
            <button
              type="button"
              onClick={() => navigateToPoint('next')}
              className="bg-gray-600 text-white p-3 rounded-md"
            >
              Siguiente Punto
            </button>
            <button
              type="button"
              onClick={handleGuardar}
              className="bg-blue-600 text-white p-3 rounded-md"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={handleAgregarPunto}
              className="bg-green-600 text-white p-3 rounded-md"
            >
              Agregar Punto
            </button>
            <button
              type="button"
              onClick={handleSiguienteDepartamento}
              className="bg-purple-600 text-white p-3 rounded-md"
            >
              Siguiente Departamento
            </button>
            <button
              type="button"
              onClick={() => setShowResumen(true)}
              className="bg-yellow-600 text-white p-3 rounded-md"
            >
              Ir a Resumen
            </button>
          </div>
          <div className="flex space-x-4 mb-8 mt-4">
            <button
              type="button"
              onClick={() => router.push('/Reconocimiento')}
              className="bg-orange-600 text-white p-3 rounded-md"
            >
              Ir a Reconocimiento
            </button>

            <button
              type="button"
              onClick={borrarDatos}
              className="bg-red-600 text-white p-3 rounded-md"
            >
              Borrar Datos
            </button>
          </div>
        </>
      )}
    </div>
  );
}
