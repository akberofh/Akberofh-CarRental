import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'todo',
  initialState: {
    userTodos: [],
  },
  reducers: {
    setTodos: (state, action) => {
      state.userTodos = action.payload;
    },
    addTodo: (state, action) => {
      state.userTodos.push(action.payload);
    },
    removeTodo: (state, action) => {
      state.userTodos = state.userTodos.filter(todo => todo._id !== action.payload);
    },
    updateTodo: (state, action) => {
      state.userTodos.push(action.payload);    },
  },
});

export const { setTodos, addTodo, removeTodo, updateTodo } = productSlice.actions;

export default productSlice.reducer;
