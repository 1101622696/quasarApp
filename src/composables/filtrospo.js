export const TIPOS_FILTRO = {
  TODOS: 'todos',
  FECHA: 'fecha',
  TIEMPO: 'tiempo',
  DISTANCIA: 'distancia',
  ALTURA: 'altura',

};

export const CONFIG_FILTROS = {
  [TIPOS_FILTRO.TODOS]: {
    titulo: 'Todos los Postvuelos',
    icono: 'user',
    color: 'primary',
    campoOrden: null,
    etiquetaAsc: 'Ascendente',
    etiquetaDesc: 'Descendente',
    campoDatos: null
  },
  [TIPOS_FILTRO.FECHA]: {
    titulo: 'Postvuelos por Fecha',
    icono: 'event',
    color: 'secondary',
    campoOrden: 'fecha',
    etiquetaAsc: 'Antiguas',
    etiquetaDesc: 'Recientes', 
    campoDatos: 'id- fecha'
  },
  [TIPOS_FILTRO.TIEMPO]: {
    titulo: 'Postvuelos por Tiempo',
    icono: 'schedule',
    color: 'accent',
    campoOrden: 'tiempo',
    etiquetaAsc: 'Menos minutos',
    etiquetaDesc: 'Más minutos',
    campoDatos: 'duración'
  },
  [TIPOS_FILTRO.DISTANCIA]: {
    titulo: 'Postvuelos por Distancia',
    icono: 'street',
    color: 'secondary',
    campoOrden: 'distancia',
    etiquetaAsc: 'Más distancia',
    etiquetaDesc: 'Menos distancia',
    campoDatos: 'distancia recorrida'
  },
  [TIPOS_FILTRO.ALTURA]: {
    titulo: 'Postvuelos por altura',
    icono: 'flight',
    color: 'accent',
    campoOrden: 'altura',
    etiquetaAsc: 'alturas bajas',
    etiquetaDesc: 'alturas maximas',
    campoDatos: 'altura máxima alcanzada'
  },
};