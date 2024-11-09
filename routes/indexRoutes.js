import { Router } from "express";
import indexController from "../controller/indexController.js";
import auth from "../middleware/authMiddleware.js";
import multer from "multer";
const upload = multer();
const router = Router();
router.post(
	"/availability",
	
	indexController.checkAvailability
);
router.get("/", indexController.getIndex);
router.get("/download-report", auth.requireAuth,  auth.checkRole(["faculty", "admin"]), indexController.getRoster);

router.get("/download-attendance", auth.requireAuth,  auth.checkRole(["admin"]), indexController.getDownloadAttendance);
router.get("/register", auth.forwardAuth, indexController.getPreRegisterFaculty);
router.post("/register", auth.forwardAuth, upload.none(), indexController.postPreRegisterFaculty);
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
