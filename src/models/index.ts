import Class from "./Class";
import Score from "./Score";
import Plan from "./Plan";
import { IDatabaseService } from "@api/services/databaseService";
import Lesson from "./Lesson";

interface IModels {
  [key: string]: IDatabaseService;
}

const Models: IModels = {
  plans: new Plan(),
  classes: new Class(),
  scores: new Score(),
  lessons: new Lesson(),
};

export default Models;
