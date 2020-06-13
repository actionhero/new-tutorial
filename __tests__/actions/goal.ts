import { Process, specHelper } from "actionhero";
const actionhero = new Process();
let api;

describe("Action", () => {
  describe("Get Goal", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("Should throw an error if id is not passed to get goal", async () => {
      const response = await specHelper.runAction("goal:get");
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(
        "Error: id is a required parameter for this action"
      );
    });

    test("Should throw an error when goal with id does not exist", async () => {
      const id = "5ab0c467-eb53-4288-9390-51f4d5f1f211";
      const response = await specHelper.runAction("goal:get", {
        id: id,
      });
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(`Error: Goal does not exist with id: ${id}`);
    });

    test("Should give a response with goal object when goal with passed GUID exists", async () => {
      const newGoalTitle = "Cure Cancer";
      const { id } = await specHelper.runAction("goal:create", {
        title: newGoalTitle,
      });
      expect(id).toBeTruthy();
      const response = await specHelper.runAction("goal:get", {
        id: id,
      });
      expect(response.goal).toBeTruthy();
      expect(response.error).toBeFalsy();
      expect(response.goal.id).toBe(id);
      expect(response.goal.title).toBe(newGoalTitle);
      expect(response.goal.done).toBe(false);
    });
  });

  describe("Create a Goal", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("should not create a goal without title param", async () => {
      const response = await specHelper.runAction("goal:create");
      expect(response.id).toBeFalsy();
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(
        "Error: title is a required parameter for this action"
      );
    });

    test("should not create a goal when the title is not of type string", async () => {
      const response = await specHelper.runAction("goal:create", { title: 1 });
      expect(response.id).toBeFalsy();
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(
        "Error: Expected type of title to be string got number"
      );
    });

    test("should add a new goal to goals", async () => {
      const response1 = await specHelper.runAction("goal:list");
      const oldGoalsCount = response1.goals.length;
      await specHelper.runAction("goal:create", {
        title: "Visit Jurassic Park.",
      });
      const response2 = await specHelper.runAction("goal:list");
      const newGoalsCount = response2.goals.length;
      expect(newGoalsCount).toBe(oldGoalsCount + 1);
    });

    test("should return a guid as id for new goal created", async () => {
      const { id } = await specHelper.runAction("goal:create", {
        title: "Time Travel",
      });
      const isGUID = id.match(
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
      );
      expect(isGUID).toBeTruthy();
    });

    test("should have 'done' set to false by default for the new goal", async () => {
      const { id } = await specHelper.runAction("goal:create", {
        title: "Visit North Pole",
      });
      const { goal } = await specHelper.runAction("goal:get", {
        id: id,
      });
      expect(goal.done).toBe(false);
    });

    test("should create new goal with 'done' set to false even if 'done' is sent as true in the params", async () => {
      const { id } = await specHelper.runAction("goal:create", {
        title: "Meet Mickey Mouse",
        done: true,
      });
      const { goal } = await specHelper.runAction("goal:get", {
        id: id,
      });
      expect(goal.done).toBe(false);
    });
  });

  describe("Goals List", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("should return a goal response object", async () => {
      const { goals } = await specHelper.runAction("goal:list");
      expect(goals).toBeDefined();
    });

    test("should return a goals object which is of type array", async () => {
      const { goals } = await specHelper.runAction("goal:list");
      expect(Array.isArray(goals)).toBe(true);
    });

    test("should return goals list of length > 0", async () => {
      await specHelper.runAction("goal:create", { title: "Sing on Stage" });
      const { goals } = await specHelper.runAction("goal:list");
      expect(goals.length).toBeGreaterThan(0);
    });
  });

  describe("Update Goal", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("Should update title and done status", async () => {
      const { id } = await specHelper.runAction("goal:create", {
        title: "Fight Tyson",
      });
      const newTitle = "Fight Muhammad Ali";
      const response = await specHelper.runAction("goal:update", {
        title: newTitle,
        done: true,
        id: id,
      });
      expect(response.goal).toBeDefined();
      expect(response.goal.title).toBe(newTitle);
      expect(response.goal.done).toBe(true);
    });

    test("Should update a single parameter", async () => {
      const { id } = await specHelper.runAction("goal:create", {
        title: "Deploy Actionhero API",
      });
      const newDoneStatus = false;
      const response = await specHelper.runAction("goal:update", {
        done: newDoneStatus,
        id: id,
      });
      expect(response.goal).toBeDefined();
      expect(response.goal.done).toBe(newDoneStatus);

      const newTitle = "Watch NodeConf EU";
      const response2 = await specHelper.runAction("goal:update", {
        title: newTitle,
        id: id,
      });
      expect(response2.goal).toBeDefined();
      expect(response2.goal.title).toBe(newTitle);
    });

    test("Should not update goal", async () => {
      const { id } = await specHelper.runAction("goal:create", {
        title: "Defeat Thanos",
      });
      const response = await specHelper.runAction("goal:update", {
        id: id,
      });
      expect(response.error).toBe("Error: No update needed");
    });

    test("Should throw Error when title or done type is incorrect", async () => {
      const { id } = await specHelper.runAction("goal:create", {
        title: "Build Rome",
      });

      const newTitle = 1;
      const response = await specHelper.runAction("goal:update", {
        title: newTitle,
        id: id,
      });
      expect(response.goal).toBeUndefined();
      expect(response.error).toBe(
        "Error: Expected type of title to be string, got number"
      );

      const newDoneStatus = "Bad Status";
      const response2 = await specHelper.runAction("goal:update", {
        done: newDoneStatus,
        id: id,
      });
      expect(response2.goal).toBeUndefined();
      expect(response2.error).toBe(
        "Error: Expected type of done to be boolean, got string"
      );
    });
  });

  describe("Delete Goal", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("Should throw error if goal with id does not exist", async () => {
      const id = "2d901d96-2244-421d-9f91-38f25f8d565d";
      const { error } = await specHelper.runAction("goal:delete", {
        id: id,
      });
      expect(error).toBeDefined();
      expect(error).toBe(`Error: No such goal exists with id ${id}`);
    });

    test("Should remove from database the particular goal", async () => {
      const { id } = await specHelper.runAction("goal:create", {
        title: "Deploy Actionhero API",
      });
      const { message } = await specHelper.runAction("goal:delete", {
        id: id,
      });
      expect(message).toBe("Goal Deleted Successfully");

      const response = await specHelper.runAction("goal:get", {
        id: id,
      });
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(`Error: Goal does not exist with id: ${id}`);
    });
  });
});
