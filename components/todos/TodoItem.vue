<template>
  <li :class="computedClassName">
    <todo-check-box :checked="todo.completed" class="todoItem__toggle" @update:checked="_onCheckboxChange" />
    <span class="todoItem__text">{{ todo.title }}</span>
    <todo-icon-button class="todoItem__remove" @onClick="_onRemoveButtonClick">
      <font-awesome-icon icon="times" fixed-width />
    </todo-icon-button>
  </li>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import Checkbox from "~/components/input/Checkbox.vue";
import IconButton from "~/components/button/IconButton.vue";

export default {
  components: {
    TodoCheckBox: Checkbox,
    TodoIconButton: IconButton,
    FontAwesomeIcon,
  },
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    computedClassName() {
      return {
        todoItem: true,
        "todoItem--completed": this.todo.completed,
      };
    },
  },
  methods: {
    _onCheckboxChange() {
      this.$emit("onToggle", this.todo.id);
    },
    _onRemoveButtonClick() {
      this.$emit("onRemove", this.todo.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.todoItem {
  position: relative;
  border-bottom: 1px solid #ededed;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 2rem;

  &--completed {
    .todoItem__text {
      opacity: 0.5;
      text-decoration: line-through;
    }
  }

  &:hover {
    .todoItem__remove {
      opacity: 1;
    }
  }

  &__toggle {
    margin-right: 1.5rem;
  }

  &__remove {
    color: rgba(175, 47, 47, 1);
    position: absolute;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);

    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }
}
</style>
