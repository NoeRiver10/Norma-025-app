import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Medicion {
  hora: string;
  pTrabajoE1: number;
  pTrabajoE2: number;
  paredesE1: number;
  paredesE2: number;
}

interface Punto {
  area: string;
  departamento: string;
  puesto: string;
  tipoIluminacion: string;
  mediciones: Medicion[];
}

interface ExportarExcelProps {
  puntos: Punto[];
}

export default function ExportarExcel({ puntos }: ExportarExcelProps) {
  const [exportando, setExportando] = useState(false);

  const exportarDatos = () => {
    setExportando(true);

    // Crear un nuevo libro de Excel
    const workbook = XLSX.utils.book_new();

    puntos.forEach((punto, index) => {
      const { area, departamento, puesto, tipoIluminacion, mediciones } = punto;

      // Formatear los datos para la hoja de Excel
      const datos = [
        ["Detalles del Punto"],
        ["Área", area],
        ["Departamento", departamento],
        ["Puesto", puesto],
        ["Tipo de Iluminación", tipoIluminacion],
        [],
        ["Hora", "P. DE TRABAJO E1", "P. DE TRABAJO E2", "PAREDES E1", "PAREDES E2"],
        ...mediciones.map(medicion => [
          medicion.hora,
          medicion.pTrabajoE1,
          medicion.pTrabajoE2,
          medicion.paredesE1,
          medicion.paredesE2
        ])
      ];

      // Crear una hoja de trabajo con los datos
      const worksheet = XLSX.utils.aoa_to_sheet(datos);

      // Agregar la hoja de trabajo al libro de Excel
      XLSX.utils.book_append_sheet(workbook, worksheet, `Punto ${index + 1}`);
    });

    // Exportar el libro de Excel
    const archivoExcel = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([archivoExcel]), 'datos_mediciones.xlsx');

    setExportando(false);
  };

  return (
    <button
      onClick={exportarDatos}
      disabled={exportando}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      {exportando ? 'Exportando...' : 'Exportar a Excel'}
    </button>
  );
}
