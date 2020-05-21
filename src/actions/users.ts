import { Action } from "actionhero";
import { User } from "../models/User";

export class UserCreate extends Action {
  constructor() {
    super();
    this.name = "user:create";
    this.description = "create a user";
    this.outputExample = {};
    this.inputs = {
      firstName: { required: true },
      lastName: { required: true },
      email: { required: true },
      password: { required: true },
    };
  }

  async run({ params, response }) {
    const user = await User.create(params);
    await user.updatePassword(params.password);
    response.guid = user.guid;
  }
}

export class UserSignIn extends Action {
  constructor() {
    super();
    this.name = "user:signIn";
    this.description = "sign in as a user";
    this.outputExample = {};
    this.inputs = {
      email: { required: true },
      password: { required: true },
    };
  }

  async run({ params, response }) {
    response.success = false;

    const user = await User.findOne({ where: { email: params.email } });
    if (!user) {
      throw new Error("user not found");
    }

    const passwordMatch = await user.checkPassword(params.password);
    if (!passwordMatch) {
      throw new Error("password do not match");
    }
    response.success = true;
  }
}
