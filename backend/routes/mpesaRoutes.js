import express from "express";
import { stkPush} from "../controllers/mpesaController.js";

const router = express.Router();

router.post("/stkpush", stkPush);


export default router;

