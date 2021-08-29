import { addMinutes, endOfDay, format, isAfter, isValid } from "date-fns";
import { startOfDay } from "date-fns/esm";
import React, { useEffect, useMemo, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch } from "react-redux";
import useCustomSelector from "../CustomHooks/useCustomSelector";
import { resetTaskState } from "../redux/actions";
import { deleteTask } from "../redux/thunks";
import "./AddOrEditTask.css";

const timeOptions = (interval = 30) => {
  const options = [];

  let time = startOfDay(new Date());
  const endTime = endOfDay(new Date());

  while (isAfter(endTime, time)) {
    const formattedTime = format(time, "HH:mm");
    const [hours, minutes] = formattedTime.split(":");

    options.push({
      value: hours * 60 * 60 + minutes * 60,
      label: format(time, "hh:mm aa"),
    });
    time = addMinutes(time, interval);
  }

  return options;
};

const AddOrEditTask = ({
  toggleTaskModel,
  actionCall,
  edit,
  openAddTaskModel,
}) => {
  //wrapped options fetching in memo because to avoid computation of options on every render
  const options = useMemo(timeOptions, []);
  const dispatch = useDispatch();

  const [userData, isLoading, task] = useCustomSelector(
    "userData",
    "isLoading",
    "task"
  );

  const [taskDetails, setTaskDetails] = useState(task);

  const handleChange = (event, value = undefined) =>
    setTaskDetails((previousState) => ({
      ...previousState,
      [event.target.name]: value ? value : event.target.value,
    }));

  useEffect(() => {
    setTaskDetails(task);
  }, [task]);

  const resetState = () => {
    openAddTaskModel();
    dispatch(resetTaskState());
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const timeZoneinSeconds = -new Date().getTimezoneOffset() * 60;

    const payload = {
      ...taskDetails,
      assigned_user: userData.user_id,
      task_time: Number(taskDetails.task_time),
      time_zone: timeZoneinSeconds,
    };

    dispatch(actionCall(payload)).then(() => resetState());
  };

  return (
    <form onSubmit={handleSubmit} className="tasks-container">
      <div className="row">
        <label
          htmlFor="taskDescription"
          style={{ display: "block", padding: "0.25rem 0" }}
        >
          Task Description
        </label>
        <input
          autoFocus
          disabled={isLoading}
          onChange={handleChange}
          name="task_msg"
          value={taskDetails.task_msg}
          id="taskDescription"
          className="input"
          required
        />
      </div>
      <div className="row date-time">
        <div>
          <label
            htmlFor="date"
            style={{ display: "block", padding: "0.25rem 0" }}
          >
            Date
          </label>
          <input
            disabled={isLoading}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (isValid(date)) {
                const formattedDate = format(date, "yyyy-MM-dd");
                handleChange(e, formattedDate);
              }
            }}
            type="date"
            id="date"
            required
            name="task_date"
            value={taskDetails.task_date}
            className="date-picker"
          />
        </div>
        <div style={{ width: "100%" }}>
          <label
            htmlFor="time"
            style={{ display: "block", padding: "0.25rem 0" }}
          >
            Time
          </label>

          <select
            value={taskDetails.task_time}
            name="task_time"
            className="input time-input"
            disabled={isLoading}
            id="time"
            required
            onChange={handleChange}
          >
            <option disabled hidden />
            {options.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        <label
          htmlFor="assignuser"
          style={{ display: "block", padding: "0.25rem 0" }}
        >
          Assign User
        </label>
        <select disabled={isLoading} required className="input time-input">
          <option>{userData.name}</option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: edit ? "space-between" : "flex-end",
        }}
      >
        {edit && (
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              const shouldDelete = window.confirm(
                "Are you sure you want to delete?"
              );

              if (shouldDelete) {
                dispatch(deleteTask(taskDetails.id)).then(() => {
                  resetState();
                });
              }
            }}
          >
            <AiFillDelete />
          </button>
        )}
        <div className="action-buttons">
          <button
            disabled={isLoading}
            type="button"
            className="cancel"
            onClick={toggleTaskModel}
          >
            Cancel
          </button>
          <button disabled={isLoading} type="submit" className="save">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddOrEditTask;
