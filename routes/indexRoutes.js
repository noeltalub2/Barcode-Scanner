import { Router } from "express";
import indexController from "../controller/indexController.js";
import auth from "../middleware/authMiddleware.js";
const router = Router();

router.get("/", indexController.getIndex);
router.get("/signin", auth.forwardAuth, indexController.getSignInFaculty);
router.get("/signin/admin", auth.forwardAuth, indexController.getSignInAdmin);

router.post("/signin", auth.forwardAuth, indexController.postSignInFaculty);
router.post("/signin/admin", auth.forwardAuth, indexController.postSignInAdmin);
router.get("/attendance/all", indexController.getAttendance);
router.post("/attendance", indexController.postAttendance);
router.get(
	"/logout",
	auth.requireAuth,
	auth.checkRole(["admin", "faculty"]),
	indexController.getLogout
);
router.get("/unauthorized", indexController.getError403);
router.use("/", indexController.getError404);

export default router;
