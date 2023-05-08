<template>
  <div id="app">
    <section class="section  back hero is-fullheight">
      <div class="has-text-centered title-prop">
        <h1 class="is-size-1 title-style">
          HPCL Blockchain PO System
        </h1>
        <h3 class="is-size-4 subtitle-style">
          Blockchain Based PO Issuance and Verification
        </h3>
      </div>
      <div class="hero-body">
        <div class="container">
          <div class="columns is-centered ">
            <div class="column">
              <div class="image logo-image1">
                <img src="../assets/HP.png">
              </div>
            </div>
            <div class="column">
              <card-component
                class="card-comp"
                title="Login"
              >
                <form
                  method="POST"
                  @submit.prevent="loginUser"
                >
                  <b-field label="Admin Username">
                    <b-input
                      id="username"
                      v-model="form.username"
                      name="username"
                      type="text"
                      required
                    />
                  </b-field>

                  <b-field label="Admin Password">
                    <b-input
                      id="password"
                      v-model="form.password"
                      type="password"
                      name="password"
                      required
                    />
                  </b-field>
                  <hr>
                  <b-field grouped>
                    <div class="control">
                      <b-button
                        class="btn"
                        native-type="submit"
                        type="is-black"
                        :loading="isLoading"
                      >
                        Login
                      </b-button>
                    </div>
                  </b-field>
                </form>
              </card-component>
            </div>
            <div class="column">
              <div class="image logo-image2">
                <img src="../assets/hpcl2.jpg">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent.vue'

export default {
  name: 'Login',
  components: { CardComponent },
  data () {
    return {
      isLoading: false,
      form: {
        username: '',
        password: ''
      },
      userTye: ''
    }
  },
  computed: {
    userType () {
      return this.$store.state.userType
    }
  },
  watch: {
    userType: {
      immediate: true,
      handler: function (newVal) {
        if (newVal) {
          if (newVal === 'Data-Operator') {
            this.$router.replace('/blockchainPO')
          }
        } else {
          this.$router.push('/').catch(() => {
            console.log('Something Wrong')
          })
        }
      }
    }
  },
  created () {
    this.$store.dispatch('toggleFullPage', true)
  },
  beforeDestroy () {
    this.$store.dispatch('toggleFullPage', false)
  },
  methods: {
    async loginUser () {
      this.isLoading = true
      await this.$store.dispatch('login', this.form)
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.back {
  background: #102a43;
  background-image: url('../assets/C.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.title-prop {
  padding-top: 70px;
  position: relative;
}
.title-style{
  -webkit-text-fill-color: #F9A825;
}
.subtitle-style{
  -webkit-text-fill-color: #ffdd57;
}

.logo-image1 {
  width: 250px;
  height: 100px;
  /*position: absolute;*/
  /*top: 445px;*/
  /*left: 20%;*/
}

.logo-image2 {
  width: 400px;
  height: 490px;
  /*position: absolute;*/
  /*top: 445px;*/
  left: 120px;
}

.card-comp {
  justify-content: center;
  font-size: x-large;
  font-weight: bold;
}

.btn {
  justify-content: center;
  width: 120px;
}

</style>
