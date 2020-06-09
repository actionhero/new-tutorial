import { Process } from "actionhero";
import { Task } from "./../../src/models/Task";
const actionhero = new Process();

let api;

describe("Model", () => {
  describe("task", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    beforeAll(async () => {
      Task.destroy({ truncate: true });
    });

    test("New Task gets created", async () => {
      const task = await Task.create({
        title: "Test Task",
      });
      expect(task).toHaveProperty("title");
      expect(task).toHaveProperty("guid");
      expect(task).toHaveProperty("done");
      expect(task.title).toBe("Test Task");
      expect(task.done).toBe(false);
    });
  });
});
