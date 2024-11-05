import { Router } from "express";
import facultyController from "../controller/facultyController.js";
import auth from "../middleware/authMiddleware.js";
import excelUpload from "../middleware/excelUpload.js";
import multer from "multer";
const upload = multer();
const router = Router();

router.get(
	"/dashboard",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.getDashboard
);
router.post(
	"/availability",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.checkAvailability
);
router.get(
	"/student",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.getStudent
);
router.post(
	"/student",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	upload.none(),
	facultyController.postAddStudent
);

router.post(
	"/upload_excel",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	excelUpload.single("import-excel"),
	facultyController.postExcelUpload
);

router.get(
	"/student/all",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.getAllStudent
);

router.get(
	"/student/:id",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.getStudentView
);

router.post(
	"/student/edit",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	upload.none(),
	facultyController.postStudentEdit
);

router.post(
	"/student/delete",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.deleteStudent
);

router.get(
	"/record-attendance",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.getAttendance
);
router.post(
	"/record-attendance",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	upload.none(),
	facultyController.postAttendance
);

router.get(
	"/class",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.getClasses
);

router.get(
	"/class/:class_id",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.getClassView
);

router.post(
	"/class/enroll",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	upload.none(),
	facultyController.postEnrollStudent
);

router.post(
	"/class/remove",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.removeStudent
);

router.get(
	"/attendance/class/:class_id",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.getAttendanceClass
);

router.get(
	"/profile",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	facultyController.getProfile
);

router.post(
	"/profile",
	auth.requireAuth,
	auth.checkRole(["faculty"]),
	upload.none(),
	facultyController.postProfile
);

export default router;
