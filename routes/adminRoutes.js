import { Router } from "express";
import adminController from "../controller/adminController.js";
import auth from "../middleware/authMiddleware.js";
import excelUpload from "../middleware/excelUpload.js";
import multer from "multer";
const upload = multer();
const router = Router();

router.get(
	"/dashboard",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getDashboard
);
router.post(
	"/availability",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.checkAvailability
);
router.get(
	"/student",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getStudent
);
router.post(
	"/student",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	upload.none(),
	adminController.postAddStudent
);

router.post(
	"/upload_excel",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	excelUpload.single("import-excel"),
	adminController.postExcelUpload
);

router.get(
	"/student/all",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getAllStudent
);

router.get(
	"/student/:id",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getStudentView
);

router.post(
	"/student/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	upload.none(),
	adminController.postStudentEdit
);

router.post(
	"/student/delete",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.deleteStudent
);

router.get(
	"/faculty",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getFaculty // Adjust the controller method name
);

router.post(
	"/faculty",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	upload.none(),
	adminController.postAddFaculty // Adjust the controller method name
);

router.get(
	"/faculty/all",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getAllFaculty // Adjust the controller method name
);

router.get(
	"/faculty/:id",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getFacultyView // Adjust the controller method name
);

router.post(
	"/faculty/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	upload.none(),
	adminController.postFacultyEdit // Adjust the controller method name
);

router.post(
	"/faculty/delete",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.deleteFaculty // Adjust the controller method name
);

router.get(
	"/attendance",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getAttendance
);

router.post(
	"/changepassword",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	upload.none(),
	adminController.changePassword
);


router.get(
	"/subjects",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getSubjects // Adjusted the controller method name
);

router.post(
	"/subjects",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	upload.none(),
	adminController.postAddSubject // Adjusted the controller method name
);

router.get(
	"/subjects/all",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getAllSubjects // Adjusted the controller method name
);


router.post(
	"/subjects/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	upload.none(),
	adminController.postSubjectEdit // Adjusted the controller method name
);

router.post(
	"/subjects/delete",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.deleteSubject // Adjusted the controller method name
);



router.get(
	"/class",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getClasses // Adjusted the controller method name
);

router.post(
	"/class",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	upload.none(),
	adminController.postAddClass // Adjusted the controller method name
);

router.get(
	"/class/all",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getAllClasses // Adjusted the controller method name
);


router.post(
	"/class/edit",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	upload.none(),
	adminController.postClassEdit // Adjusted the controller method name
);

router.post(
	"/class/delete",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.deleteClass // Adjusted the controller method name
);

router.get(
	"/settings",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.getSettings
);

router.get(
	"/backup_sql",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.backupSql
);

router.post(
	"/delete_sql",
	auth.requireAuth,
	auth.checkRole(["admin"]),
	adminController.truncateDatabase
);


export default router;
