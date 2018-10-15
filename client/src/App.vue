<template>
  <div id="app">
    <Navbar />
    <router-view/>
  </div>
</template>

<script>
import Navbar from './components/Navbar'

export default {
  components: {
    Navbar
  }  
}
</script>


<style>
  

  body, html, #app {
    background-color: #222646;
    color: #F7FFF7;
    letter-spacing: 1px;
    line-height: 1.4;
  }
</style>
