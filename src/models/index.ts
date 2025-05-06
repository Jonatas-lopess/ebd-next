import { Model } from "mongoose";
import RollCall from "./Rollcall";
import Class from "./Class";
import Register from "./Register";
import Score from "./Score";
import User from "./User";
import Plan from "./Plan";

interface IModels {
  [key: string]: Model<any>;
}

const Models: IModels = {
  rollcalls: RollCall,
  plans: Plan,
  classes: Class,
  registers: Register,
  users: User,
  scores: Score,
};

export default Models;
