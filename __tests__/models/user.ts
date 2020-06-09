import { Process } from "actionhero";
import { User } from "./../../src/models/User";
const actionhero = new Process();

let api;

describe("Model", () => {
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

    test("users are unique by email address", async () => {
      const user = await User.create({
        firstName: "Mario",
        lastName: "Mario",
        email: "mario@example.com",
      });

      await expect(
        User.create({
          firstName: "Mario Again",
          lastName: "Mario Again",
          email: "mario@example.com",
        })
      ).rejects.toThrow(/Validation error/);

      await user.destroy();
    });

    test("user passwords can be validate", async () => {
      const user = await User.create({
        firstName: "Mario",
        lastName: "Mario",
        email: "mario@example.com",
      });

      await user.updatePassword("p@ssw0rd");
      let response = await user.checkPassword("p@ssw0rd");
      expect(response).toBe(true);

      response = await user.checkPassword("wrong password");
      expect(response).toBe(false);

      await user.destroy();
    });
  });
});
