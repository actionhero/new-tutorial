import { Process } from "actionhero";
import { Goal } from "../../src/models/Goal";
const actionhero = new Process();

let api;

describe("Model", () => {
  describe("Goal", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    beforeAll(async () => {
      Goal.destroy({ truncate: true });
    });

    test("New Goal gets created", async () => {
      const goal = await Goal.create({
        title: "Test Goal Creation",
      });
      expect(goal).toHaveProperty("title");
      expect(goal).toHaveProperty("id");
      expect(goal).toHaveProperty("done");
      expect(goal.title).toBe("Test Goal Creation");
      expect(goal.done).toBe(false);
    });
  });
});
