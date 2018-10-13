<template>
  <li :class="classList" @click="_onClick"><slot /></li>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classList() {
      return {
        filter: true,
        "filter--active": this.active,
      };
    },
  },
  methods: {
    _onClick() {
      this.$emit("onClick");
    },
  },
};
</script>

<style lang="scss" scoped>
.filter {
  font-size: 1.6rem;
  font-weight: 400;
  border-radius: 0.4rem;
  border: var(--line);
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.25s ease-in-out;

  &:hover,
  &--active {
    opacity: 1;
    color: rgba(175, 47, 47, 0.8);
    border-color: rgba(175, 47, 47, 0.8);
  }
}
</style>
