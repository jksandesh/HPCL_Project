<template>
  <div
    class="block2"
    :class="{enter: showing}"
    style="position:relative; width: 100%;"
  >
    <!--v-vp-show="'40, 40'"-->
    <div class="block2-headline">
      <div class="headline-line" />
      <span
        class="headline-text"
        style="background: #fff; padding: 0 10px; z-index: 1"
      >PROJECT HIGHLIGHTS</span>
    </div>
    <div class="highlights">
      <project-highlight-item
        favorite
        icon-name="earth_secure.png"
        description="<b>First Blockchain based platform</b> to issue Purchase Orders powered by the security of Blockchains."
      />
      <project-highlight-item
        icon-name="block_cert.png"
        description="<b>Tamper-proof</b>, transparent and secure Purchase Orders verification."
      />
      <project-highlight-item
        icon-name="privacy_person.png"
        description="<b>Easily Verifiable</b>, and customer-owned digital Purchase Orders."
      />
      <project-highlight-item
        icon-name="clock_speed.png"
        description="Instant verification of Purchase Orders within <b>10 seconds</b>."
      />
    </div>
  </div>
</template>

<script>

import ProjectHighlightItem from './comps/ProjectHighlightItem'
export default {
  name: 'Block2',
  components: { ProjectHighlightItem },
  data: function () {
    return {
      showing: false
    }
  },
  mounted () {
    this.showing = true
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
    @import "@/styles/variables.scss";

    .block2 {
        position: relative;
        background: #fff;
        color: $primary-text;
    }

    .block2-headline {
        font-weight: bold;
        font-size: 14.5pt;
        line-height: 40px;
        display: flex;
        text-align: left;
        position: relative;
    }

    .mobile .block2-headline {
        justify-content: center;
    }

    .headline-line {
        position: absolute;
        width: 100%;
        height: 2px;
        align-self: center;
        top:0;
        bottom:0;
        margin: auto;
        background: $primary-text;
    }

    .headline-text {
        margin-left: 50px;
    }

    .mobile .headline-text {
        margin-left: 0;
    }

    .img-ico {
        position: absolute;
        pointer-events: none;
    }

    .highlights {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        margin: 10px 0 20px 0;
    }

    .mobile .highlight  {
        margin-top: 10px !important;
        min-width: 310px;
    }

    /*Animations*/
    @for $i from 1 through 10 {
        .enter ::v-deep .highlight:nth-child(#{$i}) .icon-container {
            transition: transform 1s ease-in-out #{$i*0.1}s, opacity 1s ease-in-out #{$i*0.1}s;
            transform: scale(1,1);
            opacity: 1;
        }
    }

    ::v-deep .highlight .icon-container{
        transform: scale(0.2, 0.2);
        transform-origin: center;
        opacity: 0.1;
    }

    @for $i from 1 through 10 {
        .enter ::v-deep .highlight:nth-child(#{$i}) {
            transition: transform 1s ease-in-out #{$i*0.1}s, opacity 1s ease-in-out #{$i*0.1}s;
            transform: translateX(0);
            opacity: 1;
        }
    }

    ::v-deep .highlight {
        opacity: 0;
        transform: translateX(50px);
        transform-origin: left center;
    }

</style>
