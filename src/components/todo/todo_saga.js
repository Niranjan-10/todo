import { call, takeEvery, put } from "redux-saga/effects";
import axios from "axios";
import {
  addTodo,
  addTodoFailed,
  addTodoSuccess,
  deleteTodo,
  deleteTodoFailed,
  deleteTodoSuccess,
  getTodo,
  getTodoFailed,
  getTodoSuccess,
  updateTodo,
  updateTodoFailed,
  updateTodoSuccess,
} from "./todo_slice";
import { notification } from "antd";

let callAPI = async ({ url, method, data }) => {
  return await axios({
    url,
    method,
    data,
  });
};

function* fetchTodo(action) {
  try {
    let response = yield call(() =>
      callAPI({
        url: "https://jsonplaceholder.typicode.com/todos",
        method: "get",
      })
    );

    let { data } = response;

    yield put(getTodoSuccess(data));
  } catch (e) {
    yield put(getTodoFailed("Can not fetch users"));
  }
}

function* addNewTodo(action) {
  try {
    let response = yield call(() =>
      callAPI({
        url: "https://jsonplaceholder.typicode.com/todos",
        method: "post",
        data: action.payload,
      })
    );

    if (response.status === 201) {
      notification.success({ message: "Todo Added" });
      yield put(addTodoSuccess());
      yield put(getTodo());
    } else {
      notification.error({ message: "Can not add todo" });
      yield put(addTodoFailed());
    }
  } catch (e) {
    notification.error({ message: "Can not add todo" });
    yield put(addTodoFailed());
  }
}

function* updateExistingTodo(action) {
  try {
    let response = yield call(() =>
      callAPI({
        url: `https://jsonplaceholder.typicode.com/todos/${action.payload.userId}`,
        method: "put",
        data: action.payload,
      })
    );

    if (response.status === 200) {
      notification.success({ message: "Updated todo" });
      yield put(updateTodoSuccess());
      yield put(getTodo());
    } else {
      yield put(updateTodoFailed({ message: "Can not update todo" }));
    }
  } catch (e) {
    notification.error({ message: "Can not update todo" });
    yield put(updateTodoFailed());
  }
}

function* deleteCurrentTodo(action) {
  try {
    let response = yield call(() =>
      callAPI({
        url: `https://jsonplaceholder.typicode.com/todos/${action.payload.id}`,
        method: "delete",
      })
    );

    if (response.status === 200) {
      notification.success({ message: "Todo deleted" });
      yield put(deleteTodoSuccess());
      yield put(getTodo());
    } else {
      notification.error({ message: "Can not delete todo" });
      yield put(deleteTodoFailed());
    }
  } catch (e) {
    notification.error({ message: "Can not delete todo" });
    yield put(deleteTodoFailed());
  }
}

export default function* TodoSaga() {
  yield takeEvery(getTodo.type, fetchTodo);
  yield takeEvery(addTodo.type, addNewTodo);
  yield takeEvery(updateTodo.type, updateExistingTodo);
  yield takeEvery(deleteTodo.type, deleteCurrentTodo);
}
