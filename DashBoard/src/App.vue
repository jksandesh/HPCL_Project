<template>
  <div id="app">
    <router-view />
    <footer-bar />
  </div>
</template>

<script>
import FooterBar from '@/components/FooterBar.vue'

export default {
  components: { FooterBar },
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
