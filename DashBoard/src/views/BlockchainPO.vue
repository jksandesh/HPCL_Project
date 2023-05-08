<template>
  <div>
    <section class="hero is-small is-primary">
      <div class="hero-body">
        <div class="columns">
          <div class="image logo-image1">
            <img src="../assets/HP.png">
          </div>
          <div class="image logo-image2">
            <img src="../assets/hpcl2.jpg">
          </div>
        </div>
      </div>
    </section>
    <section class="hero is-small is-primary">
      <div class="hero-body">
        <p class="title">
          PO Files Selection Page
        </p>
      </div>
    </section>
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
      <div class="columns">
        <div class="column">
          <b-button
            class="btn is-danger are-medium is-medium"
            type="is-black"
            :loading="isLoading"
            @click="selectFile(true)"
          >
            Select PO's
          </b-button>
        </div>
        <div class="column">
          <b-button
            class="btn is-primary are-medium is-medium"
            style="margin-left: 5px"
            type="is-black"
            :loading="isLoading"
            @click="goToNear()"
          >
            Commit on NEAR Blockchain
          </b-button>
        </div>
        <div class="column" />
        <div class="column" />
        <div class="column" />
        <div class="column" />
        <div class="column" />
        <div class="column" />
      </div>
      <br>
      <modal-box
        :is-active="isModalActive"
        :trash-object-name="trashObject ? trashObject.name : null "
        @confirm="trashConfirm"
        @cancel="trashCancel"
      />
      <b-table
        :debounce-search="1000"
        :loading="isLoading"
        :paginated="paginated"
        :per-page="perPage"
        :striped="true"
        :hoverable="true"
        default-sort="date"
        :sort-desc="true"
        :data="selectedFiles"
      >
        <b-table-column
          v-slot="props"
          label="File Name"
          field="fileName"
          searchable
          sortable
        >
          {{ props.row.name }}
        </b-table-column>
        <b-table-column
          v-slot="props"
          label="Size (KB)"
          field="size"
        >
          {{ props.row.size / 1000 }}
        </b-table-column>
        <b-table-column
          v-slot="props"
          label="Type"
          field="type"
        >
          {{ props.row.type.replace('application/','') }}
        </b-table-column>
        <b-table-column
          v-slot="props"
          label="Last Modified"
          field="lastModified"
        >
          {{ props.row.lastModifiedDate }}
        </b-table-column>
        <b-table-column
          v-slot="props"
          custom-key="actions"
          cell-class="is-actions-cell"
        >
          <div class="buttons is-right no-wrap">
            <button
              class="button is-small is-danger"
              type="button"
              @click.prevent="trashModalOpen(props.row)"
            >
              <b-icon
                icon="delete"
                size="is-small"
              />
            </button>
          </div>
        </b-table-column>
        <section
          slot="empty"
          class="section"
        >
          <div class="content has-text-grey has-text-centered">
            <template v-if="isLoading">
              <p>
                <b-icon
                  icon="dots-horizontal"
                  size="is-large"
                />
              </p>
              <p>Fetching data...</p>
            </template>
            <template v-else>
              <p>
                <b-icon
                  icon="emoticon-sad"
                  size="is-large"
                />
              </p>
              <p>Nothing's there&hellip;</p>
            </template>
          </div>
        </section>
      </b-table>
      <b-button
        class="btn is-success are-medium is-medium"
        type="is-black"
        :loading="isLoading"
        @click="commitToBlockchain()"
      >
        Commit PO's to Blockchain
      </b-button>
      <div class="card main-info tile is-child">
        <div class="card-content">
          <div class="media">
            <div class="media-content" />
          </div>
        </div>
      </div>
    </div>
    <nav-bar />
  </div>
</template>

<script>
// import axios from 'axios'
import NavBar from '@/components/NavBar'
import { blockchainApi } from '@/helpers/helpers'
import ModalBox from '@/components/ModalBox.vue'
import swal from 'sweetalert'
import { keccak256 } from 'js-sha3'
const path = require('path')

export default {
  name: 'SearchPage',
  components: { ModalBox, NavBar },
  props: {
    dataUrl: {
      type: String,
      default: null
    },
    checkable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isModalActive: false,
      trashObject: null,
      isImageModalActive: false,
      isLoading: false,
      paginated: true,
      perPage: 50,
      selectedFiles: [],
      hashes: [],
      finalData: []
    }
  },
  methods: {
    commitToBlockchain () {
      this.readmultifiles(this.selectedFiles)
    },
    getLegitDocKeyPos (pdfBytes, startFrom) {
      const LEGITDOC_KEY_REVERSE = [...'%<--LEGITDOC_KEY-->'].reverse().join('')
      return this.findReverse(LEGITDOC_KEY_REVERSE, pdfBytes, startFrom)
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
    async readmultifiles (files) {
      function findReverse (buffer) {
        const STARTXREF_REVERSE = [...'startxref'].reverse().join('')
        var bufferNew = new Uint8Array(buffer)
        let foundLength = 0
        let i = buffer.byteLength - 1
        // console.log('byteLength.' + String.fromCharCode(bufferNew[0]).toString())
        for (; i >= 0; i--) {
          const c = String.fromCharCode(bufferNew[i])
          if (c === STARTXREF_REVERSE[foundLength]) {
            foundLength++
            if (foundLength === STARTXREF_REVERSE.length) {
              return i
            }
          } else {
            foundLength = 0
          }
        }
        return i
      }
      var reader = new FileReader()
      var hashesl = []
      const options = {
        types: [
          {
            description: 'PDF Files',
            accept: {
              'text/plain': ['.pdf']
            }
          }
        ]
      }
      const dhandle = await window.showDirectoryPicker(options)
      dhandle.requestPermission({ writable: true })
      var that = this
      async function readFile (index) {
        if (index >= files.length) {
          try {
            const response = await blockchainApi.addAllPOsOnChain(that.finalData)
            console.log(response)
            if (response) {
              setTimeout(async () => {
                that.isImageModalActive = false
                await swal('Success', 'Successfully anchored on Blockchain', 'success')
                await that.$router.go('/blockchainPO')
              }, 5000)
            } else {
              swal('Error', 'Something Went Wrong', 'Error')
            }
          } catch (err) {
            const error = err.response
            if (error.status === 409) {
              swal('Error', error.data.message, 'error')
            } else {
              swal('Error', error.data.err.message, 'error')
            }
          }
          return 1
        }
        var file = files[index]
        const fileName = path.basename(file.name)
        const newFileName = fileName.split('.')[0] + '_legitdoc.pdf'
        const newFilePath = path.resolve(path.dirname(file.name), newFileName)
        // console.log('fileName:' + fileName)
        // console.log('newfileName:' + newFileName)
        console.log('path:' + newFilePath)
        reader.onload = async function (e) {
          // get file content
          var bin = e.target.result
          var uintArray = new Uint8Array(bin)
          var hash = keccak256(bin)
          hashesl.push(hash)
          console.log('hash' + hash)
          var startx = findReverse(bin)
          const lgtKeyPos = that.getLegitDocKeyPos(uintArray, startx) // find 'lgt_ket start position in modified data.
          console.log('lgtKeyPos--:' + lgtKeyPos)
          if (lgtKeyPos === -1) {
            console.log('startx' + startx)
            const LGT_KEY_SEP = '%<--LEGITDOC_KEY-->' + keccak256(bin) + '<--LEGITDOC_KEY-->'
            const newPdfData = Buffer.concat([Buffer.from(uintArray.slice(0, startx)),
              Buffer.from(LGT_KEY_SEP + '\n', 'utf-8'),
              Buffer.from(uintArray.slice(startx, uintArray.byteLength))])
            // console.log(newPdfData)
            // await handle.getFileHandle(newFileName, { create: true })
            const fhandle = await dhandle.getFileHandle(newFileName, { create: true })
            that.isImageModalActive = true
            const writable = await fhandle.createWritable()
            await writable.write(newPdfData)
            await writable.close()
            var temp = { poId: hash, poName: newFileName, docHash: hash, date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }), issuer: 'HPCL', validity: '5 Years', temp1: '', temp2: '', temp3: '', temp4: '', temp5: '', temp6: '' }
            that.finalData.push(temp)
            readFile(index + 1)
          } else {
            that.isImageModalActive = true
            readFile(index + 1)
          }
        }
        reader.readAsArrayBuffer(file)
      }
      await readFile(0)
      this.hashes = hashesl
    },
    async goToNear () {
      await this.$router.replace('/blockchainPONEAR')
    },
    async selectFile (multiple) {
      return new Promise(resolve => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = multiple
        input.accept = '.pdf'
        console.log(input.dir)
        console.log(input.size)
        input.onchange = () => {
          this.selectedFiles = Array.from(input.files)
          if (multiple) {
            console.log(this.selectedFiles)
          } else {
            console.log(this.selectedFiles[0])
          }
        }
        input.click()
      })
    },
    trashModalOpen (obj) {
      this.trashObject = obj
      this.isModalActive = true
    },
    trashConfirm () {
      this.isModalActive = false
      // var index = this.selectedFiles.indexOf(this.trashObject)
      // if (index > -1) {
      //   this.selectedFiles.splice(index, 1)
      // }
    },
    trashCancel () {
      this.isModalActive = false
    }
  }
}
</script>
<style scoped>

.imag {
  width: 350px;
  height: 350px;
}

.imag-box{
  width: 400px;
  height: 450px;
  left: 23%;
}
.logo-image2 {
  width: 180px;
  height: 100px;
  /*position: relative;*/
  /*top: 5px;*/
  left: 5px;
}
.logo-image1 {
  width: 85px;
  height: 85px;
  /*position: relative;*/
  /*top: 5px;*/
}

.box-info2 {
  margin: 15px;
}
.box-info2 {
  margin: 15px;
}

</style>
