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
