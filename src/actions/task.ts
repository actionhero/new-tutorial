import { Action } from "actionhero";
import { Task } from "../models/Task";

export class GetTask extends Action {
  constructor() {
    super();
    this.name = "task:get";
    this.description = "Get a Task using GUID as taskId";
    this.inputs = {
      taskId: {
        required: true,
      },
    };
  }

  async run({ connection, response }) {
    const taskId = connection.params.taskId;
    const task = await Task.findOne({ where: { guid: taskId } });
    if (!task) {
      throw new Error(`Task does not exist with taskId: ${taskId}`);
    }
    response.task = task;
  }
}

export class ListTasks extends Action {
  constructor() {
    super();
    this.name = "task:list";
    this.description = "List the tasks";
    this.outputExample = {};
  }

  async run({ params, response }) {
    const tasks = await Task.findAll();
    response.tasks = tasks;
  }
}

export class CreateTask extends Action {
  constructor() {
    super();
    this.name = "task:create";
    this.description = "Create a task";
    this.inputs = {
      title: {
        required: true,
        validator: (param, connection, actionTemplate) => {
          if (typeof param !== "string") {
            throw new Error(
              `Expected type of title to be string got ${typeof param}`
            );
          }
        },
      },
    };
  }

  async run({ params, response }) {
    const task = await Task.create(params);
    response.taskId = task.guid;
  }
}

export class UpdateTask extends Action {
  constructor() {
    super();
    this.name = "task:update";
    this.description = "Update a task";
    this.inputs = {
      title: {
        required: false,
        validator: (param) => {
          if (typeof param !== "string") {
            throw new Error(
              `Expected type of title to be string, got ${typeof param}`
            );
          }
        },
      },
      done: {
        required: false,
        validator: (param) => {
          if (typeof param !== "boolean") {
            throw new Error(
              `Expected type of done to be boolean, got ${typeof param}`
            );
          }
        },
      },
    };
  }

  async run({ connection, params, response }) {
    // Why is connection required, then why not use connection.params everywhere?
    const newTitle = params.title;
    const newDoneStatus = params.done;
    console.log(params);
    if (!newTitle && newDoneStatus === undefined) {
      throw new Error("No update needed");
    }
    const [numberOfUpdatedRows, tasks] = await Task.update(
      { title: newTitle, done: newDoneStatus },
      {
        where: {
          guid: connection.params.taskId,
        },
        returning: true,
      }
    );
    if (numberOfUpdatedRows < 1) {
      throw new Error(`No such task exists`);
    }
    response.task = tasks[0];
  }
}

export class DeleteAction extends Action {
  constructor() {
    super();
    this.name = "task:delete";
    this.description = "Delete a Task";
  }

  async run({ connection, response }) {
    const deleteRowCount = await Task.destroy({
      where: {
        guid: connection.params.taskId,
      },
    });

    if (deleteRowCount < 1) {
      throw new Error(
        `No such task exists with taskId ${connection.params.taskId}`
      );
    }

    response.message = "Task Deleted Successfully";
  }
}
