<template>
	<div class="relative">
		<div class="q-pa-md">
			<div class="flex justify-between">
				<h5>{{ pageTitle }}</h5>
				<div class="flex">
					<q-spinner class="absolute" v-if="loading" style="right: 0%" color="primary" size="3em"
						:thickness="10" />
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
							<q-time v-model="startHour" mask="HH:mm" label="Hora de Início" color="red"
								class="q-mr-md q-ml-md" />
							<q-time v-model="endHour" mask="HH:mm" label="Hora de Término" color="red"
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
						<q-input v-model="eventDate" label="Data do Evento" type="date" filled class="q-pt-md" />

						<div class="flex justify-center q-pt-md">
							<q-time v-model="startHour" mask="HH:mm" label="Hora de Início" class="q-mr-md q-ml-md"
								color="red" />
							<q-time v-model="endHour" mask="HH:mm" label="Hora de Término" class="q-mr-md q-ml-md"
								color="red" />
						</div>
					</q-card-section>

					<q-card-actions align="right">
						<q-btn flat label="Salvar" color="primary" @click="updateEvent" />
						<q-btn flat label="Excluir" color="negative" @click="deleteEvent" />
						<q-btn flat label="Cancelar" v-close-popup />
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
	import { saveNewMeeting, updateMeeting, deleteMeeting, getByEmail } from '../services/MeetingsService.js'
	import { Notify } from 'quasar'

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
				},
			}
		},
		methods: {
			saveNewEvent() {
				if (!this.eventTitle) {
					Notify.create({
						message: 'Por favor, preencha o nome do evento!',
						color: 'negative',
						icon: 'warning',
					})
					return
				}
				if (!this.selectedDate) {
					Notify.create({
						message: 'Erro: Data do evento não definida!',
						color: 'negative',
						icon: 'warning',
					})
					return
				}

				const [startH, startM] = this.startHour ? this.startHour.split(':').map(Number) : []
				const [endH, endM] = this.endHour ? this.endHour.split(':').map(Number) : []

				if (startH === undefined || endH === undefined) {
					Notify.create({
						message: 'Erro: Horário inválido!',
						color: 'negative',
						icon: 'warning',
					})
					return
				}

				const newEventStart = new Date(this.selectedDate)
				newEventStart.setHours(startH, startM)

				const newEventEnd = new Date(this.selectedDate)
				newEventEnd.setHours(endH, endM)

				if (newEventEnd <= newEventStart) {
					Notify.create({
						message: 'A hora de término deve ser posterior à hora de início!',
						color: 'negative',
						icon: 'warning',
					})
					return
				}

				const hasConflict = this.calendarOptions.events.some((event) => {
					const eventStart = new Date(event.start)
					const eventEnd = event.end
						? new Date(event.end)
						: new Date(eventStart.getTime() + 60 * 60 * 1000)
					return newEventStart < eventEnd && newEventEnd > eventStart
				})

				if (hasConflict) {
					Notify.create({
						message: 'A sala já está reservada neste horário!',
						color: 'negative',
						icon: 'warning',
					})
					return
				}

				const store = useCounterStore()

				getByEmail(store.userId).then((response) => {
					let userId = response.data

					let newEvent = {
						id: String(Date.now()),
						title: this.eventTitle,
						user_id: userId[0].id,
						email: store.userId,
						start: newEventStart,
						end: newEventEnd,
						room: this.pageTitle,
					}

					this.calendarOptions.events.push(newEvent)

					saveNewMeeting(newEvent).then((response) => {
						console.log(response);
						this.loading = false;
						Notify.create({
							message: 'Salvo com sucesso!',
							color: 'success',
							icon: 'check_circle',
						});
					})
						.catch((error) => {
							console.error('Erro ao buscar reuniões:', error);
						});

					this.createDialog = false
				})
					.catch((error) => {
						console.error('Erro ao buscar reuniões:', error)
					})
			},
			updateEvent() {
				const [startH, startM] = this.startHour ? this.startHour.split(':').map(Number) : []
				const [endH, endM] = this.endHour ? this.endHour.split(':').map(Number) : []
				const [d1, m1, y1] = this.eventDate ? this.eventDate.split('-').map(Number) : []
				const [d2, m2, y2] = this.eventDate ? this.eventDate.split('-').map(Number) : []

				if (startH === undefined || endH === undefined) {
					Notify.create({
						message: 'Erro: Horário inválido!',
						color: 'negative',
						icon: 'warning',
					})
					return
				}

				const newEventStart = new Date(d1, m1 - 1, y1)
				const newEventEnd = new Date(d2, m2 - 1, y2)

				newEventStart.setHours(startH, startM)
				newEventEnd.setHours(endH, endM)

				if (newEventEnd <= newEventStart) {
					Notify.create({
						message: 'A hora de término deve ser posterior à hora de início!',
						color: 'negative',
						icon: 'warning',
					})
					return
				}

				const hasConflict = this.calendarOptions.events.some((event) => {
					const eventStart = new Date(event.start + 'Z'); // Força UTC
					const eventEnd = event.end ? new Date(event.end + 'Z') : new Date(eventStart.getTime() + 60 * 60 * 1000);

					return newEventStart < eventEnd && newEventEnd > eventStart
				})

				if (hasConflict) {
					Notify.create({
						message: 'A sala já está reservada neste horário!',
						color: 'negative',
						icon: 'warning',
					})
					return
				}

				this.selectedEvent._def.start = newEventStart
				this.selectedEvent._def.end = newEventEnd


				updateMeeting(this.selectedEvent._def).then((response) => {
					console.log(response);
					this.loading = false;
					Notify.create({
						message: 'Atualizado com sucesso!',
						color: 'success',
						icon: 'check_circle',
					});
					window.location.reload();
				}).catch((error) => {
					console.error('Erro ao buscar reuniões:', error);
				});
			},
			handleEventDrop(info) {

				const movedEvent = info.event

				const newStart = new Date(movedEvent.start + 1)
				const newEnd = movedEvent.end
					? new Date(movedEvent.end)
					: new Date(newStart.getTime() + 60 * 60 * 1000)

				const hasConflict = this.eventsProp
					.filter((event) => event.id !== movedEvent.id)
					.some((event) => {
						const eventStart = new Date(event.start)
						const eventEnd = event.end
							? new Date(event.end)
							: new Date(eventStart.getTime() + 60 * 60 * 1000)

						return newStart < eventEnd && newEnd > eventStart
					})

				if (hasConflict) {
					Notify.create({
						message: 'A sala já está reservada neste horário!',
						color: 'negative',
						icon: 'warning',
					})
					info.revert()
					return
				}

				movedEvent.setStart(newStart)
				movedEvent.setEnd(newEnd)
				movedEvent._def.start = movedEvent.start
				movedEvent._def.end = movedEvent.end

				updateMeeting(movedEvent._def).then((response) => {
					console.log(response.status);
					Notify.create({
						message: 'Atualizado com sucesso!',
						color: 'success',
						icon: 'check_circle',
					});
				}).catch((error) => {
						console.error(error);
						Notify.create({
							message: 'Erro ao atualizar reunião!',
							color: 'negative',
							icon: 'check_circle',
						});
					});
			},
			deleteEvent() {
				const store = useCounterStore()
				if (!this.selectedEvent) return

				if (this.selectedEvent._def.extendedProps.email !== store.userId) {
					Notify.create({
						message: 'Você não tem permissão para excluir este evento!',
						color: 'negative',
						icon: 'warning',
					})
					return
				}

				deleteMeeting(this.selectedEvent._def.publicId).then((response) => {
					console.log(response);
					this.loading = false;

					Notify.create({
						message: 'Deletado com sucesso!',
						color: 'success',
						icon: 'check_circle',
					});
					setInterval(window.location.reload(), 3000)
				}).catch((error) => {
					console.error('Erro ao deletar reunião:', error);
				});

				this.editDialog = false
			},
			handleDateClick(info) {
				const today = new Date()
				this.selectedDate = new Date(info.dateStr)
				this.selectedDate.setDate(this.selectedDate.getDate() + 1)
				if (this.selectedDate < today.setHours(0, 0, 0, 0)) {
					Notify.create({
						message: 'Não é possível agendar eventos em datas passadas!',
						color: 'negative',
						icon: 'warning',
					})
				} else {
					this.eventTitle = ''
					this.eventDate = info.dateStr
					this.startHour = ''
					this.endHour = ''
					this.selectedEvent = null
					this.createDialog = true
				}
			},

			handleEventClick(info) {
				this.selectedEvent = info.event
				this.eventTitle = this.selectedEvent.title
				this.eventDate = new Date(this.selectedEvent.start).toISOString().split('T')[0]
				this.startHour = new Date(this.selectedEvent.start).toTimeString().slice(0, 5)
				this.endHour = this.selectedEvent.end
					? new Date(this.selectedEvent.end).toTimeString().slice(0, 5)
					: this.startHour

				this.editDialog = true
			},
		},
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
