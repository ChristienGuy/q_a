import { Router } from "express";
import QuestionController from "../controllers/QuestionController";

const router = Router();

router.get("/", QuestionController.find);
router.get("/:id([0-9]+)", QuestionController.findOne);
router.post("/:id([0-9]+)", QuestionController.add);
router.put("/:id([0-9]+)", QuestionController.update);
router.delete("/:id([0-9]+)", QuestionController.delete);

export default router;
