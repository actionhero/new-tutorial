import {
  Table,
  Model,
  Column,
  PrimaryKey,
  BeforeCreate,
} from "sequelize-typescript";
import * as uuid from "uuid";

@Table({ tableName: "goals", timestamps: true })
export class Goal extends Model<Goal> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  title: string;

  @Column
  done: boolean;

  @BeforeCreate
  static generateId(instance) {
    if (!instance.id) {
      instance.id = uuid.v4();
    }
  }
}
