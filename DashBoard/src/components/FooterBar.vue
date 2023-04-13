<template>
  <footer
    v-show="isFooterBarVisible"
    class="footer foot"
  >
    <div class="container-fluid">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div>
              <b>{{ year }},</b> &mdash; HPCL Blockchain Based PO application
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FooterBar',
  data () {
    return {
      year: new Date().getFullYear()
    }
  },
  computed: {
    ...mapState([
      'isFooterBarVisible'
    ])
  }
}
</script>
<style  scoped>
.foot {
  position:fixed;
  bottom:0;
  left:0;
  height:40px;
  width:100%;
}

</style>
