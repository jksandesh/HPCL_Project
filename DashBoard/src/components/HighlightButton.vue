<template>
  <div
    :style="{borderColor: color, background: hovering ? color: 'transparent', color: hovering ? alternateColor: color}"
    class="highlight-btn"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <slot />
  </div>
</template>

<script>
import { primaryColor } from '@/assets/variables.js'
export default {
  name: 'HighlightButton',
  props: {
    color: {
      type: String,
      required: false,
      default: primaryColor
    }
  },
  data: function () {
    return {
      hovering: false,
      alternateColor: '#fff'
    }
  }
}
</script>

<style scoped>

    .highlight-btn {
        border: 1.5px solid;
        padding: 5px 10px;
        display: inline-block;
        transition: background-color 0.3s ease;
    }

    .highlight-btn:hover {
        cursor: pointer;
    }

    .highlight-btn * {
        color: inherit !important;
    }
</style>
