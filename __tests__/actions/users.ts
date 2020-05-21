import { Process, specHelper } from "actionhero";
import { User } from "../../src/models/User";
const actionhero = new Process();
let api;

describe("Action", () => {
  describe("users", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    beforeAll(async () => {
      User.destroy({ truncate: true });
    });

    test("a user cannot be created without all the required params", async () => {
      const { error } = await specHelper.runAction("user:create");
      expect(error).toMatch(/is a required parameter for this action/);
    });

    test("a user can be created with all the required params", async () => {
      const { error, guid } = await specHelper.runAction("user:create", {
        firstName: "Mario",
        lastName: "Mario",
        email: "mario@example.com",
        password: "p@ssowrd",
      });
      expect(error).toBeFalsy();
      expect(guid).toBeTruthy();
    });

    test("a user can sign in with the proper password", async () => {
      const { error, success } = await specHelper.runAction("user:signIn", {
        email: "mario@example.com",
        password: "p@ssowrd",
      });
      expect(error).toBeFalsy();
      expect(success).toBe(true);
    });

    test("a user cannot sign in with the wrong password", async () => {
      const { error, success } = await specHelper.runAction("user:signIn", {
        email: "mario@example.com",
        password: "bad password",
      });
      expect(error).toMatch(/password do not match/);
      expect(success).toBe(false);
    });
  });
});
