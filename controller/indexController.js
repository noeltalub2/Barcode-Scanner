import query from "../database/query_db.js";
import moment from "moment";
import bcrypt from "bcrypt";
import createToken from "../utils/token.js";

const getIndex = (req, res) => {
	res.redirect("/signin");
	// res.render("index", { title: "Barcode Scanner" });
};

const getSignInAdmin = (req, res) => {
	res.render("signin_admin", {
		title: "Signin as Admin",
		username: req.flash("username")[0],
	});
};
const getSignInFaculty = (req, res) => {
	res.render("signin_faculty", {
		title: "Signin as Faculty",
		username: req.flash("username")[0],
	});
};

const postSignInAdmin = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Update the SQL query to check for both username and email
		const findUser = "SELECT * FROM users WHERE username = ? OR email = ?";

		// Use the promise-based approach for cleaner error handling
		const result = await query(findUser, [username, username]); // Use username for both fields

		if (result.length > 0) {
			const match_password = await bcrypt.compare(
				password,
				result[0].password
			);
			if (match_password) {
				const generateToken = createToken(
					result[0].id,
					result[0].username,
					"admin"
				);
				res.cookie("token", generateToken, { httpOnly: true });

				return res.redirect("/admin/dashboard"); // Redirect to admin dashboard
			} else {
				req.flash("error_msg", "Incorrect username or password");
				req.flash("username", username); // Flash the username
				return res.redirect("/signin/admin");
			}
		} else {
			req.flash("error_msg", "Couldn't find your account");
			return res.redirect("/signin/admin");
		}
	} catch (err) {
		console.error(err); // Log the error for debugging
		req.flash("error_msg", "An unexpected error occurred.");
		return res.redirect("/signin/admin");
	}
};

const postSignInFaculty = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Update the SQL query to check for both username and email
		const findUser =
			"SELECT * FROM faculty WHERE username = ? OR email = ?";

		// Use the promise-based approach for cleaner error handling
		const result = await query(findUser, [username, username]); // Use username for both fields

		if (result.length > 0) {
			const match_password = await bcrypt.compare(
				password,
				result[0].password
			);
			if (match_password) {
				const generateToken = createToken(
					result[0].id,
					result[0].username,
					"faculty"
				);
				res.cookie("token", generateToken, { httpOnly: true });
				return res.redirect("/faculty/dashboard");
			} else {
				req.flash("error_msg", "Incorrect username or password");
				req.flash("username", username); // Flash the username
				return res.redirect("/signin");
			}
		} else {
			req.flash("error_msg", "Couldn't find your account");
			return res.redirect("/signin");
		}
	} catch (err) {
		console.error(err); // Log the error for debugging
		req.flash("error_msg", "An unexpected error occurred.");
		return res.redirect("/signin");
	}
};

const getAttendance = async (req, res) => {
	const attendance = await query(
		"SELECT a.*, s.name,s.year_section,s.degree FROM attendance a LEFT JOIN student s ON a.student_id = s.student_id ORDER BY a.log_date DESC, a.logs DESC;"
	);
	var resultData = [];

	attendance.forEach((data, index) => {
		resultData.push({
			id: index + 1,
			name: data.name,
			year_section: data.year_section,
			degree: data.degree,
			time_in_am: data.time_in_am,
			time_out_am: data.time_out_am,
			time_in_pm: data.time_in_pm,
			time_out_pm: data.time_out_pm,
			log_date: data.log_date,
		});
	});

	res.json({ data: resultData });
};
const postAttendance = async (req, res) => {
	const { barcode, attendance_type } = req.body;
	const class_id = 1;
	const timeStamp = moment().format("LTS");
	const currentDate = moment().format("YYYY-MM-DD");

	try {
		const exist_student = (
			await query(
				`SELECT count(*) as 'count' FROM student WHERE student_id = ?`,
				[barcode]
			)
		)[0].count;

		if (!exist_student) {
			return res.status(200).json({
				status: "error",
				msg: "Student not exist in database",
			});
		}

		// Check if an attendance record already exists for the current day
		const existingRecord = await query(
			"SELECT * FROM attendance WHERE student_id = ? AND DATE(log_date) = ? AND class_id = ?",
			[barcode, currentDate, class_id]
		);

		if (existingRecord.length > 0) {
			return res.status(400).json({
				status: "error",
				msg: "Student already marked attendance for the day",
			});
		}
		const attendance = (
			await query(
				`SELECT count(*) as 'count', status 
				FROM attendance 
				WHERE student_id = ? AND log_date = ? AND class_id = ?`,
				[barcode, currentDate, class_id]
			)
		)[0];

		// Handle Present and Absent cases
		if (attendance_type === "Present") {
			await query(
				`INSERT INTO attendance (student_id, log_date, status, logs, class_id) 
                 VALUES (?, ?, ?, ?, ?)`,
				[barcode, currentDate, "Present", timeStamp, class_id]
			);
			return res.status(200).json({
				status: "success",
				msg: "Student marked as Present",
			});
		} else if (attendance_type === "Absent") {
			await query(
				`INSERT INTO attendance (student_id, log_date, status, logs, class_id) 
                 VALUES (?, ?, ?, ?, ?)`,
				[barcode, currentDate, "Absent", timeStamp, class_id]
			);
			return res.status(200).json({
				status: "success",
				msg: "Student marked as Absent",
			});
		} else {
			return res.status(400).json({
				status: "error",
				msg: "Invalid attendance type selected",
			});
		}
	} catch (err) {
		console.log(err);
		res.status(200).json({
			status: "error",
			msg: "Invalid Barcode",
		});
	}
};

const getLogout = (req, res) => {
	res.clearCookie("token");
	res.redirect("/signin");
};

const getError403 = (req, res) => {
	res.render("unauthorized", { title: "403 - Unauthorized" });
};
const getError404 = (req, res) => {
	res.render("notfound", { title: "404 - Not found" });
};

export default {
	getIndex,
	getSignInAdmin,
	getSignInFaculty,
	postSignInAdmin,
	postSignInFaculty,
	getAttendance,
	postAttendance,
	getLogout,
	getError403,
	getError404,
};
