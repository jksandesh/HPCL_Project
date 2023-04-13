<template>
  <div
    class="block1"
    style="width: 100%;"
  >
    <div
      ref="contents"
      class="block1-contents"
      :class="{verifying: !isInChoosingStage}"
    >
      <transition name="scale">
        <verifier-box-u-i
          v-show="isInChoosingStage"
          class="pos-verifier"
        />
      </transition>
      <transition name="fade">
        <a
          v-show="isInChoosingStage"
          class="lgt-credit"
          href="https://legitdoc.com"
          target="_blank"
        >
          <span class="link-underline">Powered by <span style="font-weight: bold; font-family: 'Titillium Web', 'sans-serif'; font-size: 18px">LegitDoc&reg;</span></span>
        </a>
      </transition>
    </div>

    <transition name="fade">
      <div v-if="isInVerificationStage">
        <!--div class="verify-anim-overlay"></div-->
        <VerifyAnim class="verify-anim" />
      </div>
    </transition>
  </div>
</template>

<script>
import VerifierBoxUI from '../verifier/VerifierBoxUI'
import VerifyAnim from '../../components/VerifyAnim'

export default {
  name: 'Block1',
  components: { VerifierBoxUI, VerifyAnim },
  data: function () {
    return {}
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    isInVerificationStage () {
      return false
    },
    // eslint-disable-next-line vue/return-in-computed-property
    isInChoosingStage () {
      return true
    }
  }
}
</script>

<style scoped lang="scss">
    @import "@/styles/variables.scss";
    .block1 {
        position: relative;
        margin-top: 10px;
    }

    .logo-image2 {
      width: 250px;
      height: 150px;
      position: absolute;
      top: 15%;
      left: 5%;
    }

    .block1-contents {
        flex-direction: row;
        display: flex;
        justify-content: space-around;
    }

    .block1-contents.reporting {
        min-height: 300px;
    }

    .pos-verifier {
        /*float:right;
        margin-right: 90px;*/
        margin: 0 auto;
        display: block;
    }

    .mobile .block1-contents {
        display: flex;
        flex-direction: column;
    }

    .lgt-credit {
        color: $primary-dark;
        position: absolute;
        bottom: 0;
        right: 20px;
        margin-top: 10px; margin-bottom:4px; text-decoration: none;
    }

    .mobile .lgt-credit {
        position: relative;
        bottom: inherit;
        right: inherit;
    }

    .verify-anim {

    }

    /*.verify-anim-overlay {
        pointer-events: none;
        background: $primary-text;
        opacity: 0.4;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }*/

    .download-sample:hover .sample-icon {
        transform: scale(1.2);
    }

    .generated-reports-pos {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        right: 0;
        margin: auto;
    }

    /* add your IE10-IE11 css here */
    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        .lgt_block_glow_img {
            display: none;
        }
    }

    .fade-enter-active {
        transition: opacity .5s 1s;
    }

    .fade-leave-active {
        transition: opacity .5s;

    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

    .slide-x-enter-active, .slide-x-leave-active {
        transition: transform .5s;
    }

    .slide-x-enter, .slide-x-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        transform: translateX(-200%);
    }

    .scale-enter-active, .scale-leave-active {
        transition: opacity, transform .3s;
    }

    .scale-enter, .scale-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        transform: scale(0, 0);
    }

    .slide-x-reverse-enter-active, .slide-x-reverse-leave-active {
        transition: transform .5s .3s;
    }

    .slide-x-reverse-enter, .slide-x-reverse-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        transform: translateX(200%);
    }

    .slide-y-reverse-enter-active .lgt_block_glow_img {
        display: none;
    }

    .slide-y-reverse-leave-active .lgt_block_glow_img {
        display: none;
    }

    .slide-y-reverse-enter-active .lgt_block_cloud_img {
        display: none;
    }

    .slide-y-reverse-leave-active .lgt_block_cloud_img {
        display: none;
    }

    .verifying .lgt_block_cloud_img {
        display: none;
    }

    .verifying .lgt_block_glow_img {
        display: none;
    }

    .slide-y-reverse-enter-active, .slide-y-reverse-leave-active {
        transition: transform 0.7s .3s;
    }

    .slide-y-reverse-enter, .slide-y-reverse-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        transform: translateY(200%);
    }

</style>
