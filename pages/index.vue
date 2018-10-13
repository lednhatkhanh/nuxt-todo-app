<template>
  <container>
    <todo-header title="Todos" />
    <main :class="mainClassName">
      <div class="addTodo">
        <todo-input :value.sync="text" :class="addTodoInputClassName" placeholder="What needs to be done?" @onEnter="_handleEnter" @onDoubleClick="_handleDoubleClick" />
        <todo-icon-button class="toggleAll">
          <font-awesome-icon icon="chevron-down" fixed-width />
        </todo-icon-button>
      </div>
      <todo-list>
        <todo-item v-for="todo in getFilteredTodos" :todo="todo" :key="todo.id" @onToggle="_handleToggleTodo" @onRemove="_handleRemoveTodo" @onEditTitle="_handleEditTitle" />
      </todo-list>
      <footer v-if="todos.length > 0" class="footer">
        <span class="todoCount">{{ activeTodosCount }} items left</span>
        <todo-filter-list>
          <todo-filter-item :active="_getActiveFilter('all')" @onClick="_toggleFilter('all')">All</todo-filter-item>
          <todo-filter-item :active="_getActiveFilter('active')" @onClick="_toggleFilter('active')">Active</todo-filter-item>
          <todo-filter-item :active="_getActiveFilter('completed')" @onClick="_toggleFilter('completed')">Completed</todo-filter-item>
        </todo-filter-list>
      </footer>
    </main>
  </container>
</template>

<script>
import fetch from "isomorphic-unfetch";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronDown,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import IconButton from "~/components/button/IconButton.vue";
import Container from "~/components/Container.vue";
import Header from "~/components/Header.vue";
import Input from "~/components/input/Input.vue";
import TodoList from "~/components/todos/TodoList.vue";
import TodoItem from "~/components/todos/TodoItem.vue";
import FilterList from "~/components/filter/FilterList.vue";
import FilterItem from "~/components/filter/FilterItem.vue";
import TodosService from "../services/todos.js";

library.add(faChevronDown, faCheck, faTimes);

const BASE_URL = "http://localhost:8080/todos";

export default {
  components: {
    Container,
    TodoHeader: Header,
    TodoInput: Input,
    FontAwesomeIcon,
    TodoIconButton: IconButton,
    TodoList,
    TodoItem,
    TodoFilterList: FilterList,
    TodoFilterItem: FilterItem,
  },
  head() {
    return {
      title: "Todos",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "A simple todos app built with VueJS",
        },
      ],
    };
  },
  async asyncData() {
    try {
      const rawData = await fetch(`${BASE_URL}?_limit=10`);
      const todos = await rawData.json();
      return { todos: todos };
    } catch (error) {
      return { todos: [] };
    }
  },
  data() {
    return {
      text: "",
      todos: [],
      abortController: null,
      todosService: null,
      filter: "all",
    };
  },
  computed: {
    mainClassName() {
      return {
        main: true,
        "main--withList": this.todos.length > 0,
      };
    },
    addTodoInputClassName() {
      return {
        addTodo__input: true,
        "addTodo__input--withList": this.todos.length > 0,
      };
    },
    activeTodosCount() {
      return this.todos.filter(todo => !todo.completed).length;
    },
    getFilteredTodos() {
      if (this.filter === "all") {
        return this.todos;
      }
      return this.todos.filter(
        todoItem => todoItem.completed === (this.filter === "completed"),
      );
    },
  },
  mounted() {
    this.abortController = new AbortController();
    this.todosService = new TodosService(this.abortController);
  },
  beforeDestroy() {
    this.abortController.abort();
  },
  methods: {
    _getActiveFilter(value) {
      return this.filter === value;
    },
    _toggleFilter(value) {
      this.filter = value;
    },
    async _handleEnter() {
      const newTodo = await this.todosService.createNewTodo(this.text);
      if (newTodo) {
        this.todos.push(newTodo);
        this.text = "";
      }
    },
    _handleDoubleClick() {
      this._handleEnter();
    },
    async _handleToggleTodo(id) {
      const toggledTodo = await this.todosService.toggleTodo(id);
      const index = this.todos.findIndex(todo => todo.id === toggledTodo.id);
      if (index >= 0) {
        this.todos[index].completed = toggledTodo.completed;
      }
    },
    async _handleRemoveTodo(id) {
      const removedId = await this.todosService.removeTodo(id);
      if (removedId !== null) {
        this.todos = this.todos.filter(todo => todo.id !== id);
      }
    },
    async _handleEditTitle(id, title) {
      if (title) {
        const updatedTodo = await this.todosService.updateTodoTitle(id, title);
        if (updatedTodo) {
          this.todos = this.todos.map(todo => {
            if (todo.id === updatedTodo.id) {
              return {
                ...todo,
                title: updatedTodo.title,
              };
            }
            return todo;
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  margin-top: 2rem;
  background-color: #fff;

  &--withList {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
      0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
      0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }
}

.addTodo {
  padding: 0;
  position: relative;

  &__input {
    padding-left: 6rem;

    &--withList {
      box-shadow: none;
    }
  }
}

.toggleAll {
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
}

.footer {
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(2, max-content);
  align-items: center;
  justify-content: space-between;
}

.todoCount {
  font-size: 1.6rem;
  opacity: 0.6;
}
</style>
