<template>
  <container>
    <todo-header title="Todos" />
    <main :class="mainClassName">
      <div class="addTodo">
        <todo-input :value.sync="text" :class="addTodoInputClass" placeholder="What needs to be done?" @onEnter="_handleEnter" @onDoubleClick="_handleDoubleClick" />
        <todo-icon-button class="toggleAll">
          <font-awesome-icon icon="chevron-down" fixed-width />
        </todo-icon-button>
      </div>
      <todo-list :todos="todos" @onToggleTodo="_handleToggleTodo" @onRemoveTodo="_handleRemoveTodo" />
      <footer v-if="todos.length > 0" class="footer">
        <span class="todoCount">{{ activeTodosCount }} items left</span>
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
      addTodoInputClass: {
        addTodo__input: true,
        "addTodo__input--withList": true,
      },
      abortController: null,
    };
  },
  computed: {
    mainClassName() {
      return {
        main: true,
        "main--withList": this.todos.length > 0,
      };
    },
    activeTodosCount() {
      return this.todos.filter(todo => !todo.completed).length;
    },
  },
  mounted() {
    this.abortController = new AbortController();
  },
  beforeDestroy() {
    this.abortController.abort();
  },
  methods: {
    async _handleEnter() {
      const newTodo = await this._createNewTodo();
      if (newTodo) {
        this.todos.push(newTodo);
        this.text = "";
      }
    },
    _handleDoubleClick() {
      this._handleEnter();
    },
    async _handleToggleTodo(id) {
      const toggledTodo = await this._toggleTodo(id);
      const index = this.todos.findIndex(todo => todo.id === toggledTodo.id);
      if (index >= 0) {
        this.todos[index].completed = toggledTodo.completed;
      }
    },
    async _handleRemoveTodo(id) {
      const removedId = await this._removeTodo(id);
      if (removedId !== null) {
        this.todos = this.todos.filter(todo => todo.id !== id);
      }
    },
    async _createNewTodo() {
      const title = this.text;
      if (title) {
        const todoData = {
          title,
          completed: false,
        };
        const jsonData = JSON.stringify(todoData);
        try {
          const rawResult = await fetch(`${BASE_URL}`, {
            method: "POST",
            body: jsonData,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            signal: this.abortController.signal,
          });
          const newTodo = await rawResult.json();
          return newTodo;
        } catch (error) {
          return null;
        }
      }
    },
    async _removeTodo(id) {
      try {
        const rawResult = await fetch(`${BASE_URL}/${id}`, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          method: "DELETE",
          signal: this.abortController.signal,
        });
        return id;
      } catch (error) {
        return null;
      }
    },
    async _toggleTodo(id) {
      try {
        const togglingTodo = await this._getTodoById(id);
        if (!togglingTodo) {
          return null;
        }
        const data = JSON.stringify({
          completed: !togglingTodo.completed,
        });
        const rawResult = await fetch(`${BASE_URL}/${id}`, {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          method: "PATCH",
          body: data,
          signal: this.abortController.signal,
        });
        const toggledTodo = await rawResult.json();
        return toggledTodo;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async _getTodoById(id) {
      try {
        const rawResult = await fetch(`${BASE_URL}/${id}`, {
          signal: this.abortController.signal,
        });
        const todo = await rawResult.json();
        return todo;
      } catch (error) {
        return null;
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
}

.todoCount {
  font-size: 1.6rem;
  opacity: 0.6;
}
</style>
