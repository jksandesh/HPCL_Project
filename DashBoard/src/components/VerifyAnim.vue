<template>
  <div style="width: 100%; height: 300px; display: flex; align-items: center;">
    <div
      ref="progressBox"
      class="white-box"
    >
      <div class="mid-box" />
      <div class="top-border">
        <v-progress-linear
          v-model="merkleProgress"
          class="merkle-progress-bar"
          color="cyan"
          height="8"
        />
        <v-progress-linear
          v-model="blockProgress"
          color="green accent-4"
          height="8"
        />
      </div>
      <div class="bottom-border" />

      <div class="med-text progress-text">
        <div style="font-size: 12pt;">
          Verifying..
        </div>
        {{ overallProgress }}<span style="font-size:12pt; vertical-align: middle">%</span>
      </div>
      <img
        src="@/assets/images/document_hash.gif"
        class="hash_img"
      >
    </div>
    <canvas
      ref="verifyCanvas"
      style="width: 100%; height: 100%"
    />
  </div>
</template>

<script>
import Bezier from '@/utils/bezier.js'

const bezierCurve = new Bezier(0.63, 0.02, 1, 0.99)
const speed = 800 // pixel per second
let nextDigitTime = 0
export default {
  name: 'VerifyAnim',
  data: function () {
    return {
      canvasCtx: null,
      digitSizes: {},
      digitArray: []
    }
  },
  computed: {
    merkleProgress () {
      return this.$store.state.verifier.stage.merkleProgress ? Math.round(this.$store.state.verifier.stage.merkleProgress * 100) : 0
    },
    blockProgress () {
      return this.$store.state.verifier.stage.blockProgress ? Math.round(this.$store.state.verifier.stage.blockProgress * 100) : 0
    },
    overallProgress () {
      return Math.round((this.merkleProgress + this.blockProgress) / 2)
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleWindowResize)
    this.initCanvas()
    window.requestAnimationFrame(this.draw.bind(this))
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    initCanvas () {
      this.$refs.verifyCanvas.width = this.$el.clientWidth
      this.$refs.verifyCanvas.height = this.$el.clientHeight
      this.canvasCtx = this.$refs.verifyCanvas.getContext('2d')
      this.canvasCtx.font = 'bold 150px Poppins'
      this.digitSizes['0'] = this.canvasCtx.measureText('0')
      this.digitSizes['1'] = this.canvasCtx.measureText('1')
    },
    draw () {
      if (!this.$refs.verifyCanvas) { return }
      const now = Date.now()
      // console.log(now, nextDigitTime, now - nextDigitTime > 0);
      if (now - nextDigitTime > 0) {
        const newDigit = this.getNewDigit()
        this.digitArray.push(newDigit)
        nextDigitTime = now + (this.digitSizes[newDigit.value].width / speed) * 1000
      }
      const width = this.$refs.verifyCanvas.width
      const height = this.$refs.verifyCanvas.height
      const progressBoxOffset = this.$refs.progressBox.offsetLeft
      const drawY = height / 2 + this.digitSizes['0'].width / 2
      this.canvasCtx.clearRect(0, 0, width, height)
      let i = this.digitArray.length - 1
      for (; i >= 0; i--) {
        const digit = this.digitArray[i]
        const totalSpace = width + this.digitSizes[digit.value].width
        const neededTime = (totalSpace / speed) * 1000
        const elapsedTime = now - digit.spawn
        const currentPlace = width - totalSpace * bezierCurve.solve(elapsedTime / neededTime, Bezier.prototype.epsilon)
        // const currentPlace = width - ((now - digit.spawn) / 1000) * speed;
        if (currentPlace <= -this.digitSizes[digit.value].width) {
          break
        }
        this.canvasCtx.fillStyle = `rgba(${digit.value === 1 ? '239, 61, 61, ' : '130, 138, 146, '} ${currentPlace <= progressBoxOffset ? 0.8 : 0.15})`
        this.canvasCtx.font = `bold ${currentPlace <= progressBoxOffset ? 150 : 90}px Poppins`
        this.canvasCtx.fillText(digit.value, currentPlace, currentPlace <= progressBoxOffset ? drawY : drawY - 20)
      }
      if (i >= 0) { this.digitArray.splice(0, i + 1) }
      window.requestAnimationFrame(this.draw.bind(this))
    },
    getNewDigit () {
      return {
        value: Math.round(Math.random()),
        spawn: Date.now()
      }
    },
    handleWindowResize (event) {
      this.$refs.verifyCanvas.width = this.$el.clientWidth
      this.$refs.verifyCanvas.height = this.$el.clientHeight
      this.canvasCtx = this.$refs.verifyCanvas.getContext('2d')
      this.canvasCtx.font = 'bold 150px Poppins'
      this.initCanvas()
    }
  }
}
</script>

<style scoped lang="scss">
    @import "@/styles/variables.scss";

    $verifyBoxColor: lighten($primary-dark, 62%);

    .white-box {
        width: 250px;
        height: 250px;
        border-radius: 20px;
        position: absolute;
        right: 150px;
        display: flex;
    }

    .mobile .white-box {
        right: 70px;
    }

    .white-box .mid-box {
        background: $verifyBoxColor;
        margin: 0 10px;
        justify-content: center;
        flex: 1;
        align-self: stretch;
    }

    .white-box .top-border {
        position: absolute;
        top: 0;
        height: 20px;
        background: $verifyBoxColor;
        width: 100%;
        border-radius: 5px 5px 0 0;
    }

    .top-border:after {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        border-top: 10px solid $verifyBoxColor;
        border-right: 10px solid transparent;
        right: 0;
        top: 20px;
    }

    .top-border:before {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        border-top: 10px solid $verifyBoxColor;
        border-left: 10px solid transparent;
        left: 0;
        top: 20px;
    }

    .bottom-border:before {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        border-bottom: 10px solid $verifyBoxColor;
        border-left: 10px solid transparent;
        left: 0;
        bottom: 20px;
    }

    .bottom-border:after {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        border-bottom: 10px solid $verifyBoxColor;
        border-right: 10px solid transparent;
        right: 0;
        bottom: 20px;
    }

    .white-box .bottom-border {
        position: absolute;
        bottom: 0;
        height: 20px;
        background: $verifyBoxColor;
        width: 100%;
        border-radius: 0 0 5px 5px;
    }

    .hash_img {
        position: absolute;
        width: 200px;
        bottom: -30px;
        right: 0;
        left: 0;
        margin: auto;
        clip: rect(0px, 200px, 120px, 0px);
        mix-blend-mode: multiply;
    }

    .progress-text {
        position: absolute;
        top: 30px;
        left: 0;
        right: 0;
        margin: auto;
        color: $primary-text;
        font-size: 40pt;
    }

    .merkle-progress-bar {
        border-radius: 5px 5px 0 0;

    }
</style>
