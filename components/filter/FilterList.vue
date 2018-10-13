<template>
  <ul class="filterList">
    <slot />
  </ul>
</template>

<style lang="scss" scoped>
.filterList {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 1rem;
}
</style>
