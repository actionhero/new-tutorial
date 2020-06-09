# New Actionhero Tutorial

![Node.js CI](https://github.com/actionhero/new-tutorial/workflows/Node.js%20CI/badge.svg)

_visit www.actionherojs.com for more information_

This tutorial showcases a realistic Todo List Application with CRUD operations.

To simply play with application, follow the next steps:

1. Make sure you've the following installed on your system
    - Redis
    - Postgresql 
    - NodeJS

2. Clone the project

```
git clone https://github.com/actionhero/actionhero-tutorial.git
```

3. Install the dependencies

```
npm install
```

4. Configure the database connection in `./src/config/sequelize.js` and run migrations.
```
npx sequelize-cli db:migrate
```

5. Start Dev server and access API's at <a href="http://localhost:8080">Localhost</a>
```
npm run dev
```



# Tutorial


By the end of this tutorial you will become comfortable with the following pieces of Actionhero and build a CRUD based application.

- Actions
- Web Server Configs
- Routing
- Plugins
- Testing

We will be building a Todo List Web App which will cover all the basics to get started with Actionhero.

<br>

## Prerequisites

- Make sure you've <a href="https://nodejs.org/en/" target="_blank">Nodejs</a> installed.

- <a href="https://redis.io/" target="_blank">Redis</a> and <a href="https://www.postgresql.org/" target="_blank">Postgresql</a> are installed and working locally.

<br>


## Project Setup

### Create a project directory:

```
mkdir todo && cd todo
```

Generate a new Actionhero project

```
npx actionhero generate
```

Install the Dependencies

```
npm install
```

Start the server by running:

 `npm start` 

 The local server will be running on http://localhost:8080
 
 _8080 is the default port but configurable._

Check the directory structure and note the following:

- The preconfigured scripts are available in `todo/package.json`
- The server port is configured in `src/config/servers/web.ts`.
- In `web.ts` file you may find many server related configurations such as port, headers to send in API calls etc. A few of which we will take up in this tutorial.

Now make a GET call like 
```
curl http://localhost:8080/api/status
```

This will return a JSON similar to below:
```
{
  "uptime": 345153,
  "nodeStatus": "Node Healthy",
  "problems": [],
  "id": "192.168.29.154",
  "actionheroVersion": "22.1.1",
  "name": "my_actionhero_project",
  "description": "my actionhero project",
  "version": "0.1.0",
  "consumedMemoryMB": 11.39,
  "resqueTotalQueueLength": 0,
  "serverInformation": {
    "serverName": "my_actionhero_project",
    "apiVersion": "0.1.0",
    "requestDuration": 4,
    "currentTime": 1591682900784
  },
  "requesterInformation": {
    "id": "4beecab3c8dabd931c356515c4516b6ed66dcf03-a1a5e979-5f36-49f5-9fac-7e31798f3648",
    "fingerprint": "4beecab3c8dabd931c356515c4516b6ed66dcf03",
    "messageId": "a1a5e979-5f36-49f5-9fac-7e31798f3648",
    "remoteIP": "127.0.0.1",
    "receivedParams": {
      "action": "status"
    }
  }
}
```

Success!
This verified everything went fine and project is now working.

_This is a pre-configured status action available via the `/api/status` endpoint_


## Database Setup

For our Todo List tutorial we will need a database. We will use Postgresql for the same. 
Since Actionhero is quite modular in nature, there are plugins for support.

We will be using Sequelize which is Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL server.

To connect Actionhero with Sequelize we need <a href="https://github.com/Actionhero/ah-sequelize-plugin/">ah-sequelize-plugin</a>.

The setup instructions for ah-sequelize-plugin are on it's Github documentation too.

### Instructions

1. Install `ah-sequelize-plugin`
```
npm i ah-sequelize-plugin --save
```

2. Add Sequelize Packages
```
npm install sequelize sequelize-typescript --save
```
3. Add types and reflexive addons
```
npm install @types/bluebird @types/validator reflect-metadata --save
```
4. Add the plugin to `src/config/plugins.ts` file.
Simply replace the empty return statement with:
```
return {
     "ah-sequelize-plugin": {
        path: path.join(process.cwd(), "node_modules", "ah-sequelize-plugin")
      }
  }

```
You might also need to import path into the `plugins.ts` file.
`import * as path from "path";`

5. Add `experimentalDecorators` and `emitDecoratorMetadata` to your Typescript tsconfig.json file:
```
{
  "compilerOptions": {
    "outDir": "./dist",
    "allowJs": true,
    "module": "commonjs",
    "target": "es2018",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["./src/**/*"]
}
```
6. Add the supported database drive for Postgres.
```
npm install --save pg pg-hstore
```

_This is necessary for using <a href="https://sequelize.org/v5/manual/getting-started.html" target="_blank">Sequelize</a>._

7. One last thing for ease of use we can have is utilize Sequelize CLI. 
You can install it by running 
```
npm install --save-dev sequelize-cli
```

8. Configure Sequelize by creating `./src/config/sequelize.js`.

Copy the following configurations in it.
```
const { URL } = require('url')
const path = require('path')

const DEFAULT = {
  sequelize: config => {
    let dialect = "postgres";
    let host = "127.0.0.1";
    let port = "5432";
    let database = "actionhero";
    let username = undefined;
    let password = undefined;

    // if your environment provides database information via a single JDBC-style URL like mysql://username:password@hostname:port/default_schema
    if (process.env.DATABASE_URL) {
      const parsed = new URL(process.env.DATABASE_URL);
      if (parsed.username) {
        username = parsed.username;
      }
      if (parsed.password) {
        password = parsed.password;
      }
      if (parsed.hostname) {
        host = parsed.hostname;
      }
      if (parsed.port) {
        port = parsed.port;
      }
      if (parsed.pathname) {
        database = parsed.pathname.substring(1);
      }
    }

    return {
      autoMigrate: true,
      logging: false,
      dialect: dialect,
      port: parseInt(port),
      database: database,
      host: host,
      username: username,
      password: password,
      models: [path.join(__dirname, "..", "models")],
      migrations: [path.join(__dirname, "..", "migrations")]
    };
  }
};

module.exports.DEFAULT = DEFAULT;

// for the sequelize CLI tool
module.exports.development = DEFAULT.sequelize({
  env: "development",
  process: { env: "development" }
});

module.exports.staging = DEFAULT.sequelize({
  env: "staging",
  process: { env: "staging" }
});

module.exports.production = DEFAULT.sequelize({
  env: "production",
  process: { env: "production" }
});
```

_Replace the database, username, host, passsword with your Postgresql configuration._


9. To configure `sequelize-cli` use the above configuration and create a `.sequelizerc` file with following config. This file needs to be created in root folder of the project: `./.sequelizerc`.

```
const path = require('path');

module.exports = {
  'config': path.resolve('.', 'sequelize.js'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
  'migrations-path': path.resolve('src', 'migrations')
}
```

_The above configuration helps sequelize-cli know about the location to find other configurations and where to create models, seeders, migrations._


10. Last step, to run the `sequelize-cli` from root folder, create a file called `sequelize.js` in the root folder and add the following:

```
const sequelizeConfig = require('./src/config/sequelize.js')

const sequelizeConfigEnv = sequelizeConfig[process.env.NODE_ENV] || sequelizeConfig.DEFAULT
module.exports = sequelizeConfigEnv.sequelize()
```

This in turn makes the CLI use configuration from `src/config/sequelize.js`.

## Migrations

Now that database setup is finished. 
Let's get to create Migrations. Migrations help to create the database tables via code and even roll down the changes if needed.

1. Create a Migration File

Creating migrations is easy now, since we already have `sequelize-cli` to help.

```
npx sequelize-cli migration:generate --name migration-skeleton
```

This will create a migration file as `src/migrations/<timestamp>-migration-skeleton.js`.

2. Add up/down migrations to the newly created migration file:

```
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tasks", {
      guid: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      done: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tasks");
  }
};
```

The above asks Sequelize to create a table `tasks`.

To imagine what we just did look at a `tasks` table which can be created using above code.

| guid           | title              | done |
| ---------------| -------------------|------|
| 235b6988-78..  | Watch NodeConf EU  | true |
| a37e3990-41..  | Build Rome         | false|  


3. Migrate

```
npx sequelize-cli db:migrate
```

The above will create a table called `tasks` in the configured database.

### Model

Since we have the tables in database now created, lets write the code which represents and connects to the corresponding table.

Create a Model `Task.ts` in `src/models/` directory with the following code.

`Task.ts`

```
import {
    Table,
    Model,
    Column,
    PrimaryKey,
    BeforeCreate,
  } from "sequelize-typescript";
  import * as uuid from "uuid";
  
  @Table({ tableName: "tasks", timestamps: false, paranoid: false })
  export class Task extends Model<Task> {
    @PrimaryKey
    @Column
    guid: string;
  
    @Column
    title: string;
  
    @Column
    done: boolean;
  
    @BeforeCreate
    static generateGuid(instance) {
      if (!instance.guid) {
        instance.guid = uuid.v4();
      }
    }
  }
  ```

In the above Model, Column decorator defines the columns of table ie `guid`, `title`, `done`. The generateGuid static function makes sure to generate a guid for the task before creating a new one.

### Testing

Now that we have created our first model, lets start testing the functionality.

In the `__tests__/models` directory create a file called `task.ts` and add the following code:

```
import { Process } from "actionhero";
import { Task } from "../../src/models/Task";
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

```

This code is self explanatory but for further clarity the above test checks if a new task gets created in the database with the required properties.

```npm run test models/task``` 

Run the above  to test the newly created model.

## Actions

Actions are the core of the Actionhero framework. These are the basic units of work within every connection type.
We shall now make a connection for our basic CRUD operations.

Create a file called `task.ts` in `src/actions` directory.



### GetTask Action

This action is for fetching details of a task with it's particular guid.

```
export class GetTask extends Action
```

This involves a constructor, which has certain attributes which can be defined for every Action.


```
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
```

These are generic attributes such as name of action (this is important and we will use it in next section).
Next is a description about the action.
And last one is the inputs which may or may not be added to the request for action. Here since we're requesting the details of a particular task, it is required.

```
this.inputs = {
      taskId: {
        required: true,
      },
    };
```
For other available attributes on inputs checkout the <a href="https://www.actionherojs.com/tutorials/actions#Inputs" target="_blank">documentation</a>.

Next part is the action itself.

```
  async run({ connection, response }) {
    const taskId = connection.params.taskId;
    const task = await Task.findOne({ where: { guid: taskId } });
    if (!task) {
      throw new Error(`Task does not exist with taskId: ${taskId}`);
    }
    response.task = task;
  }
}
```

The fetching of details from database makes it an async action. This involves essentially just 4 lines of code.

1. Fetching the input param of taskId
2. Fetching the details from the database using the particular Task model.
3. Throwing error if the task does not exist.
4. Assigning the task as an attribute to the `response` object of action itself.

_Similarly there are *ListTasks*, *CreateTask*, *UpdateTask* and *DeleteTask* present in the same `actions/task.ts` files in the demo project_

## Routing

The Actions are now complete but to access them we need to define particular routes for each action.
This is done via the `src/config/routes.ts` file.

Since `GetTask` should ideally be a GET action, it can be added in the `routes.ts` file as below:

```
get: [
    { path: "/tasks/:taskId", action: "task:get" },
],
```

The resulting path to run would be 
```
http://localhost:8080/api/tasks/<taskId>
```
and the action refers to the Action name which we had given in GetTask at 

`this.name = "task:get"`.

<br/>

Similar routes are added in the `routes.ts` file in demo application.


The reason the path is prefixed with `/api` is because of a configuration in the web server with the configuration at `src/config/servers/web.ts`:
```
urlPathForActions: "api"
```

## Testing

To finally test the whole application let's create a basic test at `__tests__/task.ts`

First lets set up the Get Task Test. It has 2 simple parts involving starting of api before everything and stopping it after every test has been executed.
```
describe("Action", () => {
  describe("Get Task", () => {
    beforeAll(async () => {
      api = await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });
...
```

Let's create a test for basic fail condition if the task does not exist:

```
 test("Should throw an error when task with taskId does not exist",   
    async () => {
      const taskId = "5ab0c467-eb53-4288-9390-51f4d5f1f211";
      const response = await specHelper.runAction("task:get", {
        taskId: taskId,
      });
      expect(response.error).toBeTruthy();
      expect(response.error).toBe(
        `Error: Task does not exist with taskId: ${taskId}`
      );
 });
```

And a test to check that the correct task is fetched:

```
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
    });
  });
```

To test the actions in `task.ts`
```
npm run test actions/task
```

```
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

Success all tests are passing!

<br/>

## Conclusion

We've completed a basic `Todo Lists` Application and the code is available in the demo project.


