import fetch from "isomorphic-unfetch";

export default class TodosService {
  BASE_URL = "http://localhost:8080/todos";

  constructor(abortController) {
    this.abortController = abortController;
  }

  async createNewTodo(title) {
    if (title) {
      const todoData = {
        title,
        completed: false,
      };
      const jsonData = JSON.stringify(todoData);
      try {
        const rawResult = await fetch(`${this.BASE_URL}`, {
          method: "POST",
          body: jsonData,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          signal: this.abortController.signal,
        });
        return await rawResult.json();
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  async getTodos(filter = "all") {
    try {
      let query = "";
      console.log(filter);
      if (filter !== "all") {
        query = `?completed=${filter === "completed" ? "true" : "false"}`;
      }
      const rawResult = await fetch(`${this.BASE_URL}${query}`, {
        signal: this.abortController.signal,
      });
      return await rawResult.json();
    } catch (error) {
      return null;
    }
  }

  async removeTodo(id) {
    try {
      await fetch(`${this.BASE_URL}/${id}`, {
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
  }

  async getTodoById(id) {
    try {
      const rawResult = await fetch(`${this.BASE_URL}/${id}`, {
        signal: this.abortController.signal,
      });
      return await rawResult.json();
    } catch (error) {
      return null;
    }
  }

  async toggleTodo(id) {
    try {
      const togglingTodo = await this.getTodoById(id);
      if (!togglingTodo) {
        return null;
      }
      const data = JSON.stringify({
        completed: !togglingTodo.completed,
      });
      const rawResult = await fetch(`${this.BASE_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        method: "PATCH",
        body: data,
        signal: this.abortController.signal,
      });
      return await rawResult.json();
    } catch (error) {
      return null;
    }
  }

  async updateTodoTitle(id, title) {
    try {
      const updatingTodo = await this.getTodoById(id);
      if (!updatingTodo) {
        return null;
      }
      const data = JSON.stringify({
        title,
      });
      const rawResult = await fetch(`${this.BASE_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        method: "PATCH",
        body: data,
        signal: this.abortController.signal,
      });
      return await rawResult.json();
    } catch (error) {
      return null;
    }
  }
}
