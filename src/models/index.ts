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
  Call,
  Class,
  Lesson,
  Register,
  User,
  Score,
};

export default Models;
