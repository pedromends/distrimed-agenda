<template lang="">
  <q-page>
    <FullCalendar v-if="events.length > 0" :pageTitle="'Sala 2'" :eventsProp="events" />
  </q-page>
</template>
<script>
import FullCalendar from 'components/FullCalendar.vue'
import listMeetings from '../services/MeetingsService.js'

export default {
  name: 'RoomOne',
  mounted() {
    listMeetings('Sala 2').then((response) => {
      this.events = Array.isArray(response.data) ? response.data : [];
    }).catch(error => {
      console.error("Erro ao buscar reuniões:", error);
      this.events = []; // Caso erro, defini um array vazio
    });
  },
  components: {
    FullCalendar,
  },
  data() {
    return {
      events: [],
    }
  },
  watch: {
    events(newEvents) {
      if (newEvents.length > 0) {
        console.log('Eventos prontos para serem passados para o FullCalendar');
      }
    }
  }
}
</script>
