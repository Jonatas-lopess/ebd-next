import Rollcall from "./Rollcall";
import Class from "./Class";
import Register from "./Register";
import Score from "./Score";
import Plan from "./Plan";
import { IDatabaseService } from "@api/services/databaseService";

interface IModels {
  [key: string]: IDatabaseService;
}

const Models: IModels = {
  plans: new Plan(),
  classes: new Class(),
  registers: new Register(),
  scores: new Score(),
};

export default Models;
