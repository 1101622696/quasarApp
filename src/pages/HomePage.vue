<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-xs-12 col-sm-6 col-md-3" v-for="stat in stats" :key="stat.label">
        <q-card
          class="q-pa-sm cursor-pointer"
          :class="{ 'bg-primary-1': filtroEstadisticaActivo === stat.filtro }"
          @click="filtrarPorEstadistica(stat.filtro)"
        >
          <div class="text-grey-8 text-subtitle2">
            <i :class="stat.icon" class="q-mr-sm" />{{ stat.label }}
          </div>
          <div class="text-h5 text-bold">{{ stat.value }}</div>
        </q-card>
      </div>
    </div>

    <q-tabs
      v-model="tab"
      class="text-primary q-mb-md"
      dense
      align="left"
      active-color="primary"
      indicator-color="primary"
      @update:model-value="cambiarTab"
    >
      <q-tab name="solicitudes" label="Solicitudes" />
      <q-tab name="prevuelos" label="Prevuelos" />
      <q-tab name="postvuelos" label="Postvuelos" />
    </q-tabs>

    <div v-if="cargando" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <q-item-label class="q-mt-sm">Cargando datos...</q-item-label>
    </div>

<TablaRegistros
  v-if="registrosActuales.length > 0"
  :registros="registrosActuales"
  :tipoRegistro="tab"
  :perfilUsuario="useUsuario.perfile"
  @ver-detalles="verDetalle"
  @editar="handleEditar"
  @ir-prevuelo="handleIrAPrevuelo"
  @ir-postvuelo="handleIrAPostvuelo"
  @guardar-formulario="guardarFormularioHome"
  @aprobar-directo="handleAprobarDirecto"
  @denegar-directo="handleDenegarDirecto"
  @cancelar-directo="handleCancelarDirecto"
/>

      <div v-else class="text-center q-pa-md">
        <q-icon name="info" color="grey" size="3em" />
        <p>No hay datos disponibles para mostrar.</p>
      </div>

      <q-btn flat round dense icon="clean" @click="limpiarFiltros" />

      <div class="row justify-center q-mt-md" v-if="totalPaginas > 1">
        <q-pagination
          v-model="pagina"
          :max="totalPaginas"
          color="primary"
          direction-links
          boundary-links
          @update:model-value="cargarDatos"
        />
      </div>
  </q-page>
</template>

<script setup>

import { ref, computed, onMounted, watch } from 'vue'
import TablaRegistros from 'components/TablaRegistros.vue'
import { useStoreUsuarios } from '../stores/usuarios'
import { useStorePrevuelos } from '../stores/prevuelos'
import { useStorePostvuelos } from '../stores/postvuelos'
import { useStoreSolicitudes } from '../stores/solicitudes'

const useUsuario = useStoreUsuarios()
const usePrevuelo = useStorePrevuelos()
const usePostvuelo = useStorePostvuelos()
const useSolicitud = useStoreSolicitudes()

const tab = ref('solicitudes')
const cargando = ref(false)
const pagina = ref(1)
const totalPaginas = ref(1)
const mostrarFormulario = ref(false);
const tipoFormulario = ref('solicitudes');
const accionFormulario = ref('crear');
const datosFormulario = ref({});

const estadoSeleccionado = ref('Todos')
const busqueda = ref('')

const solicitudes = ref([])
const prevuelos = ref([])
const postvuelos = ref([])
const filtroEstadisticaActivo = ref(null)

const stats = ref([
  { label: 'Total Solicitudes', icon: 'las la-clipboard', value: 0, filtro: 'total' },
  { label: 'Pendientes', icon: 'las la-clock', value: 0, filtro: 'pendientes' },
  { label: 'En proceso', icon: 'las la-spinner', value: 0, filtro: 'enproceso' },
  { label: 'Cancelados', icon: 'lar la-window-close', value: 0, filtro: 'cancelados' },
  { label: 'Aprobados', icon: 'las la-check-circle', value: 0, filtro: 'aprobados' },
])

const registrosActuales = computed(() => {
  const datos = {
    solicitudes: solicitudes.value,
    prevuelos: prevuelos.value,
    postvuelos: postvuelos.value,
  }

  return datos[tab.value] || []
})

const tipoRegistroActual = computed(() => {
  const tipos = {
    solicitudes: 'solicitud',
    prevuelos: 'prevuelo',
    postvuelos: 'postvuelo',
  }
  console.log(tipoRegistroActual)

  return tipos[tab.value] || ''
})

async function cambiarTab(nuevoTab) {
  pagina.value = 1
  await cargarDatos()
  await actualizarEstadisticas()
  console.log(nuevoTab)
}

async function cargarDatos() {
  cargando.value = true
  console.log('Cargando datos por perfil')

  const email = useUsuario.correo || localStorage.getItem('email')
  const perfil = useUsuario.perfile
  const isJefePiloto = perfil && perfil.toLowerCase() === 'jefepiloto'
  console.log('Email:', email, 'Perfil:', perfil)
  try {
    let datosOriginales = []

    switch (tab.value) {
      case 'solicitudes':
        if (filtroEstadisticaActivo.value === 'pendientes') {
          if (isJefePiloto) {
            datosOriginales = await useSolicitud.listarSolicitudesPendientes()
          } else {
            datosOriginales = await useSolicitud.listarSolicitudesPendientesEmail(email)
          }
        } else if (filtroEstadisticaActivo.value === 'aprobados') {
          if (isJefePiloto) {
            datosOriginales = await useSolicitud.listarSolicitudesAprobadas()
          } else {
            datosOriginales = await useSolicitud.listarSolicitudesAprobadasEmail(email)
          }
        } else if (filtroEstadisticaActivo.value === 'enproceso') {
          if (isJefePiloto) {
            datosOriginales = await useSolicitud.listarSolicitudesEnproceso()
          } else {
            datosOriginales = await useSolicitud.listarSolicitudesEnprocesoEmail(email)
          }
        } else if (filtroEstadisticaActivo.value === 'cancelados') {
          if (isJefePiloto) {
            datosOriginales = await useSolicitud.listarSolicitudesCanceladas()
          } else {
            datosOriginales = await useSolicitud.listarSolicitudesCanceladasEmail(email)
          }
        } else {
          if (isJefePiloto) {
            datosOriginales = await useSolicitud.listarSolicitudesConEtapas()
          } else {
            datosOriginales = await useSolicitud.listarSolicitudesConEtapasPorEmail(email)
          }
        }

        if (Array.isArray(datosOriginales)) {
          solicitudes.value = datosOriginales.map((item) => ({
            id: item.consecutivo,
            empresa: item.empresa || '',
            piloto: item.nombre_completo || '',
            estado: item.estado || '',
            estadoProceso: item.estadoProceso || '',
            datosOriginales: item,
          }))
        } else {
          solicitudes.value = []
          console.error('Datos de solicitudes no válidos:', datosOriginales)
        }
        break

      case 'prevuelos':
        if (filtroEstadisticaActivo.value === 'completados') {
          datosOriginales = await usePrevuelo.listarPrevuelosPorEstado('Proceso Completado')
        } else if (filtroEstadisticaActivo.value === 'pendientes') {
          if (isJefePiloto) {
            datosOriginales = await usePrevuelo.listarPrevuelosPendientes()
          } else {
            datosOriginales = await usePrevuelo.listarPrevuelosPendientesEmail(email)
          }
        } else if (filtroEstadisticaActivo.value === 'aprobados') {
          if (isJefePiloto) {
            datosOriginales = await usePrevuelo.listarPrevuelosAprobados()
          } else {
            datosOriginales = await usePrevuelo.listarPrevuelosAprobadosEmail(email)
          }
        } else if (filtroEstadisticaActivo.value === 'enproceso') {
          if (isJefePiloto) {
            datosOriginales = await usePrevuelo.listarPrevuelosEnproceso()
          } else {
            datosOriginales = await usePrevuelo.listarPrevuelosEnprocesoEmail(email)
          }
        } else if (filtroEstadisticaActivo.value === 'cancelados') {
          if (isJefePiloto) {
            datosOriginales = await useSolicitud.listarSolicitudesCanceladas()
          } else {
            datosOriginales = await useSolicitud.listarSolicitudesCanceladasEmail(email)
          }
        } else {
          if (isJefePiloto) {
            datosOriginales = await usePrevuelo.listarPrevuelosConEtapas()
          } else {
            datosOriginales = await usePrevuelo.listarPrevuelosConEtapasPorEmail(email)
          }
        }

        if (Array.isArray(datosOriginales)) {
          prevuelos.value = datosOriginales.map((item) => ({
            id: item.solicitudesaprobadas,
            empresa: item.autorizacion || '',
            piloto: item.piloto || '',
            estado: item['estado del prevuelo'] || '',
            estadoProceso: item.estadoProceso || '',
            datosOriginales: item,
          }))
        } else {
          prevuelos.value = []
          console.error('Datos de prevuelos no válidos:', datosOriginales)
        }
        break

      case 'postvuelos':
        if (filtroEstadisticaActivo.value === 'completados') {
          datosOriginales = await usePostvuelo.listarPostvuelosPorEstado('Proceso Completado')
        } else if (filtroEstadisticaActivo.value === 'pendientes') {
          if (isJefePiloto) {
            datosOriginales = await usePostvuelo.listarPostvuelosPendientes()
          } else {
            datosOriginales = await usePostvuelo.listarPostvuelosPendientesEmail(email)
          }
        } else if (filtroEstadisticaActivo.value === 'aprobados') {
          if (isJefePiloto) {
            datosOriginales = await usePostvuelo.listarPostvuelosAprobados()
          } else {
            datosOriginales = await usePostvuelo.listarPostvuelosAprobadosEmail(email)
          }
        } else if (filtroEstadisticaActivo.value === 'enproceso') {
          if (isJefePiloto) {
            datosOriginales = await usePrevuelo.listarPrevuelosEnproceso()
          } else {
            datosOriginales = await usePrevuelo.listarPrevuelosEnprocesoEmail(email)
          }
        } else if (filtroEstadisticaActivo.value === 'cancelados') {
          if (isJefePiloto) {
            datosOriginales = await useSolicitud.listarSolicitudesCanceladas()
          } else {
            datosOriginales = await useSolicitud.listarSolicitudesCanceladasEmail(email)
          }
        } else {
           if (isJefePiloto) {
         datosOriginales = await usePostvuelo.listarPostvuelosConEtapas()
          } else {
         datosOriginales = await usePostvuelo.listarPostvuelosConEtapasPorEmail(email)
          }
       }

        if (Array.isArray(datosOriginales)) {
          postvuelos.value = datosOriginales.map((item) => ({
            id: item['consecutivo-solicitud'],
            empresa: item.empresa_post || '',
            piloto: item['piloto-postvuelo'] || '',
            estado: item['estado del postvuelo'] || '',
            estadoProceso: item.estadoProceso || '',
            datosOriginales: item,
          }))
        } else {
          postvuelos.value = []
          console.error('Datos de postvuelos no válidos:', datosOriginales)
        }
        break
    }

    await actualizarEstadisticas()
  } catch (error) {
    console.error(`Error al cargar datos de ${tab.value}:`, error)
  } finally {
    cargando.value = false
  }
}

async function actualizarEstadisticas() {
  try {
    let cantidadTotal = 0
    let cantidadPendientes = 0
    let cantidadAprobados = 0
    let cantidadEnProceso = 0
    let cantidadCancelados = 0
    let cantidadCompletados = 0 

    const email = useUsuario.correo || localStorage.getItem('email');
    const perfil = useUsuario.perfile;
    const isJefePiloto = perfil && perfil.toLowerCase() === 'jefepiloto';
    
    let todasSolicitudes;
    
    if (isJefePiloto) {
      todasSolicitudes = await useSolicitud.listarSolicitudesConEtapas();
    } else {
      todasSolicitudes = await useSolicitud.listarSolicitudesConEtapasPorEmail(email);
    }
    
     let todosPrevuelos;
    
    if (isJefePiloto) {
      todosPrevuelos = await usePrevuelo.listarPrevuelosConEtapas();
    } else {
      todosPrevuelos = await usePrevuelo.listarPrevuelosConEtapasPorEmail(email);
    }
    
    let todosPostvuelos;
    
    if (isJefePiloto) {
      todosPostvuelos = await usePostvuelo.listarPostvuelosConEtapas();
    } else {
      todosPostvuelos = await usePostvuelo.listarPostvuelosConEtapasPorEmail(email);
    }

    switch (tab.value) {
      case 'solicitudes':
        cantidadTotal = todasSolicitudes.length
        cantidadPendientes = todasSolicitudes.filter((s) => s.estado === 'Pendiente').length
        cantidadAprobados = todasSolicitudes.filter((s) => s.estado === 'Aprobado').length
        cantidadEnProceso = todasSolicitudes.filter(
          (s) => s.estado === 'Aprobado' && (!s.prevueloAprobado || !s.postvueloAprobado),
        ).length
        cantidadCancelados = todasSolicitudes.filter((s) => s.estado === 'Cancelado').length
        cantidadCompletados = todasSolicitudes.filter(
          (s) => s.estadoProceso === 'Proceso Completado',
        ).length

        stats.value = [
          {
            label: 'Total Solicitudes',
            icon: 'las la-clipboard',
            value: cantidadTotal,
            filtro: 'total',
          },
          {
            label: 'Pendientes',
            icon: 'las la-clock',
            value: cantidadPendientes,
            filtro: 'pendientes',
          },
          {
            label: 'En proceso',
            icon: 'las la-spinner',
            value: cantidadEnProceso,
            filtro: 'enproceso',
          },
          {
            label: 'Aprobados',
            icon: 'las la-check-circle',
            value: cantidadAprobados,
            filtro: 'aprobados',
          },
          {
            label: 'Completados',
            icon: 'las la-check-double',
            value: cantidadCompletados,
            filtro: 'completados',
          },
          {
            label: 'Cancelados',
            icon: 'las la-window-close',
            value: cantidadCancelados,
            filtro: 'caneladas',
          },
        ]

        break

      case 'prevuelos':
        cantidadTotal = todosPrevuelos.length
        cantidadPendientes = todosPrevuelos.filter(
          (s) => s['estado del prevuelo'] === 'Pendiente',
        ).length
        cantidadAprobados = todosPrevuelos.filter(
          (s) => s['estado del prevuelo'] === 'Aprobado',
        ).length
        cantidadEnProceso = todosPrevuelos.filter(
          (s) =>
            s['estado del prevuelo'] === 'Aprobado' &&
            (!s.prevueloAprobado || !s.postvueloAprobado),
        ).length
        cantidadCancelados = todosPrevuelos.filter((s) => s['estado del prevuelo'] === 'Cancelado').length
        cantidadCompletados = todosPrevuelos.filter(
          (s) => s.estadoProceso === 'Proceso Completado',
        ).length

        stats.value = [
          {
            label: 'Total Prevuelos',
            icon: 'las la-clipboard',
            value: cantidadTotal,
            filtro: 'total',
          },
          {
            label: 'Pendientes',
            icon: 'las la-clock',
            value: cantidadPendientes,
            filtro: 'pendientes',
          },
          {
            label: 'En proceso',
            icon: 'las la-spinner',
            value: cantidadEnProceso,
            filtro: 'enproceso',
          },
          {
            label: 'Aprobados',
            icon: 'las la-check-circle',
            value: cantidadAprobados,
            filtro: 'aprobados',
          },
          {
            label: 'Completados',
            icon: 'las la-check-double',
            value: cantidadCompletados,
            filtro: 'completados',
          },
          {
            label: 'Cancelados',
            icon: 'las la-window-close',
            value: cantidadCancelados,
            filtro: 'caneladas',
          },
        ]

        break

      case 'postvuelos':
        cantidadTotal = todosPostvuelos.length
        cantidadPendientes = todosPostvuelos.filter(
          (s) => s['estado del postvuelo'] === 'Pendiente',
        ).length
        cantidadAprobados = todosPostvuelos.filter(
          (s) => s['estado del postvuelo'] === 'Aprobado',
        ).length
        cantidadEnProceso = todosPostvuelos.filter(
          (s) =>
            s['estado del postvuelo'] === 'Aprobado' &&
            (!s.prevueloAprobado || !s.postvueloAprobado),
        ).length
        cantidadCancelados = todosPostvuelos.filter((s) => s['estado del postvuelo'] === 'Cancelado').length
        cantidadCompletados = todosPostvuelos.filter(
          (s) => s.estadoProceso === 'Proceso Completado',
        ).length

        stats.value = [
          {
            label: 'Total Postvuelos',
            icon: 'las la-clipboard',
            value: cantidadTotal,
            filtro: 'total',
          },
          {
            label: 'Pendientes',
            icon: 'las la-clock',
            value: cantidadPendientes,
            filtro: 'pendientes',
          },
          {
            label: 'En proceso',
            icon: 'las la-spinner',
            value: cantidadEnProceso,
            filtro: 'enproceso',
          },
          {
            label: 'Aprobados',
            icon: 'las la-check-circle',
            value: cantidadAprobados,
            filtro: 'aprobados',
          },
          {
            label: 'Completados',
            icon: 'las la-check-double',
            value: cantidadCompletados,
            filtro: 'completados',
          },
          {
            label: 'Cancelados',
            icon: 'las la-window-close',
            value: cantidadCancelados,
            filtro: 'caneladas',
          },
        ]

        break
    }
  } catch (error) {
    console.error('Error al actualizar estadísticas:', error)
  }
}

async function verDetalle(id, tipo) {
  try {
    switch (tipo) {
      case 'solicitudes':
        return await useSolicitud.obtenerdatodessolicitud(id)
      case 'prevuelos':
        return await usePrevuelo.obtenerdatodeprevuelo(id)
      case 'postvuelos':
        return await usePostvuelo.obtenerdatodepostvuelo(id)
    }
  } catch (error) {
    console.error(`Error al obtener detalles de ${tipo} ${id}:`, error)
    return null
  }
}

function limpiarFiltros() {
  estadoSeleccionado.value = 'Todos'
  busqueda.value = ''
  cargarDatos()
}

watch([estadoSeleccionado, busqueda], () => {
  pagina.value = 1
  cargarDatos()
})

async function filtrarPorEstadistica(filtro) {
  if (filtroEstadisticaActivo.value === filtro) {
    filtroEstadisticaActivo.value = null
    estadoSeleccionado.value = 'Todos'
  } else {
    filtroEstadisticaActivo.value = filtro

    switch (filtro) {
      case 'pendientes':
        estadoSeleccionado.value = 'Pendientes'
        break
      case 'aprobados':
        estadoSeleccionado.value = 'Aprobados'
        break
      case 'enproceso':
        estadoSeleccionado.value = 'En proceso'
        break
      case 'cancelados':
        estadoSeleccionado.value = 'Cancelados'
        break
      case 'total':
      default:
        estadoSeleccionado.value = 'Todos'
        break
    }
  }

  await cargarDatos()
}

onMounted(async () => {
  await cargarDatos()
  await actualizarEstadisticas()
})

function abrirFormulario({ accion, tipo, datos = {} }) {
  console.log("Abriendo formulario:", { accion, tipo, datos });
  
  tipoFormulario.value = datos.tipoRegistro || tipo || tab.value;
  accionFormulario.value = accion;
  
  datosFormulario.value = {
    ...datos,
    tipoRegistro: datos.tipoRegistro || tipo || tab.value
  };
  
  mostrarFormulario.value = true;
}

async function guardarFormularioHome(data) {
  cargando.value = true;
  try {
    const tipoRegistro = data.tipoRegistro || tipoFormulario.value;
    const accion = data.accion || accionFormulario.value;
    
    console.log("Guardando formulario:", { tipoRegistro, accion, data });
    
    let resultado;
    
    switch (tipoRegistro) {
      case 'solicitudes':
        if (accion === 'crear') {
          resultado = await useSolicitud.postSolicitud(data);
        } else if (accion === 'editar') {
          resultado = await useSolicitud.putSolicitud(data.id);
        } else if (accion === 'aprobar') {
          resultado = await useSolicitud.putAprobarSolicitud(data.id);
        } else if (accion === 'denegar') {
          resultado = await useSolicitud.putDenegarSolicitud(data.id);
        } else if (accion === 'cancelar') {
          resultado = await useSolicitud.putCancelarSolicitud(data.id);
        }
        
        break;
        
      case 'prevuelos':
        if (accion === 'crear') {
          resultado = await usePrevuelo.postPrevuelo({
            ...data,
            consecutivo: data.consecutivo, 
            tipoRegistro: 'prevuelos' 
          });
          
        } else if (accion === 'editar') {
          // resultado = await usePrevuelo.putPrevuelo(data.id);
          const consecutivo = data.solicitudesaprobadas;
         resultado = await usePrevuelo.putPrevuelo(consecutivo, data);
        } else if (accion === 'aprobar') {
          resultado = await usePrevuelo.putAprobarPrevuelo(data.id);
        } else if (accion === 'denegar') {
          resultado = await usePrevuelo.putDenegarPrevuelo(data.id);
        }
        break;
        
      case 'postvuelos':
        if (accion === 'crear') {
          resultado = await usePostvuelo.postPostvuelo({
            ...data,
            consecutivo: data.consecutivo, 
            tipoRegistro: 'postvuelos' 
          });
        } else if (accion === 'editar') {
          const consecutivo = data["consecutivo-solicitud"];
          console.log("Editando postvuelo con consecutivo:", consecutivo);
          
          if (!consecutivo) {
            console.error("Error: consecutivo-solicitud es undefined o vacío", data);
            throw new Error("No se pudo editar el postvuelo: falta el consecutivo de solicitud");
          }
          
          resultado = await usePostvuelo.putPostvuelo(consecutivo, data);
        } else if (accion === 'aprobar') {
          resultado = await usePostvuelo.putAprobarPostvuelo(data.id);
        } else if (accion === 'denegar') {
          resultado = await usePostvuelo.putDenegarPostvuelo(data.id);
        }
        break;
    }
    
    mostrarFormulario.value = false;
    
    await cargarDatos();
    await actualizarEstadisticas();
    console.log('resultado:', resultado);
    
  } catch (error) {
    console.error('Error al guardar formulario:', error);
  } finally {
    cargando.value = false;
  }
}

function handleEditar(registro) {
  abrirFormulario({
    accion: 'editar',
    tipo: tab.value,
    datos: registro.datosOriginales || registro
  });
}

async function handleAprobarDirecto(data) {
  cargando.value = true;
  try {
    let resultado;
    
    switch (data.tipo) {
      case 'prevuelos':
        resultado = await usePrevuelo.putAprobarPrevuelo(data.id);
        break;
      case 'postvuelos':
        resultado = await usePostvuelo.putAprobarPostvuelo(data.id);
        break;
    }
    
    await cargarDatos();
    await actualizarEstadisticas();
    console.log('resultado:', resultado);
    
  } catch (error) {
    console.error('Error al aprobar directamente:', error);
  } finally {
    cargando.value = false;
  }
}

async function handleDenegarDirecto(data) {
  cargando.value = true;
  try {
    let resultado;
    
    switch (data.tipo) {
      case 'prevuelos':
        resultado = await usePrevuelo.putDenegarPrevuelo(data.id);
        break;
      case 'postvuelos':
        resultado = await usePostvuelo.putDenegarPostvuelo(data.id);
        break;
    }
    
    console.log('resultado:', resultado);

    await cargarDatos();
    await actualizarEstadisticas();
    
  } catch (error) {
    console.error('Error al denegar directamente:', error);

  } finally {
    cargando.value = false;
  }
}


async function handleCancelarDirecto(data) {
  cargando.value = true;
  try {
    const resultado = await useSolicitud.putCancelarSolicitud(data.id, data.nota);
    
    console.log('resultado cancelación:', resultado);
    
    await cargarDatos();
    await actualizarEstadisticas();
    
  } catch (error) {
    console.error('Error al cancelar la solicitud:', error);

  } finally {
    cargando.value = false;
  }
}

function handleIrAPrevuelo(id) {
  abrirFormulario({
    accion: 'crear',
    tipo: 'prevuelos',  
    datos: {
      consecutivo: id,
      solicitudId: id,
      tipoRegistro: 'prevuelos'  
    }
  });
}

function handleIrAPostvuelo(id) {
  abrirFormulario({
    accion: 'crear',
    tipo: 'postvuelos',  
    datos: {
      consecutivo: id,  
      prevueloId: id,   
      tipoRegistro: 'postvuelos'  
    }
  });
}


defineOptions({
  name: 'HomePage'
})

</script>
