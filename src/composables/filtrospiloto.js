export const TIPOS_FILTRO = {
  TODOS: 'todos',
  FECHA: 'fecha',
  TIEMPO: 'tiempo',
  DISTANCIA: 'distancia',
  VUELOS: 'vuelos',
  ESTADO: 'estado'

};

export const CONFIG_FILTROS = {
  [TIPOS_FILTRO.TODOS]: {
    titulo: 'Todos los Pilotos',
    icono: 'user',
    color: 'primary',
    campoOrden: null,
    etiquetaAsc: 'Ascendente',
    etiquetaDesc: 'Descendente',
    campoDatos: null
  },
  [TIPOS_FILTRO.FECHA]: {
    titulo: 'Pilotos por Fecha de Examen',
    icono: 'event',
    color: 'secondary',
    campoOrden: 'fecha',
    etiquetaAsc: 'Antiguas',
    etiquetaDesc: 'Recientes', 
    campoDatos: 'fecha examen médico'
  },
  [TIPOS_FILTRO.TIEMPO]: {
    titulo: 'Pilotos por Tiempo de Vuelo',
    icono: 'schedule',
    color: 'accent',
    campoOrden: 'tiempo',
    etiquetaAsc: 'Menos horas',
    etiquetaDesc: 'Más horas',
    campoDatos: 'tiempo acumulado'
  },
  [TIPOS_FILTRO.DISTANCIA]: {
    titulo: 'Pilotos por Distancia',
    icono: 'street',
    color: 'secondary',
    campoOrden: 'distancia',
    etiquetaAsc: 'Menos distancia',
    etiquetaDesc: 'Más distancia',
    campoDatos: 'distancia acumulada'
  },
  [TIPOS_FILTRO.VUELOS]: {
    titulo: 'Pilotos por Vuelos',
    icono: 'flight',
    color: 'accent',
    campoOrden: 'vuelos',
    etiquetaAsc: 'Menos vuelos',
    etiquetaDesc: 'Más vuelos',
    campoDatos: 'vuelos realizados'
  },
  [TIPOS_FILTRO.ESTADO]: {
    titulo: 'Pilotos por Estado',
    icono: 'toggle_on',
    color: 'green',
    campoOrden: null,
    campoDatos: 'estado piloto',
    esFiltroTexto: true,
    opcionesFiltro: [
      {valor: 'Activo', etiqueta: 'Activo'},
      {valor: 'Inactivo', etiqueta: 'Inactivo'}
    ]
}
};