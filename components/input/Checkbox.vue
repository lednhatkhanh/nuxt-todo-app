<template>
  <div class="checkbox" @click="_handleClick">
    <font-awesome-icon v-if="checked" class="checkbox__icon" icon="check" fixed-width />
    <input :name="name" :checked="checked" type="checkbox" class="checkbox__input">
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: {
    FontAwesomeIcon,
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    _handleClick(event) {
      event.preventDefault();

      this.$emit("update:checked", !this.checked);
    },
  },
};
</script>


<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border-radius: 50%;
  height: 3rem;
  width: 3rem;
  border: var(--line);
  color: rgba(175, 47, 47, 0.8);
  background-color: #fff;
  cursor: pointer;

  &__input {
    appearance: none;
    outline: none;
  }
}
</style>
