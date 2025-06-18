<template>
  <q-page class="flex flex-center">

<div class="tituloTabla">
          Bitácora
        </div>


    <q-table class="table" flat bordered :rows="rows" :columns="columns" row-key="consecutivo">
      <template v-slot:body-cell-dronusado="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ props.row.dronusado }}</p>
        </q-td>
      </template>
<template v-slot:body-cell-fechaInicio="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
    <p>{{ props.row.fechaInicio }}</p>
  </q-td>
</template>
            <template v-slot:body-cell-distanciaRecorrida="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
          <p>{{ props.row.distanciaRecorrida }}</p>
        </q-td>
      </template>

    <template v-slot:body-cell-observacionesVuelo="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
        <span class="truncated-text">
          {{ props.row.observacionesVuelo }}
        </span>
      </q-td>
    </template>
    
        <template v-slot:body-cell-empresa="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
        <span class="truncated-text">
          {{ props.row.empresa }}
        </span>
      </q-td>
    </template>

        <template v-slot:body-cell-Link="props">
        <q-td :props="props" style="text-align: center; border-left:none; border-left:none; border-right:none; border-top:none">
        <span class="truncated-text">
          {{ props.row.Link }}
        </span>
      </q-td>
    </template>

    </q-table>


  </q-page>
</template>


<script setup>
import { useStorePostvuelos } from '../stores/postvuelos.js'
import {ref, onMounted} from 'vue'

const usePostvuelo = useStorePostvuelos()
const userOptions = ref([])

let rows = ref([]);
let columns = ref([
  {name:"consecutivo", label:"Consecutivo", field:"consecutivo", align:"center"},
  {name:"dronusado", label:"Dron", field:"dronusado", align:"center"},
  {name:"piloto", label:"Piloto", field:"piloto", align:"center"},
  { name: "fechaInicio", sortable: true, label: "fecha", field: "fechaInicio", align: "center" },
  { name: "distanciaRecorrida", label: "distancia Recorrida", field: "distanciaRecorrida", align: "center" },
  { name: "observacionesVuelo", label: "observaciones", field: "observacionesVuelo", align: "center" },
  { name: "empresa", label: "Empresa", field: "empresa", align: "center" },
  { name: "Link", label: "Archivos", field: "Link", align: "center" },
]);

async function listartablaPostvuelos() {
  try {
    const postvuelos = await usePostvuelo.listarPostvuelos();
    
    rows.value = postvuelos.map(item => {
      return {
        dronusado: item['dron-usado'],
        piloto: item['piloto-postvuelo'],
        fechaInicio: item['id- fecha'],
        consecutivo: item['consecutivo-solicitud'],
        distanciaRecorrida: item['distancia recorrida'] || '', 
        observacionesVuelo: item['observaciones'] || '', 
        empresa: item['empresa'] || '',
        Link: item['link'] || '',
      };
    });
    
    userOptions.value = postvuelos.map((s) => ({
      label: s.empresa || '',
      value: s['consecutivo-solicitud'] || '',
    }));
  } catch (error) {
    console.error(error);
    rows.value = [];
  }
}


onMounted(() => {
  listartablaPostvuelos();
});

defineOptions({
  name: 'BitacoraPage'
})

</script>
