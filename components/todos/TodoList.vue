<template>
  <ul class="todoList">
    <todo-item v-for="todo in todos" :todo="todo" :key="todo.id" @onToggle="_onToggle" @onRemove="_onRemove" />
  </ul>
</template>

<script>
import TodoItem from "~/components/todos/TodoItem.vue";

export default {
  components: {
    TodoItem,
  },
  props: {
    todos: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    _onToggle(id) {
      this.$emit("onToggleTodo", id);
    },
    _onRemove(id) {
      this.$emit("onRemoveTodo", id);
    },
  },
};
</script>

<style lang="scss" scoped>
.todoList {
  border-top: 1px solid #ededed;
  list-style: none;
  overflow-y: auto;
}
</style>
