<template>
  <ul class="todoList">
    <slot />
  </ul>
</template>

<style lang="scss" scoped>
.todoList {
  border-top: 1px solid #ededed;
  list-style: none;
  overflow-y: auto;
}
</style>
