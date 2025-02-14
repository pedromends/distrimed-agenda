<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
                <q-toolbar-title> Agenda Distrimed </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" bordered>
            <q-list>
                <div class="flex column justify-between" style="height: 100vh;">
                    <div>
                        <h6 class="q-pl-md">Salas disponíveis:</h6>
                        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
                    </div>
                    <div class="flex justify-center">
                        <q-btn flat dense icon="logout" label="LogOut" aria-label="Sair" @click="logout" />
                    </div>
                </div>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
    import { useRouter } from 'vue-router';
    import { useCounterStore } from '../stores/example-store.js';
    import EssentialLink from 'components/EssentialLink.vue';

    export default {
        name: 'MainLayout',
        components: {
            EssentialLink,
        },
        data() {
            return {
                linksList: [
                    {
                        title: 'Sala 1',
                        caption: 'quasar.dev',
                        icon: 'meeting_room',
                        link: '/room-one',
                    },
                    {
                        title: 'Sala 2',
                        caption: 'github.com/quasarframework',
                        icon: 'meeting_room',
                        link: '/room-two',
                    },
                    {
                        title: 'Sala 3',
                        caption: 'chat.quasar.dev',
                        icon: 'meeting_room',
                        link: '/room-three',
                    },
                ],
                leftDrawerOpen: false,
            };
        },
        methods: {
            toggleLeftDrawer() {
                this.leftDrawerOpen = !this.leftDrawerOpen;
            },
        },
        mounted() {
            const store = useCounterStore();
            const router = useRouter();

            if (!store.isLoggedIn || !store.userId) {
                router.push('/');
            }
        },
        setup() {
            const store = useCounterStore();

            const logout = () => {
                store.logout();
            };

            return {
                logout
            };
        }
    };
</script>

<style>
    .add-btn {
        background-color: blue;
        color: white;
        border-radius: 50px;
        padding-left: 15px;
        padding-right: 15px;
    }
</style>
