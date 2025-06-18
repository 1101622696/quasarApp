export const TIPOS_FILTRO = {
  TODOS: 'todos',
  PERFIL: 'perfil',
  ESTADO: 'estado'
};

export const CONFIG_FILTROS = {
  [TIPOS_FILTRO.TODOS]: {
    titulo: 'Todos los Usuarios',
    icono: 'user',
    color: 'primary',
    campoOrden: null,
    etiquetaAsc: 'Ascendente',
    etiquetaDesc: 'Descendente',
    campoDatos: null
  },
  [TIPOS_FILTRO.PERFIL]: {
    titulo: 'Por Perfil',
    icono: 'person',
    color: 'accent',
    campoOrden: null,
    campoDatos: 'perfil',
    esFiltroTexto: true,
    opcionesFiltro: [
      {valor: 'coordinador', etiqueta: 'Coordinadores'},
      {valor: 'cliente', etiqueta: 'Cliente'},
      {valor: 'piloto', etiqueta: 'Piloto'},
      {valor: 'jefepiloto', etiqueta: 'Jefe de pilotos'}
    ]
  },
  [TIPOS_FILTRO.ESTADO]: {
    titulo: 'Usuarios por Estado',
    icono: 'toggle_on',
    color: 'green',
    campoOrden: null,
    campoDatos: 'estado',
    esFiltroTexto: true,
    opcionesFiltro: [
      {valor: 'activo', etiqueta: 'activos'},
      {valor: 'inactivo', etiqueta: 'Inactivos'}
    ]
}
};