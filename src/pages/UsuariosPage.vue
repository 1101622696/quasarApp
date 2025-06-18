<template>
  <q-page class="flex flex-center">

    <q-card-section>
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-md-auto">
          <q-btn-group spread>
            <q-btn 
              v-for="(config, tipo) in filtrosConfig" 
              :key="tipo"
              :label="tipo === 'todos' ? 'Todos' : `Por ${config.titulo.split(' ').pop()}`"
              :icon="config.icono"
              :color="config.color"
              @click="cargarListaPor(tipo)"
              :outline="tipoLista !== tipo"
            />
          </q-btn-group>
        </div>
          
        <div class="col-12 col-md-auto" v-if="tipoLista !== 'todos' && !filtroActual.esFiltroTexto">
          <q-btn-toggle
            v-model="ordenActual"
            toggle-color="primary"
            :options="opcionesOrdenamiento"
            @update:model-value="cargarUsuarios"
          />
        </div>
        
        <div class="col-12 col-md-auto" v-if="filtroActual.esFiltroTexto">
          <q-select
            v-model="valorFiltroTexto"
            :options="opcionesFiltroTexto"
            option-value="valor"
            option-label="etiqueta"
            dense
            outlined
            emit-value
            map-options
            @update:model-value="actualizarValorFiltro"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon :name="filtroActual.icono" :color="filtroActual.color" /> 
        {{ filtroActual.titulo }}
        <span v-if="filtroActual.esFiltroTexto && valorFiltroTexto">
          - {{ obtenerEtiquetaFiltroTexto(valorFiltroTexto) }}
        </span>
      </div>

      <q-list bordered separator>
        <q-item 
          v-for="usuario in usuarios" 
          :key="usuario.email"
          clickable
          @click="verDetalles(usuario.email)"
        >
          <q-item-section>
            <q-item-label>{{ usuario.nombre }} - {{ usuario.email }}</q-item-label>
            <q-item-label caption v-if="usuario.valorFiltro !== undefined">
              {{ obtenerEtiquetaValor(usuario.valorFiltro) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <div>
<q-dialog v-model="mostrarDetalles" persistent>
  <q-card style="min-width: 350px">
    <q-card-section>
      <div class="text-h6">Detalles del Usuario</div>
    </q-card-section>

    <q-card-section class="q-pt-none" v-if="detallesUsuario">
      <div class="q-pa-md">
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">Nombre:</div>
          <div class="col-8">{{ detallesUsuario.nombre }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">Pefil:</div>
          <div class="col-8">{{ detallesUsuario.perfil }}</div>
        </div>
          <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">Email:</div>
          <div class="col-8">{{ detallesUsuario.email }}</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-weight-bold">Estado:</div>
          <div class="col-8">{{ detallesUsuario.estado }}</div>
        </div>
    
      </div>

        <div class="row q-mb-md">
            <div class="col-4 text-weight-bold">Activación:</div>
            <div class="col-8">
              <q-toggle
                v-model="isActive"
                :color="detallesUsuario.estado === 'Activo' ? 'grey' : 'primary'"
                @update:model-value="cambiarEstado"
              />
            </div>
        </div>
        <q-card-actions align="right">
           <q-btn class="option-button" @click="editar(detallesUsuario)">
              ✏️
            </q-btn>        
            <q-btn color="secondary" icon="download" label="Descargar PDF" @click="descargarPDF" />
      </q-card-actions>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cerrar" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>


      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #ffffff; margin-bottom: 20px"
          >
            <div class="text-h6 text-black">
              {{ accion == 1 ? "Agregar Usuario" : "Editar Usuario" }}
            </div>
          </q-card-section>
    
  <div class="q-pa-md">
    <div class="q-gutter-md row">

      <q-input filled v-model.trim="nombre" label="Nombre" :dense="dense" /> 

    <q-select
      filled
      v-model="perfil"
      label="Perfil:"
      :options="perfilOptions"
      style="width: 300px"
      class="q-mb-md"
    />

      <q-input filled v-model.trim="password" label="Ingrese Contraseña" :dense="dense" />
      <q-input filled v-model.trim="email" label="Correo electrónico" :dense="dense" />
     
    </div>
  </div>

          <q-card-actions align="right">
            <q-btn
             @click="guardar()"
              v-if="accion === 1"
              color="red"
              class="text-white"
              :loading="useUsuario.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
              <q-btn
              @click="editarUsuario()"
              v-else
              color="red"
              class="text-white"
              :loading="useUsuario.loading"
              >Actualizar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      </div>

<q-btn
  color="primary"
  :label="'Registrar Usuario'"
  class="q-mt-md"
  @click="abrir" 
/>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useStoreUsuarios } from "../stores/usuarios";
import { useQuasar } from 'quasar'
import { TIPOS_FILTRO, CONFIG_FILTROS } from '../composables/filtrosU';
import { jsPDF } from 'jspdf'

const useUsuario = useStoreUsuarios();
const alert = ref(false)
const accion = ref(1)
const $q = useQuasar()

// Propósito y sus opciones
const nombre = ref("")
const email = ref("")
const password = ref("")
const perfil = ref("")

const tipoLista = ref(TIPOS_FILTRO.TODOS);
const ordenActual = ref('desc');
const usuarios = ref([]);
const valorFiltroTexto = ref(null);

const informacion=ref("")

const detallesUsuario = ref(null);
const mostrarDetalles = ref(false);


const perfilOptions = [
  'coordinador', 
  'piloto', 
  'jefepiloto', 
  'cliente', 
]

function abrir() {
  accion.value = 1
  alert.value = true
}

function cerrar() {
  alert.value = false
}

async function guardar() {

  if (await validar()) {
    const formData = new FormData();

    formData.append("nombre", nombre.value);
    formData.append("email", email.value);
    formData.append("password", password.value);
    formData.append("perfil", perfil.value);

    try {
      const response = await useUsuario.postUsuario(formData);
      console.log("Respuesta exitosa:", response);
      
      mostrarMensajeExito("usuario agregado correctamente");
      cerrar();
      alert.value = false;

    } catch (error) {
      console.error("Error completo:", error);
      mostrarMensajeError("Error al guardar el usuario");
    }
  }
}

function editar(usuario){
  accion.value = 2
  alert.value = true

informacion.value=usuario

email.value=usuario.email || '';
nombre.value=usuario.nombre || '';
perfil.value=usuario.perfil || '';

      mostrarDetalles.value = false;
}


async function editarUsuario() {
  if (await validar()) {
const formData = new FormData();

    formData.append("nombre", nombre.value);
    formData.append("email", email.value);
    formData.append("password", password.value);
    formData.append("perfil", perfil.value);

    try {
     const response = await useUsuario.putUsuarios(informacion.value.email, formData);
      console.log("Respuesta exitosa:", response);
      
      cerrar();
      alert.value = false;
      resetearFormulario();
  }catch (error) {
      console.error("Error al actualizar el piloto:", error);
    }
}
}

function resetearFormulario() {
  nombre.value = '';
  perfil.value = '';
  password.value = '';
  email.value = '';

  accion.value = 1; 
}

    async function validar() {
    let verificado = true;

    if (nombre.value === "") {
        mostrarMensajeError("Diligencie el nombre");
        verificado = false;
    }
    if (password.value === "") {
        mostrarMensajeError("Diligencie una contraseña");
        verificado = false;
    }
    if (perfil.value === "") {
        mostrarMensajeError("Seleccione el perfil");
        verificado = false;
    }    
    if (email.value === "") {
        mostrarMensajeError("Diligencie el email");
        verificado = false;
    }
    return verificado;
}

function mostrarMensajeError(mensaje) {
    $q.notify({
        type: "negative",
        message: mensaje,
        position: "bottom-right",
    });
}

function mostrarMensajeExito(mensaje) {
    $q.notify({
        type: "positive",
        message: mensaje,
        position: "bottom-right",
    });
}

async function verDetalles(email) {
  try {
    const detalle = await useUsuario.listardatosUsuario(email);
    console.log("Detalles obtenidos:", detalle);
    
    if (detalle) {
      detallesUsuario.value = {
          nombre: detalle['nombre']|| '',
          email: detalle['email']|| '',
          perfil: detalle['perfil']|| '',
          estado: detalle['estado']|| '',
        };
      mostrarDetalles.value = true;
    } else {
      console.error('No se pudieron obtener los detalles');
    }
  } catch (error) {
    console.error('Error al obtener detalles:', error);
  }
}

const filtrosConfig = computed(() => CONFIG_FILTROS);

const filtroActual = computed(() => CONFIG_FILTROS[tipoLista.value]);

const opcionesOrdenamiento = computed(() => {
  if (tipoLista.value === TIPOS_FILTRO.TODOS) return [];
  
  return [
    { label: filtroActual.value.etiquetaDesc, value: 'desc' },
    { label: filtroActual.value.etiquetaAsc, value: 'asc' }
  ];
});

watch(tipoLista, (newValue) => {
  const filtro = CONFIG_FILTROS[newValue];
  if (filtro.esFiltroTexto && filtro.opcionesFiltro?.length > 0) {
    valorFiltroTexto.value = filtro.opcionesFiltro[0].valor;
  } else {
    valorFiltroTexto.value = null;
  }
});

function cargarListaPor(tipo) {
  tipoLista.value = tipo;
  ordenActual.value = 'desc';
  
  // Obtener el filtro actual basado en el tipo
  const filtro = CONFIG_FILTROS[tipo];
  
  // Asegurarnos de que hay un valor por defecto válido
  if (filtro.esFiltroTexto && filtro.opcionesFiltro?.length > 0) {
    // Usar el primer valor como valor por defecto
    valorFiltroTexto.value = filtro.opcionesFiltro[0].valor;
    // console.log(`Tipo cambiado a ${tipo}, valor por defecto: ${valorFiltroTexto.value}`);
  } else {
    valorFiltroTexto.value = null;
    // console.log(`Tipo cambiado a ${tipo}, sin valor por defecto`);
  }
  
  cargarUsuarios();
}

function actualizarValorFiltro(nuevoValor) {
  // console.log(`Cambiando valor del filtro a: ${nuevoValor}`);
  valorFiltroTexto.value = nuevoValor;
  cargarUsuarios();
}

function obtenerEtiquetaValor(valor) {
  // Implementa la lógica para formatear el valor según el tipo de filtro
  if (tipoLista.value === TIPOS_FILTRO.PERFIL) {
    return `${valor}`;
  } else if (tipoLista.value === TIPOS_FILTRO.ESTADO) {
    return `${valor}`;
  }
  return valor;
}

function obtenerEtiquetaFiltroTexto(valor) {
  if (filtroActual.value.esFiltroTexto && filtroActual.value.opcionesFiltro) {
    const opcion = filtroActual.value.opcionesFiltro.find(opt => opt.valor === valor);
    return opcion ? opcion.etiqueta : valor;
  }
  return valor;
}

const opcionesFiltroTexto = computed(() => {
  if (tipoLista.value && filtroActual.value && filtroActual.value.esFiltroTexto) {
    return filtroActual.value.opcionesFiltro || [];
  }
  return [];
});

async function cargarUsuarios() {
  try {
    let response;
    
    if (tipoLista.value === TIPOS_FILTRO.TODOS) {
      response = await useUsuario.listarUsuario();
    } else if (filtroActual.value.esFiltroTexto) {
      // console.log(`Filtrando por: ${tipoLista.value}, valor: ${valorFiltroTexto.value}`);
      
      let tipoBackend = tipoLista.value;
      
      response = await useUsuario.listarUsuariosFiltrados(
        tipoBackend, 
        valorFiltroTexto.value
      );
    }
    if (Array.isArray(response)) {
      usuarios.value = response.map(item => {
        const result = {
          nombre: item['nombre'] || '',
          email: item['email'] || '',
        };
        
        const campoDatos = filtroActual.value?.campoDatos;
        if (campoDatos && item[campoDatos] !== undefined) {
          result.valorFiltro = item[campoDatos];
        }
        
        return result;
      });
    } else {
      console.error('Error en formato de respuesta:', response);
      usuarios.value = [];
    }
  } catch (error) {
    console.error(`Error al cargar usuarios por ${tipoLista.value}:`, error);
    usuarios.value = [];
  }
}

onMounted(() => {
  cargarUsuarios();
});


const isActive = computed({
  get: () => detallesUsuario.value && detallesUsuario.value.estado === 'Activo',
  set: () => {} 
})
const cambiarEstado = async () => {
  try {
    if (detallesUsuario.value.estado === 'Activo') {
      await useUsuario.putInactivarUsuario(detallesUsuario.value.email)
      detallesUsuario.value.estado = 'Inactivo'
    } else {
      await useUsuario.putActivarUsuario(detallesUsuario.value.email)
      detallesUsuario.value.estado = 'Activo'
    }
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error)
  }
}

const descargarPDF = () => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text('Detalles del usuario', 105, 15, { align: 'center' })
  
  doc.setFontSize(12)
  let y = 30
  Object.entries(detallesUsuario.value).forEach(([key, value]) => {
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
    doc.text(`${formattedKey}: ${value}`, 20, y)
    y += 10
  })
  
  doc.save(`usuario_${detallesUsuario.value.email}.pdf`)
}

defineOptions({
  name: 'UsuariosPage'
})

</script>
