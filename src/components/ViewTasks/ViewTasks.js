import React from "react";
import useCustomSelector from "../../CustomHooks/useCustomSelector";
import "./ViewTasks.css";
import { AiFillEdit } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setTask } from "../../redux/actions";
import { addMinutes, endOfDay, format, isAfter, startOfDay } from "date-fns";

const secondsToTime = (seconds, interval = 30) => {
  const options = {};

  let time = startOfDay(new Date());
  const endTime = endOfDay(new Date());

  while (isAfter(endTime, time)) {
    const formattedTime = format(time, "HH:mm");
    const [hours, minutes] = formattedTime.split(":");
    const value = hours * 60 * 60 + minutes * 60;
    const label = format(time, "hh:mm aa");
    options[value] = label;
    time = addMinutes(time, interval);
  }

  return options[seconds];
};

const ViewTasks = ({ openEditTaskModel }) => {
  const [tasks] = useCustomSelector("tasks");
  const dispatch = useDispatch();

  return tasks.map((task) => (
    <div
      className="view-tasks-container"
      key={task.id}
      style={{ padding: "0.75rem 0.5rem" }}
    >
      <div>
        <strong style={{ display: "block", padding: "0.5rem 0 0.25rem 0" }}>
          {task.task_msg}
        </strong>
        <p className="task-time">
          {task.task_date} {secondsToTime(task.task_time)}
        </p>
      </div>
      <div>
        <button
          className="edit"
          onClick={() => {
            dispatch(
              setTask({
                task_time: task.task_time,
                task_msg: task.task_msg,
                task_date: task.task_date,
                is_completed: task.is_completed,
                id: task.id,
              })
            );
            openEditTaskModel();
          }}
        >
          <AiFillEdit style={{ color: "gray" }} />
        </button>
      </div>
    </div>
  ));
};

export default ViewTasks;
