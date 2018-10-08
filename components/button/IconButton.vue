<template>
  <button class="btn--icon" @click="_onClick">
    <slot />
  </button>
</template>

<script>
export default {
  methods: {
    _onClick(event) {
      this.$emit("onClick", event);
    },
  },
};
</script>


<style lang="scss" scoped>
.btn--icon {
  font-size: 2rem;
  color: #000;
  opacity: 0.5;
  transition: opacity 0.25s ease-in-out;
  cursor: pointer;
  border: none;
  display: flex;

  &:hover,
  &:active {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
}
</style>
