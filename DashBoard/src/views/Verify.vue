<template>
  <div class="card box-info2">
    <b-modal v-model="isImageModalActive">
      <div class="card box-info2 imag-box">
        <div class="card-content center aligned">
          <img
            class="imag"
            src="../assets/giphy.gif"
          >
          <p class="title is-3 has-text-centered">
            Generating Blockchain Documents
          </p>
        </div>
      </div>
    </b-modal>
    <div
      class="home"
      style="width: 100%; height: 100%;"
      draggable="false"
    >
      <Block0 />
      <Block1 />
      <Block2 />
      <Block3 style="margin-top: 30px" />

      <!--PDF Report helpers-->
      <div style="display: none">
        <img
          id="report_header"
          :src="encodedImages.report_header"
        >
        <img
          id="sec_signature"
          :src="encodedImages.sec_signature"
        >
        <canvas id="cert_canvas" />
        <canvas id="report-canvas" />
      </div>
    </div>
  </div>
</template>

<script>
import { api /*  , blockchainApi */ } from '@/helpers/helpers'
import swal from 'sweetalert'
import Block2 from './home/Block2'
import Block3 from './home/Block3'
import Block0 from './home/Block0'
import Block1 from './home/Block1'
import encodedImages from '@/assets/encodedImages'
export default {
  name: 'Verify',
  components: { Block0, Block3, Block2, Block1 },
  data () {
    return {
      encodedImages,
      isLoading: false,
      isImageModalActive: false,
      aadhaarNo: '',
      fulName: '',
      surveyorId: '',
      finalData: [],
      paginated: true,
      perPage: 50,
      citizen: [],
      offlineData: [],
      disabled: false
    }
  },
  async mounted () {
  },
  methods: {
    sleep (milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    },
    async createOfflineEntry () {
      try {
        this.isImageModalActive = true
        const response = await api.createOfflineData(this.offlineData)
        if (response) {
          setTimeout(() => {
            this.isImageModalActive = false
            this.$router.push('/searchPage')
            swal('Success', 'Offline Data Updation Successful', 'success')
          }, 5000)
        } else {
          swal('Error', 'Something Went Wrong', 'Error')
        }
        // }
      } catch (err) {
        const error = err.response
        if (error.status === 409) {
          swal('Error', error.data.message, 'error')
        } else {
          swal('Error', error.data.err.message, 'error')
        }
      }
    }
  }
}
</script>

<style scoped>
.main-info {
  box-shadow: -4px 3px 10px 2px #9988885e;
  margin: 15px;
}

.box-info {
  box-shadow: -4px 3px 10px 2px #9988885e;
  margin: 15px;
  width: 200px;
}

.box-info3 {
  box-shadow: -4px 3px 10px 2px #9988885e;
  margin: 15px;
  width: 350px;
}

.box-info2 {
  margin: 15px;
}

</style>
