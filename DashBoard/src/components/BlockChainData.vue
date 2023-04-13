<template>
  <div class="align-items-center justify-content-center">
    <div v-if="userType === 'Super-Admin'">
      <Menu1 />
    </div>
    <div v-else>
      <Menu2 />
    </div>

    <div class="timeline is-centered">
      <header class="timeline-header">
        <span class="tag is-medium is-primary">BlockChain</span>
      </header>
      <div class="timeline-item is-primary">
        <div class="timeline-marker is-primary" />
        <div class="timeline-content">
          <p class="heading" />
        </div>
      </div>
      <div
        v-for="items in chainData"
        :key="items.timestamp.seconds"
      >
        <header class="timeline-header">
          <b-icon
            icon="cube"
            size="is-large"
          />
        </header>
        <div class="timeline-item is-danger">
          <div class="timeline-content">
            <p class="heading">
              {{ new Date(items.timestamp.seconds * 1000) }}
            </p>
            <b-collapse
              :open="false"
              aria-id="contentIdForA11y1"
            >
              <template #trigger="props">
                <b-button
                  label="View Block Data"
                  type="is-primary"
                  aria-controls="contentIdForA11y1"
                  :aria-expanded="props.open"
                />
              </template>
              <div class="notification">
                <div class="content">
                  <h3>
                    BlockChain Transaction
                  </h3>
                  <p>
                    {{ JSON.stringify(JSON.parse(items.data),null,'\t') }}
                  </p>
                  <h4>
                    Schemes
                  </h4>
                  <p>
                    {{ JSON.stringify(JSON.parse(items.data).schemes,null,'\t') }}
                  </p>
                </div>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>
      <header class="timeline-header">
        <span class="tag is-medium is-primary">BlockChain</span>
      </header>
    </div>
    <div class="card main-info tile is-child">
      <div class="card-content">
        <div class="media">
          <div class="media-content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu2 from '@/components/subadmin/Menu2'
import { blockchainApi } from '@/helpers/helpers'
import Menu1 from '@/components/admin/Menu1'

export default {
  name: 'BlockChainData',
  components: { Menu1, Menu2 },
  data () {
    return {
      chainData: [],
      track: '',
      userType: ''
    }
  },
  async mounted () {
    this.userType = this.$store.state.userType
    var res = await blockchainApi.getHistoryOnChain(this.$route.params.citizenId)
    // console.log(JSON.parse(res.response))
    this.chainData = JSON.parse(res.response)
    this.track = JSON.stringify(this.chainData, null, '\t')
  },
  methods: {
    diff (obj1, obj2) {
      const result = {}
      if (Object.is(obj1, obj2)) {
        return undefined
      }
      if (!obj2 || typeof obj2 !== 'object') {
        return obj2
      }
      Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
        if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
          result[key] = obj2[key]
        }
        if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
          const value = this.diff(obj1[key], obj2[key])
          if (value !== undefined) {
            result[key] = value
          }
        }
      })
      return JSON.stringify(result)
    }
  }
}
</script>

<style scoped>
.main-info {
  margin: 15px;
}
.tiles-style {
  margin: 15px;
}
.timeline .timeline-header {
  width: 6em;
  text-align: center;
}
.timeline .timeline-item {
  display: flex;
  display: -ms-flexbox;
  display: -webkit-flex;
  position: relative;
  border-left: 0.1rem solid #b5b5b5;
  margin-left: 3em;
  padding-bottom: 2em;
}
.timeline .timeline-item::before {
  background: white;
  border: 0.1em solid #b5b5b5;
  border-radius: 100%;
  content: "";
  display: block;
  height: 0.8rem;
  left: -0.45em;
  position: absolute;
  top: 1.2rem;
  width: 0.8rem;
}
.timeline .timeline-item .timeline-tag {
  position: absolute;
  width: 0.8em;
  left: -0.4em;
  height: 0.8em;
  top: 1.2em;
}
.timeline .timeline-item .timeline-tag .image {
  width: 32px;
  height: 32px;
  left: -12px;
  background: white;
  border: 0.1em solid #b5b5b5;
  border-radius: 100%;
  display: block;
  overflow: hidden;
}
.timeline .timeline-item .timeline-content {
  padding: 1em 0 0 0.5em;
  padding: 1em 0 0 2em;
}
.timeline .timeline-item .timeline-content .heading {
  font-weight: 500;
}
.timeline .timeline-item.is-white {
  border-left-color: white;
}
.timeline .timeline-item.is-white::before {
  border-color: white !important;
}
.timeline .timeline-item.is-white .timeline-tag .image {
  border-color: white !important;
}
.timeline .timeline-item.is-black {
  border-left-color: #0a0a0a;
}
.timeline .timeline-item.is-black::before {
  border-color: #0a0a0a !important;
}
.timeline .timeline-item.is-black .timeline-tag .image {
  border-color: #0a0a0a !important;
}
.timeline .timeline-item.is-light {
  border-left-color: whitesmoke;
}
.timeline .timeline-item.is-light::before {
  border-color: whitesmoke !important;
}
.timeline .timeline-item.is-light .timeline-tag .image {
  border-color: whitesmoke !important;
}
.timeline .timeline-item.is-dark {
  border-left-color: #363636;
}
.timeline .timeline-item.is-dark::before {
  border-color: #363636 !important;
}
.timeline .timeline-item.is-dark .timeline-tag .image {
  border-color: #363636 !important;
}
.timeline .timeline-item.is-primary {
  border-left-color: #00d1b2;
}
.timeline .timeline-item.is-primary::before {
  border-color: #00d1b2 !important;
}
.timeline .timeline-item.is-primary .timeline-tag .image {
  border-color: #00d1b2 !important;
}
.timeline .timeline-item.is-info {
  border-left-color: #3273dc;
}
.timeline .timeline-item.is-info::before {
  border-color: #3273dc !important;
}
.timeline .timeline-item.is-info .timeline-tag .image {
  border-color: #3273dc !important;
}
.timeline .timeline-item.is-success {
  border-left-color: #23d160;
}
.timeline .timeline-item.is-success::before {
  border-color: #23d160 !important;
}
.timeline .timeline-item.is-success .timeline-tag .image {
  border-color: #23d160 !important;
}
.timeline .timeline-item.is-warning {
  border-left-color: #ffdd57;
}
.timeline .timeline-item.is-warning::before {
  border-color: #ffdd57 !important;
}
.timeline .timeline-item.is-warning .timeline-tag .image {
  border-color: #ffdd57 !important;
}
.timeline .timeline-item.is-danger {
  border-left-color: #ff3860;
}
.timeline .timeline-item.is-danger::before {
  border-color: #ff3860 !important;
}
.timeline .timeline-item.is-danger .timeline-tag .image {
  border-color: #ff3860 !important;
}

</style>
