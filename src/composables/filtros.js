export const TIPOS_FILTRO = {
  TODOS: 'todos',
  FECHA: 'fecha',
  TIEMPO: 'tiempo',
  DISTANCIA: 'distancia',
  VUELOS: 'vuelos',
  PESO: 'peso',
  VELOCIDAD: 'velocidad',
  OCUPACION: 'ocupacion',
  ESTADO: 'estado'
};

export const CONFIG_FILTROS = {
  [TIPOS_FILTRO.TODOS]: {
    titulo: 'Todos los Drones',
    icono: 'flight',
    color: 'primary',
    campoOrden: null,
    etiquetaAsc: 'Ascendente',
    etiquetaDesc: 'Descendente',
    campoDatos: null
  },
  [TIPOS_FILTRO.FECHA]: {
    titulo: 'Drones por Fecha de Póliza',
    icono: 'event',
    color: 'secondary',
    campoOrden: 'fecha',
    etiquetaAsc: 'Más antiguas',
    etiquetaDesc: 'Más recientes', 
    campoDatos: 'fecha de póliza'
  },
  [TIPOS_FILTRO.TIEMPO]: {
    titulo: 'Drones por Tiempo de Vuelo',
    icono: 'schedule',
    color: 'accent',
    campoOrden: 'tiempo',
    etiquetaAsc: 'Menos horas',
    etiquetaDesc: 'Más horas',
    campoDatos: 'tiempo acumulado-dron'
  },
  [TIPOS_FILTRO.DISTANCIA]: {
    titulo: 'Drones por Distancia',
    icono: 'street',
    color: 'secondary',
    campoOrden: 'distancia',
    etiquetaAsc: 'Menos distancia',
    etiquetaDesc: 'Más distancia',
    campoDatos: 'distancia acumulada-dron'
  },
  [TIPOS_FILTRO.VUELOS]: {
    titulo: 'Drones por Vuelos',
    icono: 'flight',
    color: 'accent',
    campoOrden: 'vuelos',
    etiquetaAsc: 'Menos vuelos',
    etiquetaDesc: 'Más vuelos',
    campoDatos: 'vuelos realizados-dron'
  },
  [TIPOS_FILTRO.PESO]: {
    titulo: 'Drones por Peso',
    icono: 'scale',
    color: 'secondary',
    campoOrden: 'peso',
    etiquetaAsc: 'Más liviano',
    etiquetaDesc: 'Más pesado',
    campoDatos: 'peso'
  },
  [TIPOS_FILTRO.VELOCIDAD]: {
    titulo: 'Drones por Velocidad',
    icono: 'speed',
    color: 'accent',
    campoOrden: 'velocidad',
    etiquetaAsc: 'Menos veloces',
    etiquetaDesc: 'Más veloces',
    campoDatos: 'velocidadmaxima'
  },
    [TIPOS_FILTRO.OCUPACION]: {
    titulo: 'Drones por Ocupación',
    icono: 'work',
    color: 'orange',
    campoOrden: null,
    campoDatos: 'ocupado_dron',
    esFiltroTexto: true,
    opcionesFiltro: [
      {valor: 'si', etiqueta: 'Ocupado'},
      {valor: 'No', etiqueta: 'Libre'}
    ]
  },
  [TIPOS_FILTRO.ESTADO]: {
    titulo: 'Drones por Estado',
    icono: 'toggle_on',
    color: 'green',
    campoOrden: null,
    campoDatos: 'estado-dron',
    esFiltroTexto: true,
    opcionesFiltro: [
      {valor: 'Activo', etiqueta: 'Activo'},
      {valor: 'Inactivo', etiqueta: 'Inactivo'}
    ]
  }
};