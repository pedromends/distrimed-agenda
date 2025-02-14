<template>
    <div class="relative">

        <div class="q-pa-md">
            <div class="flex justify-between">
                <h5>{{ pageTitle }}</h5>
                <div class="flex">
                    <q-spinner class="absolute" v-if="loading" style="right: 0%;" color="primary" size="3em"
                        :thickness="10" />
                    <q-btn label="Salvar alterações" color="primary" @click="finishChanges" />
                </div>
            </div>
            <FullCalendar :options="calendarOptions" class="q-mt-md" />
            <q-dialog v-model="createDialog">
                <q-card style="width: 700px">
                    <q-card-section>
                        <div class="text-h6">Selecione um horário</div>
                    </q-card-section>
                    <q-separator />
                    <div>
                        <q-input filled v-model="eventTitle" label="Nome do evento" lazy-rules
                            :rules="[(val) => (val && val.length > 0) || 'Por favor digite algo']" />
                        <div class="flex justify-center">
                            <q-time v-model="startHour" mask="HH:mm" label="Hora de Início" color="blue"
                                class="q-mr-md q-ml-md" />
                            <q-time v-model="endHour" mask="HH:mm" label="Hora de Término" color="blue"
                                class="q-mr-md q-ml-md" />
                        </div>
                    </div>
                    <q-card-actions align="around">
                        <q-btn color="primary" @click="saveNewEvent">Marcar</q-btn>
                        <q-btn color="red" v-close-popup>Cancelar</q-btn>
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <q-dialog v-model="editDialog">
                <q-card>
                    <q-card-section>
                        <div class="text-h6">Editar Evento</div>
                    </q-card-section>

                    <q-card-section>
                        <q-input v-model="eventTitle" label="Título do Evento" />
                        <q-input v-model="eventDate" label="Data do Evento" type="date" filled />
                        <q-time v-model="startHour" mask="HH:mm" label="Hora de Início" color="blue" />
                        <q-time v-model="endHour" mask="HH:mm" label="Hora de Término" color="blue" />
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn flat label="Cancelar" v-close-popup />
                        <q-btn flat label="Excluir" color="negative" @click="deleteEvent" />
                        <q-btn flat label="Salvar" color="primary" @click="saveEvent" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </div>
</template>

<script>
    import FullCalendar from '@fullcalendar/vue3'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import interactionPlugin from '@fullcalendar/interaction'
    import ptLocale from '@fullcalendar/core/locales/pt'
    import { useCounterStore } from '../stores/example-store.js'
    import { saveAllData, getByEmail } from '../services/MeetingsService.js'
    import { nextTick } from 'vue';

    export default {
        name: 'FullCalendarComponent',
        props: {
            pageTitle: String,
            eventsProp: Array,
        },
        components: { FullCalendar },
        data() {
            return {
                createDialog: false,
                editDialog: false,
                eventTitle: '',
                startHour: null,
                endHour: null,
                auxDate: null,
                selectedEvent: '',
                loading: false,
                calendarOptions: {
                    plugins: [dayGridPlugin, interactionPlugin],
                    locales: [ptLocale],
                    initialView: 'dayGridMonth',
                    editable: true,
                    selectable: true,
                    weekends: true,
                    dateClick: this.handleDateClick,
                    eventClick: this.handleEventClick,
                    eventDrop: this.handleEventDrop,
                    dayMaxEvents: false,
                    dayMaxEventRows: 3,
                    moreLinkClick: 'popover',
                    events: [...this.eventsProp],
                }
            }
        },
        methods: {
            finishChanges() {
                nextTick(() => {
                    this.loading = true
                });
                saveAllData(this.calendarOptions.events).then((response) => {
                    console.log(response)
                    this.loading = false
                    alert('salvo com sucesso')
                }).catch(error => {
                    console.error("Erro ao buscar reuniões:", error);
                });

            },
            handleDateClick(info) {
                const today = new Date();
                this.selectedDate = new Date(info.dateStr);
                this.selectedDate.setDate(this.selectedDate.getDate() + 1);

                if (this.selectedDate < today.setHours(0, 0, 0, 0)) {
                    alert('Não é possível agendar eventos em datas passadas.');
                } else {
                    this.eventTitle = '';
                    this.eventDate = info.dateStr;
                    this.startHour = '';
                    this.endHour = '';
                    this.selectedEvent = null;
                    this.createDialog = true;
                }
            },
            handleEventClick(info) {
                this.selectedEvent = info.event;
                this.eventTitle = this.selectedEvent.title;
                this.eventDate = new Date(this.selectedEvent.start).toISOString().split('T')[0];
                this.startHour = new Date(this.selectedEvent.start).toTimeString().slice(0, 5);
                this.endHour = this.selectedEvent.end
                    ? new Date(this.selectedEvent.end).toTimeString().slice(0, 5)
                    : this.startHour;

                this.editDialog = true;
            },
            handleEventDrop(info) {
                const movedEvent = info.event;
                const newStart = new Date(movedEvent.start);
                const newEnd = movedEvent.end ? new Date(movedEvent.end) : new Date(newStart.getTime() + 60 * 60 * 1000);
                const hasConflict = this.eventsProp
                    .filter(event => event.id !== movedEvent.id)
                    .some(event => {
                        const eventStart = new Date(event.start);
                        const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 60 * 60 * 1000);
                        return newStart < eventEnd && newEnd > eventStart;
                    });

                if (hasConflict) {
                    alert('A sala já está reservada neste horário.');
                    info.revert();
                    return;
                }

                movedEvent.setStart(newStart);
                movedEvent.setEnd(newEnd);
            },
            saveNewEvent() {
                if (!this.eventTitle) {
                    alert('Por favor, preencha o nome do evento.');
                    return;
                }
                if (!this.selectedDate) {
                    alert('Erro: Data do evento não definida.');
                    return;
                }

                const [startH, startM] = this.startHour ? this.startHour.split(':').map(Number) : [];
                const [endH, endM] = this.endHour ? this.endHour.split(':').map(Number) : [];

                if (startH === undefined || endH === undefined) {
                    alert('Erro: Horário inválido.');
                    return;
                }

                const newEventStart = new Date(this.selectedDate);
                newEventStart.setHours(startH, startM);

                const newEventEnd = new Date(this.selectedDate);
                newEventEnd.setHours(endH, endM);

                if (newEventEnd <= newEventStart) {
                    alert('A hora de término deve ser posterior à hora de início.');
                    return;
                }

                // Verifica se há conflitos de horários
                const hasConflict = this.calendarOptions.events.some(event => {
                    const eventStart = new Date(event.start);
                    const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 60 * 60 * 1000);
                    return newEventStart < eventEnd && newEventEnd > eventStart;
                });

                if (hasConflict) {
                    alert('A sala já está reservada neste horário.');
                    return;
                }

                const store = useCounterStore();

                getByEmail(store.userId).then((response) => {
                    let userId = response.data;

                    let newEvent = {
                        id: String(Date.now()),
                        title: this.eventTitle,
                        user_id: userId[0].id,
                        email: store.userId,
                        start: newEventStart,
                        end: newEventEnd,
                        room: this.pageTitle,
                    };

                    console.log(newEvent);
                    this.calendarOptions.events.push(newEvent);
                    this.createDialog = false;
                }).catch(error => {
                    console.error("Erro ao buscar reuniões:", error);
                });
            },

            saveEvent() {
                if (this.eventTitle && this.eventDate && this.startHour && this.endHour) {
                    const newStartDate = new Date(this.eventDate + 'T' + this.startHour)
                    const newEndDate = new Date(this.eventDate + 'T' + this.endHour)

                    if (newEndDate <= newStartDate) {
                        alert('A hora de término deve ser posterior à hora de início.')
                        return
                    }

                    const updatedEvent = { ...this.selectedEvent }
                    updatedEvent.title = this.eventTitle
                    updatedEvent.start = newStartDate
                    updatedEvent.end = newEndDate

                    const eventIndex = this.calendarOptions.events.findIndex(event => event.id === this.selectedEvent.id)
                    if (eventIndex !== -1) {
                        this.calendarOptions.events[eventIndex] = updatedEvent
                    }
                    this.editDialog = false
                } else {
                    alert('Por favor, preencha todos os campos.')
                }
            },
            deleteEvent() {
                console.log(this.selectedEvent)
                const store = useCounterStore();
                if (!this.selectedEvent) return;

                if (this.selectedEvent._def.extendedProps.email !== store.userId) {
                    alert('Você não tem permissão para excluir este evento.');
                    return;
                }

                this.calendarOptions.events = this.calendarOptions.events.filter(
                    event => event.id !== this.selectedEvent.id
                );

                this.editDialog = false;
            },
            getUserByEmail() {

            }
        }
    }
</script>

<style scoped>
    .q-pa-md {
        max-width: 800px;
        margin: auto;
    }

    @media (min-width: 600px) {
        .q-dialog__inner--minimized>div {
            max-width: 700px;
        }
    }
</style>
