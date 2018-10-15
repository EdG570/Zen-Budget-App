<template>
    <div class="login">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-6">
                    <form @submit.prevent="validateForm" class="login-form">
                        <h2>Sign Up</h2>
                        <div class="form-group">
                            <span class="error-msg" v-if="!this.emailIsValid">Please enter a valid email</span>
                            <input v-model="email" 
                                   @blur="validateEmail"
                                   type="email" 
                                   class="form-control" 
                                   placeholder="Email"
                            >
                        </div>
                        
                        <div class="form-group">
                            <span class="error-msg" v-if="!this.passwordIsValid">Password must be at least 6 characters in length</span>
                            <input v-model="password"
                                   @blur="validatePassword" 
                                   type="password" 
                                   class="form-control" 
                                   placeholder="Password"
                            >
                        </div>
                        <button class="btn">Sign Up</button>
                        <span class="register-msg">Already have an account? <router-link to="/login">Log In</router-link></span>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            emailIsValid: true,
            emailRegExp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
            password: '',
            passwordIsValid: true,
            formIsValid: false,
            emailReset: ''
        }
    },
    computed: {
        ...mapState([
            'isLoggedIn'
        ])
    },
    methods: {
        ...mapActions([
            'registerUser',
        ]),
        validateEmail() {
            if (this.emailRegExp.test(this.email)) {
                this.emailIsValid = true
            }
            else {
                this.emailIsValid = false
            }
        },
        validatePassword() {
            if (this.password.length >= 6){
                this.passwordIsValid = true
            }
            else {
                this.passwordIsValid = false
            }
        },
        registerNewUser() {
            const formBody = {
              email: this.email,
              password: this.password
            }

            this.registerUser(formBody)
            this.resetForm()

            setTimeout(() => {
                this.$router.push('dashboard')
            }, 250)
        },
        validateForm() {
            this.validateEmail()
            this.validatePassword()

            if (this.emailIsValid && this.passwordIsValid) {
                this.formIsValid = true
                this.registerNewUser()
            } else {
                this.formIsValid = false
            }
        },
        resetForm() {
            this.email = ''
            this.password = ''
        }
    }
}
</script>

<style scoped>
    .login {
        padding-top: 5em;
    }

    .login-form {
        position: relative;
        padding: 1em 4em 4em 4em;
        border-radius: 5px;
        background-color: #242B51;
    }

    h2 {
        text-align: center;
        margin-bottom: 1em;
    }

    .register-link:hover {
        text-decoration: none;
    }

    .register-msg {
        font-size: 12px;
        position: absolute;
        left: 5.2em;
        bottom: 2.25em;
    }

    .forgot-pw {
        position: absolute;
        right: 5.2em;
        bottom: 2.25em;
        font-size: 12px;
        cursor: pointer;
        color: #ccc;
    }

    .error-msg {
        color: rgb(236, 60, 60);
        position: relative;
        top: -5px;
    }

    p {
        color: #ddd;
        font-size: 12px;
        text-align: center;
        position: relative;
        top: 2em;
    }

    p:hover {
        cursor: pointer;
    }

    button {
        width: 100%;
        background-color: #DC1B59;
        border: none;
        color: #fff;
    }

    #exampleModal h5 {
        color: #333;
        margin: 0 auto;
    }

    #exampleModal .modal-body p#body-title {
        color: #333;
        margin-bottom: 3em;
        font-size: 1em;
    }

    #exampleModal .modal-footer button.btn-secondary {
        background-color:#777;
    }

    #exampleModal .modal-footer button.btn-primary:hover {
        background-color:#DC1B59;
    }

    @media only screen and (max-width : 480px) {
        .login {
            padding-top: 1em;
        }

        .error-msg {
            font-size: 0.7em;
        }
    }
</style>
