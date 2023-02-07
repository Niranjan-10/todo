import { createSlice } from "@reduxjs/toolkit";

export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todoList: [],
    completedTodoList: [],
    isLoading: true,
    isError: false,
  },
  reducers: {
    updateTodo: (state, payload) => {
      state.isLoading = true;
    },
    updateTodoSuccess: (state, payload) => {
      state.isLoading = false;
    },
    updateTodoFailed: (state, payload) => {
      state.isLoading = false;
    },
    getTodo: (state, payload) => {
      state.isLoading = true;
    },
    deleteTodo: (state, payload) => {
      state.isLoading = true;
    },
    deleteTodoSuccess: (state, payload) => {
      state.isLoading = false;
    },
    deleteTodoFailed: (state, payload) => {
      state.isLoading = false;
    },
    getTodoSuccess: (state, data) => {
      state.isLoading = false;

      const completedList = data.payload
        .slice(0, 15)
        .filter((item) => item.completed);
      const inCompleteList = data.payload
        .slice(0, 15)
        .filter((item) => !item.completed);
      state.todoList = [...inCompleteList];
      state.completedTodoList = [...completedList];
    },
    getTodoFailed: (state, payload) => {
      state.isLoading = false;
      state.isError = true;
    },
    addTodo: (state, payload) => {
      state.isLoading = true;
    },
    addTodoSuccess: (state, payload) => {
      state.isLoading = false;
    },
    addTodoFailed: (state, payload) => {
      state.isError = true;
    },
  },
});

export const {
  addTodo,
  updateTodo,
  getTodo,
  deleteTodo,
  getTodoSuccess,
  getTodoFailed,
  addTodoError,
  addTodoSuccess,
  addTodoFailed,
  updateTodoFailed,
  updateTodoSuccess,
  deleteTodoSuccess,
  deleteTodoFailed,
} = todoSlice.actions;

export default todoSlice.reducer;
