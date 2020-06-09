import { Process, specHelper } from "actionhero";
const actionhero = new Process();
let api;

describe("Action", () => {
  describe("Get Task", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("Should throw an error if taskId is not passed to get task", async () => {
      const response = await specHelper.runAction("task:get");
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(
        "Error: taskId is a required parameter for this action"
      );
    });

    test("Should throw an error when task with taskId does not exist", async () => {
      const taskId = "5ab0c467-eb53-4288-9390-51f4d5f1f211";
      const response = await specHelper.runAction("task:get", {
        taskId: taskId,
      });
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(
        `Error: Task does not exist with taskId: ${taskId}`
      );
    });

    test("Should response with task object when task with passed GUID exists", async () => {
      const newTaskTitle = "Cure Cancer";
      const { taskId } = await specHelper.runAction("task:create", {
        title: newTaskTitle,
      });
      expect(taskId).toBeTruthy();
      const response = await specHelper.runAction("task:get", {
        taskId: taskId,
      });
      expect(response.task).toBeTruthy();
      expect(response.error).toBeFalsy();
      expect(response.task.guid).toBe(taskId);
      expect(response.task.title).toBe(newTaskTitle);
      expect(response.task.done).toBe(false);
    });
  });

  describe("Create Task", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("should not create a task without title param", async () => {
      const response = await specHelper.runAction("task:create");
      expect(response.taskId).toBeFalsy();
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(
        "Error: title is a required parameter for this action"
      );
    });

    test("should not create a task when the title is not of type string", async () => {
      const response = await specHelper.runAction("task:create", { title: 1 });
      expect(response.taskId).toBeFalsy();
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(
        "Error: Expected type of title to be string got number"
      );
    });

    test("should add a new task to tasks", async () => {
      const taskResponse1 = await specHelper.runAction("task:list");
      const oldTaskCount = taskResponse1.tasks.length;
      await specHelper.runAction("task:create", {
        title: "Visit Jurassic Park.",
      });
      const taskResponse2 = await specHelper.runAction("task:list");
      const totalTasksCount = taskResponse2.tasks.length;
      expect(totalTasksCount).toBe(oldTaskCount + 1);
    });

    test("should return a guid as taskId for new task created", async () => {
      const { taskId } = await specHelper.runAction("task:create", {
        title: "Time Travel",
      });
      const isGUID = taskId.match(
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
      );
      expect(isGUID).toBeTruthy();
    });

    test("should have 'done' set to false by default for the new task", async () => {
      const { taskId } = await specHelper.runAction("task:create", {
        title: "Visit North Pole",
      });
      const { task } = await specHelper.runAction("task:get", {
        taskId: taskId,
      });
      expect(task.done).toBe(false);
    });

    test("should create new task with 'done' set to false even if 'done' is sent as true in the params", async () => {
      const { taskId } = await specHelper.runAction("task:create", {
        title: "Meet Mickey Mouse",
        done: true,
      });
      const { task } = await specHelper.runAction("task:get", {
        taskId: taskId,
      });
      expect(task.done).toBe(false);
    });
  });

  describe("Task List", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("should return a task response object", async () => {
      const { tasks } = await specHelper.runAction("task:list");
      expect(tasks).toBeDefined();
    });

    test("should return a task object which is of type array", async () => {
      const { tasks } = await specHelper.runAction("task:list");
      expect(Array.isArray(tasks)).toBe(true);
    });

    test("should return tasks list of length > 0", async () => {
      await specHelper.runAction("task:create", { title: "Sing on Stage" });
      const { tasks } = await specHelper.runAction("task:list");
      expect(tasks.length).toBeGreaterThan(0);
    });
  });

  describe("Update Task", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("Should update title and done status", async () => {
      const { taskId } = await specHelper.runAction("task:create", {
        title: "Fight Tyson",
      });
      const newTitle = "Fight Muhammad Ali";
      const response = await specHelper.runAction("task:update", {
        title: newTitle,
        done: true,
        taskId: taskId,
      });
      expect(response.task).toBeDefined();
      expect(response.task.title).toBe(newTitle);
      expect(response.task.done).toBe(true);
    });

    test("Should update a single parameter", async () => {
      const { taskId } = await specHelper.runAction("task:create", {
        title: "Deploy Actionhero API",
      });
      const newDoneStatus = false;
      const response = await specHelper.runAction("task:update", {
        done: newDoneStatus,
        taskId: taskId,
      });
      expect(response.task).toBeDefined();
      expect(response.task.done).toBe(newDoneStatus);

      const newTitle = "Watch NodeConf EU";
      const response2 = await specHelper.runAction("task:update", {
        title: newTitle,
        taskId: taskId,
      });
      expect(response2.task).toBeDefined();
      expect(response2.task.title).toBe(newTitle);
    });

    test("Should not update task", async () => {
      const { taskId } = await specHelper.runAction("task:create", {
        title: "Defeat Thanos",
      });
      const response = await specHelper.runAction("task:update", {
        taskId: taskId,
      });
      expect(response.error).toBe("Error: No update needed");
    });

    test("Should throw Error when title or done type is incorrect", async () => {
      const { taskId } = await specHelper.runAction("task:create", {
        title: "Build Rome",
      });

      const newTitle = 1;
      const response = await specHelper.runAction("task:update", {
        title: newTitle,
        taskId: taskId,
      });
      expect(response.task).toBeUndefined();
      expect(response.error).toBe(
        "Error: Expected type of title to be string, got number"
      );

      const newDoneStatus = "Bad Status";
      const response2 = await specHelper.runAction("task:update", {
        done: newDoneStatus,
        taskId: taskId,
      });
      expect(response2.task).toBeUndefined();
      expect(response2.error).toBe(
        "Error: Expected type of done to be boolean, got string"
      );
    });
  });

  describe("Delete Task", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("Should throw error if task with taskId does not exist", async () => {
      const taskId = "2d901d96-2244-421d-9f91-38f25f8d565d";
      const { error } = await specHelper.runAction("task:delete", {
        taskId: taskId,
      });
      expect(error).toBeDefined();
      expect(error).toBe(`Error: No such task exists with taskId ${taskId}`);
    });

    test("Should remove from database the particular task", async () => {
      const { taskId } = await specHelper.runAction("task:create", {
        title: "Deploy Actionhero API",
      });
      const { message } = await specHelper.runAction("task:delete", {
        taskId: taskId,
      });
      expect(message).toBe("Task Deleted Successfully");

      const response = await specHelper.runAction("task:get", {
        taskId: taskId,
      });
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(
        `Error: Task does not exist with taskId: ${taskId}`
      );
    });
  });
});
