export const TIPOS_FILTRO = {
  TODOS: 'todos',
  FECHA: 'fecha',
  COSTO: 'costo',
  OBSERVACION: 'observacion',
  IDENTIFICACION: 'identificacion',
  NUMEROSERIE: 'numeroserie'
};

export const CONFIG_FILTROS = {
  [TIPOS_FILTRO.TODOS]: {
    titulo: 'Todos los Mantenimientos',
    icono: 'user',
    color: 'primary',
    campoOrden: null,
    etiquetaAsc: 'Ascendente',
    etiquetaDesc: 'Descendente',
    campoDatos: null
  },
  [TIPOS_FILTRO.FECHA]: {
    titulo: 'Mantenimientos por Fecha',
    icono: 'event',
    color: 'secondary',
    campoOrden: 'fecha',
    etiquetaAsc: 'Antiguas',
    etiquetaDesc: 'Recientes', 
    campoDatos: 'fecha de mantenimiento'
  },
  [TIPOS_FILTRO.COSTO]: {
    titulo: 'Mantenimientos por costo',
    icono: 'money',
    color: 'accent',
    campoOrden: 'costo',
    etiquetaAsc: 'costosos',
    etiquetaDesc: 'valor',
    campoDatos: 'valor'
  },
  [TIPOS_FILTRO.OBSERVACION]: {
    titulo: 'Mantenimientos por observacion',
    icono: 'book',
    color: 'accent',
    campoOrden: null,
    campoDatos: 'observaciones-mantenimiento',
    esFiltroTexto: true,
    opcionesFiltro: [
      {valor: 'helices', etiqueta: 'helices'},
      {valor: 'gimball', etiqueta: 'gimball'}
    ]
  },
  [TIPOS_FILTRO.IDENTIFICACION]: {
    titulo: 'Piloto encargado',
    icono: 'person',
    color: 'accent',
    campoOrden: null,
    campoDatos: 'piloto responsable',
    esFiltroTexto: true,
    opcionesFiltro: [
      {valor: '1101622696', etiqueta: 'Diego'},
      {valor: 'Anderson', etiqueta: 'Anderson'}
    ]
  },
  [TIPOS_FILTRO.NUMEROSERIE]: {
    titulo: 'Mantenimientos por Dron',
    icono: 'flight',
    color: 'green',
    campoOrden: null,
    campoDatos: 'codigodron',
    esFiltroTexto: true,
    opcionesFiltro: [
      {valor: '01234', etiqueta: '01234 mavic1'},
      {valor: '123456789', etiqueta: '0123456 mavic1'}
    ]
}
};