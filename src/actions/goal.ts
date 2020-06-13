import { Action } from "actionhero";
import { Goal } from "../models/Goal";

export class GetGoal extends Action {
  constructor() {
    super();
    this.name = "goal:get";
    this.description = "Get a Goal using GUID as id";
    this.inputs = {
      id: {
        required: true,
      },
    };
  }

  async run({ connection, response }) {
    const id = connection.params.id;
    const goal = await Goal.findOne({ where: { id: id } });
    if (!goal) {
      throw new Error(`Goal does not exist with id: ${id}`);
    }
    response.goal = goal;
  }
}

export class ListGoals extends Action {
  constructor() {
    super();
    this.name = "goal:list";
    this.description = "List the goals";
    this.outputExample = {};
  }

  async run({ params, response }) {
    const goals = await Goal.findAll();
    response.goals = goals;
  }
}

export class CreateGoal extends Action {
  constructor() {
    super();
    this.name = "goal:create";
    this.description = "Create a goal";
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
    const goal = await Goal.create(params);
    response.id = goal.id;
  }
}

export class UpdateGoal extends Action {
  constructor() {
    super();
    this.name = "goal:update";
    this.description = "Update a goal";
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
    if (!newTitle && newDoneStatus === undefined) {
      throw new Error("No update needed");
    }
    const [numberOfUpdatedRows, goals] = await Goal.update(
      { title: newTitle, done: newDoneStatus },
      {
        where: {
          id: connection.params.id,
        },
        returning: true,
      }
    );
    if (numberOfUpdatedRows < 1) {
      throw new Error(`No such goal exists`);
    }
    response.goal = goals[0];
  }
}

export class DeleteGoal extends Action {
  constructor() {
    super();
    this.name = "goal:delete";
    this.description = "Delete a Goal";
  }

  async run({ connection, response }) {
    const deleteRowCount = await Goal.destroy({
      where: {
        id: connection.params.id,
      },
    });

    if (deleteRowCount < 1) {
      throw new Error(`No such goal exists with id ${connection.params.id}`);
    }

    response.message = "Goal Deleted Successfully";
  }
}
