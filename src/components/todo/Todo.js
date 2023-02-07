import { Button, Input, Modal, notification, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, deleteTodo, getTodo, updateTodo } from "./todo_slice";

const Todo = () => {
  // All the subscriber are declared here
  const todoList = useSelector((state) => state.todo.todoList);
  const completedTodoList = useSelector(
    (state) => state.todo.completedTodoList
  );
  const isLoading = useSelector((state) => state.todo.isLoading);

  // dispatcher to dispatch action
  const dispatch = useDispatch();

  // state variables to store information of form
  const [userId, setUserId] = useState();
  const [id, setId] = useState();
  const [title, setTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  //initial call to get todos
  useEffect(() => {
    dispatch(getTodo());
  }, []);

  //reset form is for reset values of form after submitting form
  const resetForm = () => {
    setUserId();
    setId();
    setTitle("");
    setIsCompleted(false);
  };

  // to show loader
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // to handle updated form
  const handleUpdateForm = () => {
    dispatch(
      updateTodo({
        userId: userId,
        id: id,
        title: title,
        completed: isCompleted,
      })
    );
    setUpdateModal(false);
  };

  // to handle add todo form
  const handleAddTodoForm = () => {
    dispatch(
      addTodo({
        userId: userId,
        id: id,
        title: title,
        completed: isCompleted,
      })
    );
  };

  // handle on submit form
  const handleOnSubmit = () => {
    if (!(title && id && userId)) {
      notification.error({
        message: "Please fill all the value",
      });
      return;
    }
    if (updateModal) {
      handleUpdateForm();
    } else {
      handleAddTodoForm();
    }

    setOpenModal(false);
    resetForm();
  };

  // handle Mark Done
  const handleMarkDone = (item) => {
    dispatch(
      updateTodo({
        userId: item.userId,
        id: item.id,
        title: item.title,
        completed: true,
      })
    );
  };

  // handle delete todo
  const handleDeleteTodo = (item) => {
    dispatch(
      deleteTodo({
        id: item.id,
      })
    );
  };

  return (
    <div className="m-4">
      <Button
        onClick={() => setOpenModal(true)}
        type="primary"
        shape="round"
        size="large"
        style={{
          backgroundColor: "#02B290",
        }}
      >
        Add Todo
      </Button>
      <div className="flex flex-col lg:flex-row">
        {/* to show the incomplete list */}
        <div className="flex flex-col w-screen lg:mr-2">
          <h3 className="mb-4 flex items-center justify-center text-xl font-semibold xs:mt-2">
            MY TODO
          </h3>
          <div className="max-h-[600px] overflow-y-scroll">
            {todoList?.slice(0, 50)?.map((item, index) => (
              <div
                className="p-2 my-1 bg-white shadow-sm rounded-lg border-2"
                key={item?.id}
              >
                <p className="text-black text-base mb-2">{item.title}</p>
                <div className=" flex flex-row mt-1">
                  <Button
                    onClick={() => {
                      handleMarkDone(item);
                    }}
                  >
                    Mark Done
                  </Button>
                  <Button
                    style={{
                      marginLeft: "10px",
                    }}
                    onClick={() => {
                      setOpenModal(true);
                      setUserId(item.userId);
                      setId(item.id);
                      setTitle(item.title);
                      setIsCompleted(item.completed);
                      setUpdateModal(true);
                    }}
                  >
                    Edit Todo
                  </Button>
                  <Button
                    danger
                    style={{
                      marginLeft: "10px",
                    }}
                    onClick={() => {
                      handleDeleteTodo(item);
                    }}
                  >
                    Delete Todo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* to show the completed todo list */}
        <div className="flex flex-col w-screen xs:mt-4 lg:ml-2 ">
          <h3 className="mb-4 flex items-center justify-center text-xl font-semibold">
            Completed Todo
          </h3>
          <div className="max-h-[600px] overflow-auto">
            {completedTodoList?.slice(0, 50)?.map((item, index) => (
              <div
                className="p-2 my-1 bg-white shadow-sm rounded-lg border-2"
                key={item?.id}
                onDoubleClick={() => {
                  setOpenModal(true);
                  setUserId(item.userId);
                  setId(item.id);
                  setTitle(item.title);
                  setIsCompleted(item.completed);
                  setUpdateModal(true);
                }}
              >
                <p className="text-black text-base mb-2">{item.title}</p>
                <div className=" flex flex-row mt-1">
                  <Button
                    danger
                    onClick={() => {
                      dispatch(
                        deleteTodo({
                          id: item.id,
                        })
                      );
                    }}
                  >
                    Delete Todo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal to add todo */}
      <Modal
        title="Add TODO"
        open={openModal}
        onOk={() => {
          handleOnSubmit();
        }}
        onCancel={() => {
          setOpenModal(false);
        }}
        okText={updateModal ? "Update" : "Add Todo"}
        okButtonProps={{
          type: "default",
        }}
      >
        <Input
          value={userId}
          placeholder="User ID (only Number)"
          onChange={(e) => {
            if (!isNaN(e.target.value)) {
              setUserId(e.target.value);
            }
          }}
          style={{
            marginBottom: "8px",
          }}
          disabled={updateModal}
        />
        <Input
          value={id}
          placeholder="Todo ID"
          onChange={(e) => {
            if (!isNaN(e.target.value)) {
              setId(e.target.value);
            }
          }}
          style={{
            marginBottom: "8px",
          }}
          disabled={updateModal}
        />
        <Input
          value={title}
          placeholder="Todo title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          style={{
            marginBottom: "8px",
          }}
        />
        <Select
          placeholder="select one"
          value={isCompleted ? "Completed" : "Not Completed"}
          onChange={(e) => {
            if (e === "Completed") {
              setIsCompleted(true);
            } else {
              setIsCompleted(false);
            }
          }}
          options={[
            { value: "Completed", label: "Completed" },
            { value: "Not Completed", label: "Not Completed" },
          ]}
          style={{
            marginBottom: "8px",
          }}
        />
      </Modal>
    </div>
  );
};

export default Todo;
