import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import "./App.css";
import AddTask from "./components/AddTasks/AddTasks";
import { doLogin } from "./redux/thunks";
import * as thunks from "./redux/thunks";
import useCustomSelector from "./CustomHooks/useCustomSelector";
import ViewTasks from "./components/ViewTasks/ViewTasks";
import EditTasks from "./components/EditTasks";

function App() {
  const dispatch = useDispatch();

  const [tasks, userData] = useCustomSelector("tasks", "userData");

  const [taskModelState, setTaskModelState] = useState("add");

  useEffect(() => {
    dispatch(
      doLogin({
        email: "good@test3.com",
        password: "12345678",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    userData.user_id && dispatch(thunks.fetchAllTasks());
  }, [userData.user_id, dispatch]);

  const closeTaskModel = () => setTaskModelState(null);
  const openEditTaskModel = () => setTaskModelState("edit");
  const openAddTaskModel = () => setTaskModelState("add");

  return (
    <div className="container">
      <div className="tasks">
        <p>TASKS {tasks.length}</p>
        <button
          disabled={taskModelState === "add"}
          className="plus"
          onClick={() => setTaskModelState("add")}
        >
          +
        </button>
      </div>
      <ViewTasks openEditTaskModel={openEditTaskModel} />
      {taskModelState === "add" && (
        <AddTask
          toggleTaskModel={closeTaskModel}
          openAddTaskModel={openAddTaskModel}
        />
      )}
      {taskModelState === "edit" && (
        <EditTasks
          toggleTaskModel={closeTaskModel}
          openAddTaskModel={openAddTaskModel}
        />
      )}
    </div>
  );
}

export default App;
