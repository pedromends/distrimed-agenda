<template>
    <div class="flex flex-center login-container" style="padding-top: 8rem;">
        <q-card class="auth-card">
            <q-card-section>
                <div class="text-h5 text-center">{{ isLogin ? 'Login' : 'Cadastro' }}</div>
            </q-card-section>

            <q-card-section>
                <q-form class="q-gutter-md">
                    <q-input v-if="!isLogin" v-model="name" label="Nome Completo" outlined dense lazy-rules
                        :rules="[val => !!val || 'O nome é obrigatório']" />

                    <q-input v-model="email" label="E-mail" type="email" outlined dense lazy-rules :rules="[
                        val => !!val || 'O e-mail é obrigatório',
                        val => /.+@.+\..+/.test(val) || 'E-mail inválido'
                    ]" />
                    <q-input v-model="password" :type="isPwd ? 'password' : 'text'" label="Senha" outlined dense
                        lazy-rules :rules="[val => val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres']">
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="isPwd = !isPwd" />
                        </template>
                    </q-input>

                    <q-btn type="submit" color="primary" :label="isLogin ? 'Entrar' : 'Cadastrar'" class="full-width"
                        @click="isLogin ? authenticate() : createNewUser()" :loading="loading" />

                    <div class="text-center q-mt-md">
                        <q-btn flat color="grey-8" @click="isLogin = !isLogin"
                            :label="isLogin ? 'Criar uma conta' : 'Já tem uma conta? Faça login'" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
    import { authUser, createUser } from '../services/UserService.js'
    import { useCounterStore } from '../stores/example-store.js'

    export default {
        beforeMount() {
            const store = useCounterStore();
            if (store.isLoggedIn || store.userId) {
                this.$router.push('/dashboard');
            }
        },
        data() {
            return {
                isLogin: true,
                isPwd: true,
                loading: false,
                name: "",
                email: "",
                password: ""
            };
        },
        methods: {
            async authenticate() {
                try {
                    const response = await authUser({ email: this.email, password: this.password });

                    if (response && response.status === 200) {
                        console.log(response);

                        const userId = response.data.user.email; // Assumindo que o backend retorna um 'id'
                        const store = useCounterStore();

                        store.login(userId);
                        alert('Login realizado com sucesso!');

                        this.$router.push('/dashboard');
                    }
                } catch (error) {
                    console.error("Erro ao logar:", error);
                    alert('Erro ao logar');
                }
            },
            async createNewUser() {
                try {
                    const response = await createUser({ name: this.name, email: this.email, password: this.password });

                    if (response.status === 200) {
                        alert('Usuário cadastrado com sucesso');
                        window.location.reload();
                    }
                } catch (error) {
                    console.error("Erro ao criar usuário:", error);
                    alert('Erro ao criar usuário');
                    window.location.reload();
                }
            }
        },
        setup() {
            const store = useCounterStore();
            store.initializeState(); // Restaura o estado quando o componente for montado

            return {
                store,
            };
        },
    };
</script>

<style scoped>
    .auth-card {
        width: 100%;
        max-width: 360px;
        padding: 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }
</style>
