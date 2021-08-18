import Task from "./Task";

const Tasks = ({ tasks, onDelete, reminder }) => {

  return (
    <>
      {tasks.map((task) => {
        return (
          <Task task={task} key={task.id} onDelete={onDelete} reminder={reminder} />
        )
      })}
    </>
  )
}

export default Tasks;