<template>
  <div
    class="highlight"
    :class="{favorite}"
  >
    <div class="icon-container">
      <img
        class="highlight-icon"
        :src="require(`@/assets/icons/${iconName}`)"
        alt=""
      >
    </div>
    <div
      class="text"
      v-html="description"
    />
  </div>
</template>

<script>
export default {
  name: 'ProjectHighlightItem',
  props: {
    iconName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    favorite: {
      required: false,
      type: Boolean
    }
  }
}
</script>

<style scoped lang="scss">
    @import "@/styles/variables.scss";
    .highlight {
        display: flex;
        align-items: center;
        background: lighten($primary-dark, 55%);
        border-radius: 10px;
        height: 70px;
    }

    .highlight.favorite {
        background: lighten($secondary, 10%);

    }

    .icon-container {
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        border: 2px solid lighten($primary-dark, 55%);
        background: #fff;
    }

    .favorite .icon-container {
        border-color : lighten($secondary, 10%);
    }

    .highlight-icon {
        width: 60px;
        height: 60px;
    }

    .text {
        width: 190px;
        text-align: left;
        font-size: 10pt;
        max-height: 70px;
        border-radius: 0 10px 10px 0;
        padding: 7px;
    }

    .favorite .text {
        width: 240px;
        max-height: 100px;
        color: darken($secondary, 35%);
    }
</style>
