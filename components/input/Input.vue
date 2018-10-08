<template>
  <input :placeholder="placeholder" :value="value" class="input" type="text" @input="_onChange" @keypress="_onKeyPress" @dblclick="_onDoubleClick">
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    _onChange(event) {
      this.$emit("update:value", event.target.value);
    },
    _onKeyPress(event) {
      if (event.code === "Enter") {
        this.$emit("onEnter", event);
      }
    },
    _onDoubleClick(event) {
      this.$emit("onDoubleClick", event);
    },
  },
};
</script>


<style scoped>
.input {
  border: none;
  background: #fff;
  box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.3);
  width: 100%;
  margin: 0;
  font-size: 2.4rem;
  padding: 2rem 4rem;
}

.input:focus {
  outline: none;
}
</style>
