<template>
  <aside
    v-if="showMenu"
    v-show="isAsideVisible"
    class="aside is-placed-left is-expanded"
  >
    <div class="image">
      <img src="../assets/maha2.png">
    </div>
    <div class="menu is-menu-main">
      <aside-menu-list
        :menu="menu"
        @menu-click="menuClick"
      />
    </div>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
import AsideMenuList from '@/components/AsideMenuList.vue'

export default {
  name: 'AsideMenu',
  components: { AsideMenuList },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showMenu () {
      return this.$route.name !== 'login'
    },
    ...mapState([
      'isAsideVisible'
    ])
  },
  methods: {
    menuClick (item) {
      //
    }
  }
}
</script>

<style >
</style>
