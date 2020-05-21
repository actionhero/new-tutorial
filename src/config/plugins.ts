import * as path from "path";

export const DEFAULT = {
  plugins: (config) => {
    return {
      "ah-sequelize-plugin": {
        path: path.join(process.cwd(), "node_modules", "ah-sequelize-plugin"),
      },
    };
  },
};
