<template>
  <q-page padding>
<span class="text-h3">Postvuelos</span>
    
    <q-list bordered padding>
      <q-item
        v-for="postvuelo in postvueloes"
        :key="postvuelo.empresa_post"
        clickable
        @click="verDetalles(postvuelo)"
      >
        <q-item-section>
          <q-item-label>{{ postvuelo.empresa_post }}</q-item-label>
          <q-item-label caption>Consecutivo: {{ postvuelo["consecutivo-solicitud"] }}</q-item-label>
        </q-item-section>
        
        <q-item-section side>
          <AccionesRegistro 
            :registro="postvuelo" 
            tipoRegistro="postvuelos"
            @editar="editarPostvuelo"
            @aprobar="aprobarPostvuelo"
          />
        </q-item-section>
      </q-item>
    </q-list>
    
    <q-btn color="primary" label="Crear Postvuelo" @click="mostrarFormulario = true" />
    
    <q-dialog v-model="mostrarDetalles">
      <VistaDetalle 
        :registro="postvueloSeleccionado" 
        tipoRegistro="postvuelos"
        @editar="editarPostvuelo"
        @aprobar="aprobarPostvuelo"
      />
    </q-dialog>
    
    <q-dialog v-model="mostrarFormulario">
      <q-card style="width: 700px">
        <q-card-section>
          <div class="text-h6">{{ esEdicion ? 'Editar' : 'Crear' }} Postvuelo</div>
        </q-card-section>
        
        <PostvueloForm 
          :datos="datosPostvuelo" 
          :esEdicion="esEdicion"
          @guardar="guardarCompletado"
          @cancelar="mostrarFormulario = false"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStoreUsuarios } from '../stores/usuarios'
import { useStorePostvuelos } from '../stores/postvuelos';
import AccionesRegistro from '../components/AccionesRegistro.vue';
import VistaDetalle from '../components/VistaDetalle.vue';
import PostvueloForm from '../components/PostvueloForm.vue';

const usePostvuelo = useStorePostvuelos();
const useUsuario = useStoreUsuarios()

const postvuelos = ref([]);
const postvueloSeleccionado = ref(null);
const mostrarDetalles = ref(false);
const mostrarFormulario = ref(false);
const esEdicion = ref(false);
const datosPostvuelo = ref({});

onMounted(async () => {
  await cargarPostvuelos();
});

async function cargarPostvuelos() {
  const email = useUsuario.correo || localStorage.getItem('email')

  postvuelos.value = await usePostvuelo.listarPostvuelosEmail(email);
}

function verDetalles(postvuelo) {
  postvueloSeleccionado.value = postvuelo;
  mostrarDetalles.value = true;
}

function editarPostvuelo(postvuelo) {
  esEdicion.value = true;
  datosPostvuelo.value = postvuelo;
  mostrarFormulario.value = true;
}

async function aprobarPostvuelo(id) {
  await usePostvuelo.putAprobarPostvuelo(id);
  await cargarPostvuelos();
}

async function guardarCompletado() {
  mostrarFormulario.value = false;
  await cargarPostvuelos();
}

</script>