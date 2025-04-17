import { Model } from "mongoose";
import Call from "./Call";
import Class from "./Class";
import Lesson from "./Lesson";
import Register from "./Register";
import Score from "./Score";
import User from "./User";

interface IModels {
  [key: string]: Model<any>;
}

const Models: IModels = {
  calls: Call,
  classes: Class,
  lessons: Lesson,
  registers: Register,
  users: User,
  scores: Score,
};

export default Models;
