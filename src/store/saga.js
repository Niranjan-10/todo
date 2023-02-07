import { fork } from "redux-saga/effects";
import TodoSaga from "../components/todo/todo_saga";

function* rootSaga() {
  yield fork(TodoSaga);
}

export default rootSaga;
