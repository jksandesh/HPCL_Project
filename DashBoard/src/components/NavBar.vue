<template>
  <nav
    v-show="isNavBarVisible"
    id="navbar-main"
    class="navbar is-fixed-top"
  >
    <div class="navbar-brand">
      <a
        class="navbar-item is-hidden-desktop"
        @click.prevent="menuToggleMobile"
      >
        <b-icon :icon="menuToggleMobileIcon" />
      </a>
    </div>
    <div class="navbar-brand is-right">
      <div class="navbar-item navbar-item-menu-toggle is-hidden-desktop">
        <a @click.prevent="menuNavBarToggle">
          <b-icon
            :icon="menuNavBarToggleIcon"
            custom-size="default"
          />
        </a>
      </div>
    </div>
    <div
      class="navbar-menu fadeIn animated faster"
      :class="{'is-active':isMenuNavBarActive}"
    >
      <div class="navbar-end">
        <a
          class="navbar-item"
          title="Log out"
          @click="logout"
        >
          <b-icon
            icon="logout"
            custom-size="default"
          />
          <span>Log out</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import VueJwtDecode from 'vue-jwt-decode'
import axios from 'axios'
export default {
  name: 'NavBar',
  components: {
  },
  data () {
    return {
      isMenuNavBarActive: false,
      user: {}
    }
  },
  computed: {
    menuNavBarToggleIcon () {
      return (this.isMenuNavBarActive) ? 'close' : 'dots-vertical'
    },
    menuToggleMobileIcon () {
      return this.isAsideMobileExpanded ? 'backburger' : 'forwardburger'
    },
    ...mapState([
      'username',
      'userType',
      'isNavBarVisible',
      'isAsideMobileExpanded'
    ])
  },
  mounted () {
    this.$router.afterEach(() => {
      this.isMenuNavBarActive = false
    })
  },
  created () {
    this.getUserDetails()
  },
  methods: {
    menuToggleMobile () {
      this.$store.commit('asideMobileStateToggle')
    },
    menuNavBarToggle () {
      this.isMenuNavBarActive = (!this.isMenuNavBarActive)
    },
    getUserDetails () {
      const token = localStorage.getItem('jwt')
      const decoded = VueJwtDecode.decode(token)
      this.user = decoded
    },
    async logout () {
      this.isLoading = true
      await this.$store.dispatch('logout')
      this.isLoading = false
      localStorage.removeItem('jwt')
      localStorage.removeItem('userInfo')
      this.$store.state.userType = null
      axios.defaults.headers.token = null
      await this.$router.push('/').catch(() => {})
    }
  }
}
</script>
