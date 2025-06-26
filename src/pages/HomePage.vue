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

    <div v-if="cargando" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <q-item-label class="q-mt-sm">Cargando datos...</q-item-label>
    </div>

    <TablaRegistros
      v-if="registrosActuales.length > 0"
      :registros="registrosActuales"
      :perfilUsuario="useUsuario.perfile"
      @ver-detalles="verDetalle"
      @editar="handleEditar"
      @ir-prevuelo="handleIrAPrevuelo"
      @ir-postvuelo="handleIrAPostvuelo"
      @guardar-formulario="guardarFormularioHome"
      @aprobar-directo="handleAprobarDirecto"
      @denegar-directo="handleDenegarDirecto"
      @cancelar-directo="handleCancelarDirecto"
      @enespera-directo="handleEnesperaDirecto"
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

import { ref, computed, onMounted } from 'vue'
import TablaRegistros from 'components/TablaRegistros.vue'
import { useStoreUsuarios } from '../stores/usuarios'
import { useStorePrevuelos } from '../stores/prevuelos'
import { useStorePostvuelos } from '../stores/postvuelos'
import { useStoreSolicitudes } from '../stores/solicitudes'

const useUsuario = useStoreUsuarios()
const usePrevuelo = useStorePrevuelos()
const usePostvuelo = useStorePostvuelos()
const useSolicitud = useStoreSolicitudes()

const cargando = ref(false)
const mostrarFormulario = ref(false)
const accionFormulario = ref('crear')
const filtroEstadisticaActivo = ref(null)
const pagina = ref(1)
const totalPaginas = ref(1)

const tipoFormulario = ref(null)
const datosFormulario = ref(null)
const tab = ref(1)

const resumenDatos = ref(null)

const stats = ref([
  { label: 'Total', icon: 'las la-clipboard', value: 0, filtro: 'total' },
  { label: 'Pendientes', icon: 'las la-clock', value: 0, filtro: 'pendientes' },
  { label: 'Sin Prevuelos', icon: 'las la-spinner', value: 0, filtro: 'sinprevuelos' },
  { label: 'Sin Postvuelos', icon: 'las la-spinner', value: 0, filtro: 'sinpostvuelos' },
  { label: 'Aprobados', icon: 'las la-check-circle', value: 0, filtro: 'aprobados' },
  { label: 'Completados', icon: 'las la-check-double', value: 0, filtro: 'completados' },
  { label: 'Cancelados', icon: 'lar la-window-close', value: 0, filtro: 'cancelados' },
  { label: 'En espera', icon: 'las la-spinner', value: 0, filtro: 'enespera' },
])

const registrosActuales = computed(() => {
  if (!resumenDatos.value) return []
  
  if (filtroEstadisticaActivo.value) {
    const categoria = resumenDatos.value[filtroEstadisticaActivo.value]
    return categoria ? categoria.consecutivos : []
  }
    return resumenDatos.value.total ? resumenDatos.value.total.consecutivos : []
})

async function cargarDatos() {
  cargando.value = true
  console.log('Cargando datos por perfil')

  const email = useUsuario.correo || localStorage.getItem('email')
  const perfil = useUsuario.perfile
  const isJefePiloto = perfil && perfil.toLowerCase() === 'jefepiloto'
  const isCliente = perfil && perfil.toLowerCase() === 'cliente'
  const isPiloto = perfil && perfil.toLowerCase() === 'piloto'
  const isCoordinador = perfil && perfil.toLowerCase() === 'coordinador'
  
  try {
    let datosResumen
    
    if (isJefePiloto) {
      datosResumen = await useSolicitud.obtenerResumenJefe()
    } else if (isCliente) {
      datosResumen = await useSolicitud.obtenerResumenPorSolicitante(email)
    } else if (isPiloto) {
      datosResumen = await useSolicitud.obtenerResumenPorEmail(email)
    } else if (isCoordinador) {
      // Para coordinador: obtener tanto sus solicitudes como sus asignaciones
      const [datosSolicitante, datosPiloto] = await Promise.all([
        useSolicitud.obtenerResumenPorSolicitante(email),
        useSolicitud.obtenerResumenPorEmail(email)
      ])
      
      console.log('Datos solicitante:', datosSolicitante)
      console.log('Datos piloto:', datosPiloto)
      
      // Combinar los datos evitando duplicados
      datosResumen = combinarResumenCoordinador(datosSolicitante, datosPiloto)
    } else {
      datosResumen = await useSolicitud.obtenerResumenPorSolicitante(email)
    }
     
    console.log('Datos recibidos:', datosResumen) 
    
    if (datosResumen && datosResumen.resumen) {
      resumenDatos.value = datosResumen.resumen
      actualizarEstadisticas()
    } else {
      console.warn('No se recibieron datos válidos:', datosResumen)
      resumenDatos.value = null
    }
    
  } catch (error) {
    console.error('Error al cargar datos:', error)
    resumenDatos.value = null
  } finally {
    cargando.value = false
  }
}

// Función auxiliar para combinar datos del coordinador
function combinarResumenCoordinador(datosSolicitante, datosPiloto) {
  // Si alguno es null o no tiene resumen, usar el otro
  if (!datosSolicitante || !datosSolicitante.resumen) {
    return datosPiloto
  }
  if (!datosPiloto || !datosPiloto.resumen) {
    return datosSolicitante
  }
  
  const resumenCombinado = {
    total: { count: 0, consecutivos: [] },
    pendientes: { count: 0, consecutivos: [] },
    enespera: { count: 0, consecutivos: [] },
    sinprevuelos: { count: 0, consecutivos: [] },
    sinpostvuelos: { count: 0, consecutivos: [] },
    aprobados: { count: 0, consecutivos: [] },
    completados: { count: 0, consecutivos: [] },
    cancelados: { count: 0, consecutivos: [] }
  }
  
  // Combinar cada categoría
  const categorias = ['total', 'pendientes', 'enespera', 'sinprevuelos', 'sinpostvuelos', 'aprobados', 'completados', 'cancelados']
  
  categorias.forEach(categoria => {
    // Set independiente para cada categoría
    const consecutivosCategoria = new Set()
    
    // Agregar consecutivos del solicitante
    if (datosSolicitante.resumen[categoria] && datosSolicitante.resumen[categoria].consecutivos) {
      datosSolicitante.resumen[categoria].consecutivos.forEach(registro => {
        const consecutivo = registro.consecutivo || registro
        if (!consecutivosCategoria.has(consecutivo)) {
          resumenCombinado[categoria].consecutivos.push(registro)
          consecutivosCategoria.add(consecutivo)
        }
      })
    }
    
    // Agregar consecutivos del piloto (solo los únicos)
    if (datosPiloto.resumen[categoria] && datosPiloto.resumen[categoria].consecutivos) {
      datosPiloto.resumen[categoria].consecutivos.forEach(registro => {
        const consecutivo = registro.consecutivo || registro
        if (!consecutivosCategoria.has(consecutivo)) {
          resumenCombinado[categoria].consecutivos.push(registro)
          consecutivosCategoria.add(consecutivo)
        }
      })
    }
    
    // Actualizar el count
    resumenCombinado[categoria].count = resumenCombinado[categoria].consecutivos.length
  })
  
  console.log('Resumen combinado final:', resumenCombinado)
  
  return {
    ok: true,
    resumen: resumenCombinado,
    email: datosSolicitante.email || datosPiloto.email,
    mensaje: 'Resumen combinado obtenido exitosamente'
  }
}

// function actualizarEstadisticas() {
//   if (!resumenDatos.value) return
  
//   stats.value.forEach(stat => {
//     const categoria = resumenDatos.value[stat.filtro]
//     stat.value = categoria ? categoria.count : 0
//   })
// }

async function actualizarEstadisticas() {
  if (!resumenDatos.value) return
  
  stats.value.forEach(stat => {
    const categoria = resumenDatos.value[stat.filtro]
    stat.value = categoria ? categoria.count : 0
  })
}

function filtrarPorEstadistica(filtro) {
  if (filtroEstadisticaActivo.value === filtro) {
    filtroEstadisticaActivo.value = null
  } else {
    filtroEstadisticaActivo.value = filtro
  }
}

function limpiarFiltros() {
  filtroEstadisticaActivo.value = null
}

async function verDetalle(consecutivo, tipo) {
  try {
    let resultado;
    switch (tipo) {
      case 'solicitudes':
        resultado = await useSolicitud.obtenerdatodessolicitud(consecutivo);
        break;
      case 'prevuelos':
        resultado = await usePrevuelo.obtenerdatodeprevuelo(consecutivo);
        break;
      case 'postvuelos':
        resultado = await usePostvuelo.obtenerdatodepostvuelo(consecutivo);
        break;
    }
    console.log(`Datos obtenidos para ${tipo}:`, resultado);
    
    return resultado;
  } catch (error) {
    console.error(`Error al obtener detalles de ${tipo} ${consecutivo}:`, error);
    return null;
  }
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
          resultado = await useSolicitud.putSolicitud(data.consecutivo);
        } else if (accion === 'aprobar') {
          resultado = await useSolicitud.putAprobarSolicitud(data.consecutivo);
        } else if (accion === 'denegar') {
          resultado = await useSolicitud.putDenegarSolicitud(data.consecutivo);
        } else if (accion === 'cancelar') {
          resultado = await useSolicitud.putCancelarSolicitud(data.consecutivo);
        } else if (accion === 'enespera') {
          resultado = await useSolicitud.putEnesperaSolicitud(data.consecutivo);
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
          const consecutivo = data.solicitudesaprobadas;
          resultado = await usePrevuelo.putPrevuelo(consecutivo, data);
        } else if (accion === 'aprobar') {
          resultado = await usePrevuelo.putAprobarPrevuelo(data.consecutivo);
        } else if (accion === 'denegar') {
          resultado = await usePrevuelo.putDenegarPrevuelo(data.consecutivo);
        }
        break;

case 'postvuelos':
  if (accion === 'crear') {
    const dataToSend = data.formData || {
      ...data,
      consecutivo: data.consecutivo, 
      tipoRegistro: 'postvuelos' 
    };
    resultado = await usePostvuelo.postPostvuelo(dataToSend);
  } else if (accion === 'editar') {
    const consecutivo = data["consecutivo-solicitud"];
    console.log("Editando postvuelo con consecutivo:", consecutivo);
    
    if (!consecutivo) {
      console.error("Error: consecutivo-solicitud es undefined o vacío", data);
      throw new Error("No se pudo editar el postvuelo: falta el consecutivo de solicitud");
    }
    
    // Si viene FormData del formulario, usarlo directamente
    const dataToSend = data.formData || data;
    resultado = await usePostvuelo.putPostvuelo(consecutivo, dataToSend);
  } else if (accion === 'aprobar') {
    resultado = await usePostvuelo.putAprobarPostvuelo(data.consecutivo);
  } else if (accion === 'denegar') {
    resultado = await usePostvuelo.putDenegarPostvuelo(data.consecutivo);
  }
  break;
    }

    // Este bloque ahora está fuera del switch
    if (resultado && resultado.exito !== false) {
      mostrarFormulario.value = false;
      await cargarDatos();
      await actualizarEstadisticas();
      console.log('resultado:', resultado);
    } else {
      console.error('Error en la operación:', resultado);
    }

  } catch (error) {
    console.error('Error al guardar formulario:', error);
  } finally {
    cargando.value = false;
  }
}

function handleEditar(registro) {
  let tipoReal;
  
  if (registro.tipoRegistro) {
    tipoReal = registro.tipoRegistro;
  } else {
    const datos = registro.datosOriginales || registro;
    
    if (datos.postvueloAprobado !== undefined || datos.prevueloId) {
      tipoReal = 'postvuelos';
    } else if (datos.prevueloAprobado !== undefined || datos.solicitudId) {
      tipoReal = 'prevuelos';
    } else {
      tipoReal = 'solicitudes';
    }
  }
  
  console.log('handleEditar - Tipo determinado:', tipoReal);
  console.log('handleEditar - Registro:', registro);
  
  abrirFormulario({
    accion: 'editar',
    tipo: tipoReal, 
    datos: registro.datosOriginales || registro
  });
}

async function handleAprobarDirecto(data) {
  cargando.value = true;
  try {
    let resultado;
    
    switch (data.tipo) {
      case 'prevuelos':
        resultado = await usePrevuelo.putAprobarPrevuelo(data.consecutivo);  
        break;
      case 'postvuelos':
        resultado = await usePostvuelo.putAprobarPostvuelo(data.consecutivo);  
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
    
    if (data.tipo === 'solicitudes') {
      resultado = await useSolicitud.putDenegarSolicitud(
        data.consecutivo,
        "", 
        null, 
        data.notas || "" 
      );
    } else {
      resultado = await guardarFormularioHome({
        consecutivo: data.consecutivo,
        tipoRegistro: data.tipo,
        accion: data.accion
      });
    }
    
    console.log('resultado denegar:', resultado);
    
    await cargarDatos();
    await actualizarEstadisticas();
    
  } catch (error) {
    console.error('Error al denegar:', error);
  } finally {
    cargando.value = false;
  }
}

async function handleCancelarDirecto(data) {
  cargando.value = true;
  try {
    const resultado = await useSolicitud.putCancelarSolicitud(data.consecutivo, data.nota);  
    
    console.log('resultado cancelación:', resultado);
    
    await cargarDatos();
    await actualizarEstadisticas();
    
  } catch (error) {
    console.error('Error al cancelar la solicitud:', error);
  } finally {
    cargando.value = false;
  }
}

async function handleEnesperaDirecto(data) {
  console.log('handleEnesperaDirecto ejecutada con:', data); // Para debug
  cargando.value = true;
  try {
    const resultado = await useSolicitud.putEnesperaSolicitud(data.consecutivo);  
    
    console.log('resultado enespera:', resultado);
    
    await cargarDatos();
    await actualizarEstadisticas();
    
  } catch (error) {
    console.error('Error al poner en espera la solicitud:', error);
  } finally {
    cargando.value = false;
  }
}

function handleIrAPrevuelo(consecutivo) {
  abrirFormulario({
    accion: 'crear',
    tipo: 'prevuelos',  
    datos: {
      consecutivo: consecutivo,
      solicitudId: consecutivo, 
      tipoRegistro: 'prevuelos'  
    }
  });
}

function handleIrAPostvuelo(consecutivo) {
  abrirFormulario({
    accion: 'crear',
    tipo: 'postvuelos',  
    datos: {
      consecutivo: consecutivo,
      prevueloId: consecutivo, 
      tipoRegistro: 'postvuelos'  
    }
  });
}

defineOptions({
  name: 'HomePage'
})

</script>
