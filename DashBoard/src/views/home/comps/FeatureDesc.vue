<template>
  <div
    class="feature-desc"
    style="display: flex; width: 430px;"
  >
    <img
      class="feature-icon"
      :src="require(`@/assets/icons/${iconName}`)"
      alt=""
    >
    <div style="display: flex; flex-direction: column; align-items: flex-start; margin-left: 20px">
      <div
        class="feature-name"
        v-html="name"
      />
      <div
        class="description"
        style="margin-top: 20px"
        v-html="description"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeatureDesc',
  props: {
    iconName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

    .feature-desc {
        color: #fff;
        align-items: flex-start;
    }
    .feature-name {
        display: inline-block;
        padding: 5px 10px;
        font-weight: bold;
        border: 2px solid #fff;
        font-size: 13pt;
        text-align: left;
    }

    .feature-desc .description {
        text-align: left;
        font-size: 12pt;
        font-weight: 500;
    }

    .feature-icon {
        max-width: 90px;
        max-height: 90px; /*IE11 fix*/
        object-fit: contain;
    }
</style>
