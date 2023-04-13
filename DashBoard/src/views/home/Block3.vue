<template>
  <div
    v-vp-show="'40, 40'"
    class="block3"
    style="position:relative; width: 100%;"
  >
    <div class="block3-headline">
      <div class="headline-line" />
      <span style="background: #fff; padding: 0 10px; z-index: 1">HOW IT WORKS?</span>
    </div>
    <div class="content">
      <div class="issuance">
        <div class="header">
          Purchase Order Issuance
        </div>
        <div class="step">
          <div>
            <b>1.</b> Purchase Order PDFs are hashed to find unique, irreversible digital fingerprint.
          </div>
          <div>
            <img
              class="process_img"
              src="@/assets/process_icons/issue_1.png"
            >
          </div>
        </div>
        <div class="step">
          <div>
            <b>2.</b> Digital fingerprints are digitally signed by the issuer and published onto
            <a
              href=""
              target="_blank"
              style="text-decoration: none"
            >HPCL Private Blockchain</a>.
          </div>
          <div>
            <img
              class="process_img"
              src="@/assets/process_icons/issue_2.png"
            >
          </div>
        </div>
        <div class="step">
          <div>
            <b>3.</b> Unqiue blockchain proofs are computed and attached to Purchase Order PDF to form <span style="display:inline-block">blockchain-enabled</span> Purchase Order, subsequently issued to vendors.
          </div>
          <div>
            <img
              class="process_img"
              src="@/assets/process_icons/issue_3.png"
            >
          </div>
        </div>
      </div>
      <div class="split" />
      <div class="verification">
        <div class="header">
          Purchase Order Verification
        </div>
        <div class="step">
          <div>
            <b>1.</b> Verifier uploads Purchase Order_legitdoc.pdf to the verification portal.
          </div>
          <div>
            <img
              class="process_img"
              src="@/assets/process_icons/verify_1.png"
            >
          </div>
        </div>
        <div class="step">
          <div>
            <b>2.</b> Verification portal parses and extracts Blockchain proof out of <span style="display:inline-block">blockchain-enabled</span> Purchase Order PDF.
          </div>
          <div>
            <img
              class="process_img"
              src="@/assets/process_icons/verify_2.png"
            >
          </div>
        </div>
        <div class="step">
          <div>
            <b>3.</b> Verification portal calculates PDF fingerprint; Compares fingerprint and Blockchain proof data with the data put on the Blockchain for verification.
          </div>
          <div>
            <img
              class="process_img"
              src="@/assets/process_icons/verify_3.png"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Block3'
}
</script>

<style scoped lang="scss">
    @import "@/styles/variables.scss";

    .block3 {
        position: relative;
        background: #fff;
        color: $primary-text;

        border: solid $primary-text;
        border-width: 0 0 1px 0;
        border-style: dashed;
    }

    .block3-headline {
        font-weight: bold;
        font-size: 14.5pt;
        line-height: 40px;
        display: flex;
        justify-content: center;
        text-align: left;
        position: relative;
    }

    .headline-line {
        position: absolute;
        width: 100%;
        height: 2px;
        left: 0; //fix for IE.
        top: 0;
        bottom: 0;
        margin: auto;
        background: $primary-text;
    }

    .content {
        display: flex;
        font-size: 10.5pt;
        color: #000;
        position: relative;
    }

    .mobile .content {
        flex-direction: column;
    }

    .issuance {
        display: flex;
        flex: 1;
        flex-direction: column;
        text-align: left;
        padding: 20px;
    }

    .verification {
        display: flex;
        flex: 1;
        flex-direction: column;
        text-align: left;
        padding: 20px;
    }

    .content .header {
        color: $primary-text;
        text-align: center;
        font-weight: bold;
        font-size: 13pt;
    }

    .process_img {
        height: 120px;
        object-fit: contain;
        margin: 0 auto;
        display: block;
    }

    .mobile .process_img {
        height: 100px;
    }

    .split {
        position: absolute;
        left: 0;
        right: 0;
        width: 1px;
        border: solid $primary-text;
        border-width: 0 1px 0 0;
        border-style: dashed;
        margin: auto;
        height: 100%;
    }

    .mobile .split {
        width: 100%;
        border-width: 1px 0 0 0;
        height: 3px;
        top: 0;
        bottom: 0;
    }

    .step:not(:first-child){
        margin-top: 20px;
    }
</style>
