<template>
  <div id="app">
    <nav-bar />
    <router-view />
    <footer-bar />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'

export default {
  components: { FooterBar, NavBar },
  data () {
    return {
    }
  },
  created () {
  },

  mounted () {
  }
}
</script>
