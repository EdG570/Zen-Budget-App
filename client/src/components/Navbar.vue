<template>
    <div class="navbar">
        <div class="container">
            <h3>Z<span class="white-text">en</span> B<span class="white-text">udget</span></h3>
            <div class="nav-log-info">
                <span v-if="isLoggedIn">{{ email }}</span>
                <span v-if="isLoggedIn" class="sign-out-link" @click="signOut">Sign Out</span>
                <span v-if="!isLoggedIn"><router-link to="/login">Sign In</router-link></span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'Navbar',
    data() {
        return {

        }
    },
    computed: {
        ...mapState([
        'isLoggedIn',
        'email'
        ])
    },
    methods: {
        ...mapMutations([
            'SIGN_OUT'
        ]),
        signOut() {
            this.$store.commit('SIGN_OUT')
            this.$router.push('login')
        }
    }
}
</script>

<style scoped>
  .navbar {
      background-color: #242B51;
  }

  h3 {
      color: #DC1B59;
  }

  .white-text {
      color: #fff;
  }

  .nav-log-info {
      width: 22em;
      float: right;
      font-weight: 200;
      font-size: 12px;
  }

  .nav-log-info span {
      margin-right: 1em;
      margin-left: 1em;
  }

  #dropdownMenuButton {
      background-color: #242B51;
      border-color: none;
      color: #fff;
      font-weight: 200;
      margin-bottom: 0;
      margin-top: 1em;
  }

  #dropdownMenuButton:focus, #dropdownMenuButton:active {
      outline: none !important;
      border: none;
      box-shadow: none;
  }

  .sign-out-link:hover {
      cursor: pointer;
  }

   {

  }

  @media only screen and (max-width : 480px) {
        h3 {
            margin: 0 auto;
        }
  }
</style>
