<template>
  <div class="is-title-bar">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <h1 class="title">
            <slot />
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleBar'
}
</script>
