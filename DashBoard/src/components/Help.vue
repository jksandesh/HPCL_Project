<template>
  <div class="box-background">
    <Menu2 />
    <div class="card main-info  div-style">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">
              Admin Contact Details
            </p>
            <div class="columns col-style">
              <div class="column">
                <p class="subtitle is-5 has-text-weight-bold">
                  Contact Number:
                </p>
              </div>
              <div class="column">
                <p class="subtitle is-5 has-text-weight-bold">
                  {{ '+91 74986 61003' }}
                </p>
              </div>
            </div>
            <div class="columns col-style">
              <div class="column">
                <p class="subtitle is-5 has-text-weight-bold">
                  Email:
                </p>
              </div>
              <div class="column">
                <p class="subtitle is-5 has-text-weight-bold">
                  {{ 'dtcgadchiroli@gmail.com' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu2 from '@/components/subadmin/Menu2'
export default {
  name: 'Help',
  components: { Menu2 }
}
</script>

<style scoped>
.main-info {
  box-shadow: -4px 3px 10px 2px #9988885e;
  border-radius: 5px;
  width: 500px;
  margin: 15px;
}

.box-background {
  background-color: #051d38;
}

.col-style{
  button: #c9e25a;
}

.div-style {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
