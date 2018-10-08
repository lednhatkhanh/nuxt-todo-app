<template>
  <h1 class="title">{{ title }}</h1>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 10rem;
  color: rgba(175, 47, 47, 0.8);
  text-align: center;
  display: block;
}
</style>
