<template>
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-md row">

      <q-input
        v-if="!esEdicion"
        v-model="formulario.consecutivo"
        label="Consecutivo de Solicitud aprobada*"
        readonly
      />

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item1"
                  label="1. Espacio Aéreo (Sin restricción o vuelo autorizado):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  (Sin restricción o vuelo autorizado)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item2"
                  label="2. Espacio Aéreo (Identificar obstrucciones cerca del patrón de vuelo):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  (Identificar obstrucciones cerca del patrón de vuelo)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item3"
                  label="3. Meteorología (Visibilidad ≥ 3 millas, Viento ≤ 38km/h, Sin lluvia):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  (Visibilidad ≥ 3 millas, Viento ≤ 38km/h, Sin lluvia)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item4"
                  label="4. Estructura/Hélices UAS (Sin defectos estructurales visibles):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  (Sin defectos estructurales visibles):
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item5"
                  label="5. Batería/s UAS (Suficientes para el vuelo, ≥ 80%):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  (Suficientes para el vuelo, ≥ 80%)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item6"
                  label="6. Batería del dispositivo de pantalla (≥ 80%):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Batería del dispositivo de pantalla (≥ 80%)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item7"
                  label="7. Tarjetas de Memoria (Instaladas, suficiente espacio):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  (Instaladas, suficiente espacio):
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item8"
                  label="8. Observador (Presente, briefing completo):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  (Presente, briefing completo):
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item9"
                  label="9. Bloqueo del Gimbal de la cámara (Removido):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Bloqueo del Gimbal de la cámara (Removido):
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item10"
                  label="10. Dispositivo de Pantalla (Encendido):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Dispositivo de Pantalla (Encendido)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item11"
                  label="11. Control Remoto (Encendido):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle"> (Encendido): </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item12"
                  label="12. UAS (Encendido):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle"> (Encendido): </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item13"
                  label="13. Luces de estado del UAS (Flashing VERDE):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Luces de estado del UAS (Flashing VERDE)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item14"
                  label="14. Chequeo de Cámara (Vista normal de cámara FPV):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Chequeo de Cámara (Vista normal de cámara FPV)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item15"
                  label="15. Calibración Rumbo/Compass (Compass calibrado para la ubicación actual)"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Calibración Rumbo/Compass (Compass calibrado para la ubicación actual)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item16"
                  label="16. Límites de vuelo programados (Altitud. <=120 metros, Distancia. <=500/750):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Límites de vuelo programados (Altitud. 120 metros, Distancia. 500/750)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item17"
                  label="17. Flight Mode Set to GPS (Modo del control en “P”,estatus en pantalla VERDE-RTF)"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Flight Mode Set to GPS (Modo del control en “P”,estatus en pantalla VERDE-RTF)"
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item18"
                  label="18. Ubicación de despegue (Libre de obstáculos >=8 metros de radio):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Ubicación de despegue (Libre de obstáculos >=8 metros de radio):
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item19"
                  label="Inicio de motores de la UA (Los motores deben iniciar en mínimas RPM’s sin sonidos anormales):"
                  :options="itemOptions"
                  style="width: 300px"
                  class="q-mb-md"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Inicio de motores de la UA (Los motores deben iniciar en mínimas RPM’s sin sonidos
                  anormales):"
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item20"
                  label="Home Point (Establecer el Home Point):"
                  :options="itemOptions"
                  style="width: 300px"
                  class="q-mb-md"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  (Establecer el Home Point):
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item21"
                  label="Control de Desplazamiento (Controles de vuelo y del Gimbal con respuesta normal):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Control de Desplazamiento (Controles de vuelo y del Gimbal con respuesta normal)
                </q-tooltip>
              </div>

              <div style="width: 300px" class="q-mb-md">
                <q-select
                  filled
                  v-model="formulario.item22"
                  label="Telemetría de vuelo (Telemetría normal (Bat, Alt, Dist., etc.)):"
                  :options="itemOptions"
                />
                <q-tooltip anchor="bottom middle" self="top middle">
                  Telemetría de vuelo (Telemetría normal (Bat, Alt, Dist., etc.))
                </q-tooltip>
              </div>

              <q-input filled v-model="formulario.notas" label="notas:" />
            </div>
          </div>
    
    <q-card-actions align="right">
      <q-btn
        @click="guardar"
        color="red"
        class="text-white"
        :loading="usePrevuelo.loading"
      >
        {{ esEdicion ? 'Actualizar' : 'Agregar' }}
                  <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
      </q-btn>
      <q-btn label="Cerrar" color="black" outline @click="$emit('cancelar')" />
    </q-card-actions>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useStorePrevuelos } from '../stores/prevuelos'

const props = defineProps({
  esEdicion: {
    type: Boolean,
    default: false
  },
  datos: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['guardar', 'cancelar']);
const usePrevuelo = useStorePrevuelos()
const cargando = ref(false);
const formulario = ref({
consecutivo: '', 
item1: '',
item2: '',
item3: '',
item4: '',
item5: '',
item6: '',
item7: '',
item8: '',
item9: '',
item10: '',
item11: '',
item12: '',
item13: '',
item14: '',
item15: '',
item16: '',
item17: '',
item18: '',
item19: '',
item20: '',
item21: '',
item22: '',
notas: ''
});

const itemOptions = ['si', 'no']

watch(() => props.datos, (newData) => {
  if (newData && newData.consecutivo) {
    formulario.value.consecutivo = newData.consecutivo;
  }
}, { immediate: true });

onMounted(() => {
  if (props.datos && props.datos.consecutivo) {
    formulario.value.consecutivo = props.datos.consecutivo;
  }
});

onMounted(() => {
  console.log('PrevueloForm mounted with props:', {
    esEdicion: props.esEdicion,
    datos: props.datos
  });
  
  if (props.esEdicion && props.datos) {
    console.log('Raw datos for editing:', props.datos);
    console.log('Datos consecutivo exists:', props.datos.solicitudesaprobadas);
    
    if (props.datos.solicitudesaprobadas) {
      console.log('Found consecutivo in datos:', props.datos.solicitudesaprobadas);
    } else {
      console.warn('No consecutivo found in datos for editing!');
      
      if (props.datos.id) {
        console.log('Found id in datos, will use as consecutivo:', props.datos.id);
        formulario.value = {
          ...props.datos,
          solicitudesaprobadas: props.datos.id
        };
      } else {
        console.error('No id or consecutivo found for editing!');
        formulario.value = { ...props.datos };
      }
      return;
    }
    
    formulario.value = { ...props.datos };
  }
});

async function guardar() {
  cargando.value = true;
  try {
    console.log('Form data before saving:', formulario.value);
    console.log('Has consecutivo?', formulario.value.solicitudesaprobadas);
    
    const datosAEnviar = {
      ...formulario.value,
      tipoRegistro: 'prevuelos'
    };
    
    if (props.esEdicion) {
      datosAEnviar.accion = 'editar';
      
      if (!datosAEnviar.solicitudesaprobadas && datosAEnviar.id) {
        console.log('Using id as consecutivo for edit operation:', datosAEnviar.id);
        datosAEnviar.solicitudesaprobadas = datosAEnviar.id;
      }
      
      console.log('Final edit data to send:', datosAEnviar);
    } else {
      console.log('Final create data to send:', datosAEnviar);
    }
    
    emit('guardar', datosAEnviar);
  } catch (error) {
    console.error('Error al guardar:', error);
  } finally {
    cargando.value = false;
  }
}

</script>