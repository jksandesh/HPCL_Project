<template>
  <div>
    <div style="display: inline-flex;">
      <b-modal v-model="isImageModalActive">
        <div class="card box-info2 imag-box">
          <div class="card-content center aligned">
            <img
              class="imag"
              src="../../assets/giphy.gif"
            >
            <p class="title is-4 has-text-centered">
              Verifying Purchase Order on Blockchain
            </p>
          </div>
        </div>
      </b-modal>
      <div style="display: flex; flex-direction: column; align-items: center">
        <div class="verify-hint">
          Verify - HPCL Purchase Orders
        </div>
        <div
          class="verify-box"
          style="margin-top: 15px; position: relative"
        >
          <div class="dragdrop">
            <img
              src="@/assets/dragdrop.png"
              alt=""
              style="width: 40px; "
            >
            <div style="color: rgb(0,60,180)">
              Drag and Drop
            </div>
          </div>
          <div class="arrow">
            <div class="arrow-up" />
            <div class="arrow-down" />
          </div>
          <div
            class="select-files"
            @click="chooseFiles"
          >
            <div
              class="select-btn"
            >
              <span style="font-weight: 600">Select Purchase Order</span>
            </div>
          </div>
          <div
            class="upload-btn-wrapper"
            style="display:none"
          >
            <input
              id="choose_files"
              type="file"
              multiple="multiple"
              accept=".pdf"
              @change="selectFiles"
            >
          </div>
        </div>
      </div>
      <div
        id="drop_overlay"
        style="display:flex; justify-content: center;"
      >
        <h3 style="margin-top: 100px">
          You can drop it now :)
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import { makeDragAndDroppable } from '@/utils/ui-helper'
import { isIE11 } from '@/assets/utils'
import { api, blockchainApi } from '@/helpers/helpers'
import { keccak256 } from 'js-sha3'
import path from 'path'
import swal from 'sweetalert'
const Buffer = require('buffer/').Buffer
export default {
  name: 'VerifierBoxUI',
  data () {
    return {
      isImageModalActive: false
    }
  },
  computed: {
  },
  mounted () {
    makeDragAndDroppable(document.getElementById('app'), this.selectFiles.bind(this),
      document.getElementById('drop_overlay'))
  },
  methods: {
    async selectFiles (e) {
      if (isIE11()) {
        this.$toast.error('Please use Google Chrome or Firefox for verifying the documents', 'Browser not supported', {
          timeout: false,
          position: 'center',
          color: 'blue',
          overlay: true
        })
        return
      }
      const files = e.target.files || e.dataTransfer.files
      if (files.length === 0) return
      const pdfFiles = Array.from(files).filter(file => file.name.endsWith('.pdf'))
      if (pdfFiles.length === 0) {
        this.$toast.warning('Please choose LegitDoc pdf file for verification', 'No pdf file found', {
          timeout: false,
          position: 'topRight',
          color: 'blue'
        })
        return
      }
      if (pdfFiles.length > 1) {
        this.$toast.warning('You can only verify a single document at once.', 'Limit Exceeded', {
          timeout: false,
          position: 'topRight',
          color: 'blue'
        })
        return
      }
      if (pdfFiles.length !== files.length) {
        const proceed = await this.$confirm('', `Only <b>${pdfFiles.length}</b> out of <b>${files.length} chosen files</b> are pdf files.
                        <br/> Do you want to continue with <b>${pdfFiles.length} pdf files</b>?`, 'Continue', 'Cancel')
        if (!proceed) { return }
      }
      await this.loadPDF(pdfFiles[0])
    },
    async loadPDF (pdfFile) {
      this.isImageModalActive = true
      console.log('>>>' + pdfFile.name)
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      const fileName = path.basename(pdfFile.name)
      var that = this
      reader.onload = async function (e) {
        // get file content
        var bin = e.target.result
        var uintArray = new Uint8Array(bin)
        console.log('>>>' + bin)
        await that.readLGTPDF(Buffer.from(uintArray), pdfFile.name)
      }
      reader.readAsArrayBuffer(pdfFile)
      console.log('-->' + fileName)
      // const pdfContent = reader.readAsArrayBuffer(pdfFile)
    },
    getStartXRefPosition (pdfBytes) {
      const STARTXREF_REVERSE = [...'startxref'].reverse().join('')
      return this.findReverse(STARTXREF_REVERSE, pdfBytes)
    },
    getLegitDocKeyPos (pdfBytes, startFrom) {
      const LEGITDOC_KEY_REVERSE = [...'%<--LEGITDOC_KEY-->'].reverse().join('')
      return this.findReverse(LEGITDOC_KEY_REVERSE, pdfBytes, startFrom)
    },
    getBetween (str, firstStr, lastStr) {
      const matches = str.match(firstStr + '(.*)' + lastStr)
      if (!matches || matches.length < 2) {
        return false
      }
      return matches[1].trim()
    },
    findReverse (reversedStr, arr, startFrom) {
      let foundLength = 0
      let i = startFrom || arr.byteLength - 1
      for (; i >= 0; i--) {
        const c = String.fromCharCode(arr[i])
        if (c === reversedStr[foundLength]) {
          foundLength++
          if (foundLength === reversedStr.length) {
            // Position of 's' in 'startxref' in the pdfBytes array.
            return i
          }
        } else {
          foundLength = 0
        }
      }
      return i
    },
    async readLGTPDF (pdfData, filename) {
      console.log('Here')
      const startXRefPos1 = this.getStartXRefPosition(pdfData) // find 'startxref' start position in modified data.
      const lgtKeyPos = this.getLegitDocKeyPos(pdfData, startXRefPos1) // find 'lgt_ket start position in modified data.
      if (startXRefPos1 === -1) {
        setTimeout(async () => {
          this.isImageModalActive = false
          await swal('Error', 'This Document is not a valid Blockchain based Purchase Order !! \n Please contact admin@hpcl.com', 'error')
          await this.$router.go('/verify')
        }, 5000)
      } else if (lgtKeyPos === -1) {
        setTimeout(async () => {
          this.isImageModalActive = false
          await swal('Error', 'This Document is not a valid Blockchain based Purchase Order !! \n Please contact admin@hpcl.com', 'error')
          this.$router.go('/verify')
        }, 5000)
      }
      // construct reverted data by removing the lgt_key\n before startxref
      const originalPDFData = Buffer.concat([pdfData.slice(0, lgtKeyPos), pdfData.slice(startXRefPos1, pdfData.byteLength)])
      // console.log('originalPDFData' + originalPDFData)
      const LGT_USER_KEY = pdfData.slice(lgtKeyPos, startXRefPos1).toString('utf-8')
      const lgtKeyDataJSON = this.getBetween(LGT_USER_KEY, '<--LEGITDOC_KEY-->', '<--LEGITDOC_KEY-->')
      // console.log('lgtKeyDataJSON--:' + lgtKeyDataJSON)
      const fileHash = keccak256(originalPDFData).toString('hex').toLowerCase()
      console.log('PO_Name--:' + filename.toString().split('_')[0])

      if (lgtKeyDataJSON.toString().includes('poId')) {
        try {
          var keyData = JSON.parse(lgtKeyDataJSON)
          // console.log('Root--->' + keyData.temp1)
          var nearRoot = await api.verifyOnNear(keyData.temp1)
          // console.log('NEAR-->' + nearRoot.hash)
          if (nearRoot.hash === keyData.temp1) {
            setTimeout(async () => {
              this.isImageModalActive = false
              // await swal('Success', 'Successfully Verified on Blockchain \n Issued By : ' + keyData.issuer + '\n Issued On : ' + keyData.date + '\n Transaction Hash : ' + keyData.docHash + '\n Doc Validity : ' + 'Valid', 'success')
              // await swal('Success', 'Successfully Verified on Blockchain \n Issued By : ' + keyData.issuer + '\n Issued On : ' + keyData.date + '\n Transaction Hash : ' + keyData.docHash + '\n Doc Validity : ' + 'Valid' + '\n View on Near : ' + 'https://explorer.mainnet.near.org/transactions/ByGYAsVmMRmgKEFNzc4RtEWsdgK2jwZafo5Ph1Vcbmqe', 'success')
              await swal({
                text: 'Successfully Verified on Blockchain \n Issued By : ' + keyData.issuer + '\n PO Number: ' + filename.toString().split('_')[0] + '\n Anchored to Blockchain on: ' + keyData.date + '\n Transaction Hash : ' + keyData.docHash + '\n PO Validity : ' + 'Valid',
                icon: 'success',
                content: {
                  element: 'a',
                  attributes: {
                    text: 'View On NEAR Blockchain',
                    href: 'https://explorer.mainnet.near.org/transactions/' + keyData.temp3
                  }
                }
              })
              await this.$router.go('/verify')
            }, 5000)
          } else {
            setTimeout(async () => {
              this.isImageModalActive = false
              await swal('Error', 'This Document is not a valid Blockchain based Purchase Order !! \n Please contact admin@hpcl.com', 'error')
              await this.$router.go('/verify')
            }, 5000)
          }
        } catch (err) {
          const error = err.response
          if (error.status === 409) {
            swal('Error', error.data.message, 'error')
          } else {
            swal('Error', error.data.err.message, 'error')
          }
        }
      } else if (lgtKeyDataJSON.toString().toLocaleLowerCase() !== fileHash.toString().toLocaleLowerCase()) {
        this.isImageModalActive = false
        await swal('Error', 'This Document is not a valid Blockchain based Purchase Order !! \n Please contact admin@hpcl.com', 'error')
      } else {
        try {
          const response = await blockchainApi.getOnePO(fileHash)
          console.log(response)
          if (response) {
            const res = JSON.parse(response.response)
            const clean = JSON.stringify(res, null, '\t')
            const podata = JSON.parse(clean)
            // console.log('RES--:' + podata.docHash)
            if (fileHash.toString().toLocaleLowerCase() === podata.docHash.toString().toLocaleLowerCase()) {
              setTimeout(async () => {
                this.isImageModalActive = false
                await swal({
                  text: 'Successfully Verified on Blockchain \n\n Issued By : ' + podata.issuer + '\n\n PO Number: ' + filename.toString().split('_')[0] + '\n\n Anchored to Blockchain on: ' + podata.date + '\n\n PO Validity : ' + 'Valid' + '\n\n Transaction Hash : ' + podata.docHash,
                  icon: 'success'
                })
                await this.$router.go('/verify')
              }, 5000)
            } else {
              setTimeout(async () => {
                this.isImageModalActive = false
                await swal('Error', 'This Document is not a valid Blockchain based Purchase Order !! \n Please contact admin@hpcl.com', 'error')
                await this.$router.go('/verify')
              }, 5000)
            }
          } else {
            swal('Error', 'Something Went Wrong', 'error')
          }
        } catch (err) {
          const error = err.response
          if (error.status === 409) {
            swal('Error', error.data.message, 'error')
          } else {
            swal('Error', error.data.err.message, 'error')
          }
        }
      }
    },
    chooseFiles () {
      document.getElementById('choose_files').click()
    },
    openHelp () {
      this.$root.$emit('open-help')
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/styles/variables.scss";

$mobileBoxWidth: 300;
$boxWidth: 350;
$boxHeight: 200;
$border: 2;
$borderRadius: 30;
.verify-box {
  width: #{$boxWidth}px;
  height: #{$boxHeight}px;
  background: $primary-dark;
  border-radius: #{$borderRadius}px;
  display: flex;
  flex-direction: column;
  border: #{$border}px solid #c7d8eb;
}

.mobile .verify-box {
  width: #{$mobileBoxWidth}px;
}

.custom-swal-popup {
  width: 800px; /* Set your desired width */
  height: 200px; /* Set your desired height */
}

.imag-box{
  width: 400px;
  height: 450px;
  left: 23%;
}

.mobile .help-link {
  display: block;
}

.verify-hint {
  color: #000;
  font-weight: bold;
  font-size: 14px;
}

$dragDropHeight: 20;
.dragdrop {
  width: #{$boxWidth - $border*2}px;
  height: #{$boxHeight*.5 + $dragDropHeight}px;
  border-radius: #{$borderRadius - $border*1.5}px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mobile .dragdrop {
  width: #{$mobileBoxWidth - $border*2}px;
}

.select-files {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1
}

.select-btn {
  padding: 5px 20px;
  background: $secondary;
  border-radius: 20px;
  font-weight: lighter;
  color: $primary-dark !important;
}

.select-btn:hover {
  background: darken($primary-dark, 10%);
  color: $secondary !important;
  cursor: pointer;
}

.arrow {
  position: absolute;
  pointer-events: none;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: #{$boxWidth}px;
  height: #{$boxHeight}px;
  margin: auto;
  margin-top: #{$dragDropHeight}px;
  left: 0;
  top: 0;
}

.logo-image1 {
  width: 120px;
  height: 80px;
  margin-bottom: 10px;
}

.logo-image2 {
  width: 180px;
  height: 80px;
  margin-bottom: 10px;
}
.mobile .arrow {
  width: #{$mobileBoxWidth}px;
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-bottom: 15px solid $primary-dark;
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-top: 15px solid #fff;
}

#drop_overlay {
  visibility: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  pointer-events: none;
  height: 100%;
  background: rgba(0, 0, 0, 0.73);
  transition: visibility 175ms, opacity 175ms;
  color: #fff;
}

</style>
