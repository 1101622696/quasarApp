<template>
  <q-page class="flex flex-center">

  <div>
    GPS position: <strong>{{ position }}</strong>
  </div>

  </q-page>
</template>

<script setup>

import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Geolocation } from '@capacitor/geolocation'
// import { useQuasar } from 'quasar'
 const position = ref('determining...')

    function getCurrentPosition() {
      Geolocation.getCurrentPosition().then(newPosition => {
        console.log('Current', newPosition)
        position.value = newPosition
      })
    }

    let geoId

    onMounted(() => {
      getCurrentPosition()

      // we start listening
      geoId = Geolocation.watchPosition({}, (newPosition, err) => {
        console.log('New GPS position')
        console.log(err)
        position.value = newPosition
      })
    })

    onBeforeUnmount(() => {
      // we do cleanup
      Geolocation.clearWatch(geoId)
    })

defineOptions({
  name: 'gpsPage'
})

</script>
