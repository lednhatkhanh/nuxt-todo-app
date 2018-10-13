<template>
  <li :class="computedClassName" @dblclick="_handleDoubleClick">
    <todo-check-box :checked="todo.completed" @update:checked="_onCheckboxChange" />
    <span v-if="!editing" class="todoItem__text">{{ todo.title }}</span>
    <todo-input v-else :value.sync="title" class="todoItem__editInput" @onEnter="_handleCompleteEditing" />
    <todo-icon-button class="todoItem__remove" @onClick="_onRemoveButtonClick">
      <font-awesome-icon icon="times" fixed-width />
    </todo-icon-button>
  </li>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import Checkbox from "~/components/input/Checkbox.vue";
import Input from "~/components/input/Input.vue";
import IconButton from "~/components/button/IconButton.vue";

export default {
  components: {
    TodoCheckBox: Checkbox,
    TodoIconButton: IconButton,
    TodoInput: Input,
    FontAwesomeIcon,
  },
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: false,
      title: this.todo.title,
    };
  },
  computed: {
    computedClassName() {
      return {
        todoItem: true,
        "todoItem--completed": this.todo.completed,
        "todoItem--editing": this.editing,
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
    _handleDoubleClick() {
      this.editing = true;
    },
    _handleCompleteEditing() {
      this.editing = false;
      this.$emit("onEditTitle", this.todo.id, this.title);
      this.title = this.todo.title;
    },
  },
};
</script>

<style lang="scss" scoped>
.todoItem {
  position: relative;
  border-bottom: 1px solid #ededed;
  padding: 2rem 1.5rem;
  font-size: 2rem;
  display: grid;
  align-items: center;
  grid-template-columns: min-content 1fr min-content;
  grid-column-gap: 1.5rem;

  &--editing {
    padding: 0 1.5rem;
  }

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

  &__remove {
    color: rgba(175, 47, 47, 1);
    opacity: 0;
    transition: opacity 0.25s ease-in-out;
  }

  &__editInput {
    box-shadow: none;
    border: var(--line);
    font-size: 2rem;
    padding: 2rem;
  }
}
</style>
