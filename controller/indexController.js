import query from "../database/query_db.js";
import moment from "moment";
import bcrypt from "bcrypt";
import createToken from "../utils/token.js";
import PDFDocument from "pdfkit";
import fs from "fs";
const checkAvailability = async (req, res) => {
	const { user, field, value, id } = req.body;

	let queryStr;
	let queryParams;
	const table = user === "student" ? "student" : "faculty"; // Using 'student' or 'users' table based on the user type

	// Base query
	queryStr = `SELECT * FROM ${table} WHERE ${field} = ?`;

	// Initialize query parameters
	queryParams = [value];

	// Check if id exists, if so, add it to the query
	if (id) {
		queryStr += ` AND id != ?`; // Add the condition for excluding the current ID
		queryParams.push(id); // Add the ID to the query parameters
	}

	try {
		const result = await query(queryStr, queryParams);

		// Return availability status based on the result
		if (result.length > 0) {
			return res.json({ available: false });
		} else {
			return res.json({ available: true });
		}
	} catch (err) {
		console.error(`Database query failed for ${field}:`, err);
		return res
			.status(500)
			.json({ success: false, message: "Database error" });
	}
};
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

		// Update the SQL query to check for both username and email, and also get is_active and registration_status
		const findUser =
			"SELECT * FROM faculty WHERE username = ? OR email = ?";

		// Use the promise-based approach for cleaner error handling
		const result = await query(findUser, [username, username]); // Use username for both fields

		if (result.length > 0) {
			const user = result[0];
			const match_password = await bcrypt.compare(
				password,
				user.password
			);

			// Check if the password matches
			if (match_password) {
				// Check if the user is active and registration status is approved
				if (
					user.is_active === 1 &&
					user.registration_status === "approved"
				) {
					// Generate token if the user is active and registration is approved
					const generateToken = createToken(
						user.id,
						user.username,
						"faculty"
					);
					res.cookie("token", generateToken, { httpOnly: true });
					return res.redirect("/faculty/dashboard");
				} else {
					// Handle cases for inactive users or unapproved registration status
					if (user.is_active === 0) {
						req.flash(
							"error_msg",
							"Your account is inactive. Please contact the administrator."
						);
					} else if (user.registration_status !== "approved") {
						req.flash(
							"error_msg",
							"Your registration is not approved yet."
						);
					}
					return res.redirect("/signin");
				}
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

const getPreRegisterFaculty = (req, res) => {
	res.render("pre_register_faculty", {
		title: "Register as Faculty",
	});
};
const postPreRegisterFaculty = async (req, res) => {
	const { name, username, email, password } = req.body;
	try {
		// Hash the password before storing
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert the faculty details with is_active set to 0 (pending approval)
		const query_result = await query(
			"INSERT INTO faculty (name, username, email, password, profile_url, is_active) VALUES (?, ?, ?, ?, ?, ?)",
			[name, username, email, hashedPassword, "default.jpg", 0] // 0 for pending approval
		);

		// You could also send a notification or email to the admin for approval here

		return res.json({
			success: true,
			message:
				"Your registration request has been submitted. Please wait for admin approval.",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: "Failed to submit registration request",
		});
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

const getRoster = async (req, res) => {
    const { startDate, endDate, class_id } = req.query;
	
    // Fetch class information dynamically based on class_id
    const class_info = (
        await query(
            `SELECT c.class_id, c.class_name, c.room_number, f.name AS faculty_name, s.description, s.subject_name, 
                    c.faculty_id, s.subject_code, s.time_day, s.type, semester, s.academic_year
             FROM classes c 
             JOIN faculty f ON c.faculty_id = f.id 
             JOIN subjects s ON c.subject_id = s.subject_id 
             WHERE c.class_id = ?`,
            [class_id]
        )
    )[0];

  

    // Fetch student attendance dynamically based on class_id and date range
    const student_attendance = await query(
        `
        SELECT sc.student_id, s.name, s.email, s.degree, s.year_section, a.attendance_id, a.log_date, a.status, a.logs
        FROM student_class sc
        JOIN student s ON sc.student_id = s.student_id
        JOIN attendance a ON sc.student_id = a.student_id
        WHERE sc.class_id = ? 
        AND a.class_id = ? 
        AND a.log_date BETWEEN ? AND ?;
        `,
        [class_id, class_id, startDate, endDate] // Example for a date range
    );

    

    const doc = new PDFDocument({
        size: "letter", // US Letter size (8.5 x 11 inches)
        margin: 30,
    });


	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', `attachment; filename=${class_info.class_name} - ${class_info.subject_code} - ${startDate} to ${endDate}.pdf`);
	doc.pipe(res);  // Make sure the PDF document is piped to the response
	
  

    // Title and Header Section
    doc.fontSize(16).text("MARIANO MARCOS STATE UNIVERSITY", { align: "center" });
    doc.fontSize(12).text("Laoag City, Ilocos Norte", { align: "center" });
    doc.moveDown();

    // Dynamic Course Information
    doc.fontSize(10)
        .text(`Course Code: ${class_info.subject_code}`, { continued: true })
        .text(`       Class Name: ${class_info.class_name}`, { continued: true })
        .text(`       Time/Day: ${class_info.time_day}`)
        .text(`Title: ${class_info.description}`)
        .text(`College: CIT`)
        .text(`Faculty: ${class_info.faculty_name}`)
        .text(`Semester: ${class_info.semester}`)
		.text(`SY: ${class_info.academic_year}`);

    doc.moveDown(2); // More space before table

    // Table Header
    const headers = ["#", "Name", "Student Number", "Date", "Time", "Status"];

    // Define X positions for each column to ensure they align exactly
    const columnXPositions = [30, 70, 200, 330, 430, 530]; // Adjust positions based on desired column widths
    const columnWidths = [40, 130, 120, 80, 80, 100]; // Defining column widths for each column

    let currentY = doc.y;

    // Header row
    doc.fontSize(10).font("Helvetica-Bold");
    headers.forEach((header, index) => {
        doc.text(header, columnXPositions[index], currentY);
    });
    
    currentY += 20; // Move down for data rows

    // Draw a line under the header
    doc.moveTo(30, currentY).lineTo(570, currentY).stroke();
    
    currentY += 5; // Move down for data rows

    // Add student data rows dynamically from fetched attendance records
    doc.fontSize(10).font("Helvetica");
    
    student_attendance.forEach((attendanceRecord,index) => {
        const row = [
            index + 1,
            attendanceRecord.name,
            attendanceRecord.student_id,
            attendanceRecord.log_date,
            attendanceRecord.logs,
            attendanceRecord.status,
        ];

        row.forEach((cell, index) => {
            doc.text(cell || '', columnXPositions[index], currentY, {
                width: columnWidths[index],
                align: "left",
            });
        });

        currentY += 20; // Move down for next row

        currentY += 5; // Additional space between rows

        // Check if we need to add a new page
        if (currentY > 750) {
            doc.addPage(); // Start a new page
            currentY = 30; // Reset Y position for the new page
        }
    });

    // Finalize the PDF and end the response
    doc.end();
};

const getDownloadAttendance = async (req, res) => {
    const { startDate, endDate } = req.query;
	
    


    // Fetch student attendance dynamically based on class_id and date range
    const student_attendance = await query(
        `
      SELECT c.class_id, c.class_name, s.student_id, s.name, s.email, a.attendance_id, a.log_date, a.status, a.logs FROM student_class sc JOIN student s ON sc.student_id = s.student_id JOIN attendance a ON sc.student_id = a.student_id JOIN classes c ON sc.class_id = c.class_id WHERE a.log_date BETWEEN ? AND ?;;
        `,
        [ startDate, endDate] // Example for a date range
    );

    

    const doc = new PDFDocument({
        size: "letter", // US Letter size (8.5 x 11 inches)
        margin: 30,
    });


	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', `attachment; filename=Attendance Report - ${startDate} to ${endDate}.pdf`);
	doc.pipe(res);  // Make sure the PDF document is piped to the response
	
  

    // Title and Header Section
    doc.fontSize(16).text("MARIANO MARCOS STATE UNIVERSITY", { align: "center" });
    doc.fontSize(12).text("Laoag City, Ilocos Norte", { align: "center" });
    doc.moveDown();

    // Dynamic Course Information
    doc.fontSize(10)
        .text(`Attendance Report - ${startDate} to ${endDate}`)
		.text(`Generated on: ${new Date().toLocaleString()}`)
     

    doc.moveDown(2); // More space before table

    // Table Header
    const headers = ["#", "Name", "Student Number", "Date", "Time", "Status"];

    // Define X positions for each column to ensure they align exactly
    const columnXPositions = [30, 70, 200, 330, 430, 530]; // Adjust positions based on desired column widths
    const columnWidths = [40, 130, 120, 80, 80, 100]; // Defining column widths for each column

    let currentY = doc.y;

    // Header row
    doc.fontSize(10).font("Helvetica-Bold");
    headers.forEach((header, index) => {
        doc.text(header, columnXPositions[index], currentY);
    });
    
    currentY += 20; // Move down for data rows

    // Draw a line under the header
    doc.moveTo(30, currentY).lineTo(570, currentY).stroke();
    
    currentY += 5; // Move down for data rows

    // Add student data rows dynamically from fetched attendance records
    doc.fontSize(10).font("Helvetica");
    
    student_attendance.forEach((attendanceRecord,index) => {
        const row = [
            index + 1,
            attendanceRecord.name,
            attendanceRecord.student_id,
            attendanceRecord.log_date,
            attendanceRecord.logs,
            attendanceRecord.status,
        ];

        row.forEach((cell, index) => {
            doc.text(cell || '', columnXPositions[index], currentY, {
                width: columnWidths[index],
                align: "left",
            });
        });

        currentY += 20; // Move down for next row

        currentY += 5; // Additional space between rows

        // Check if we need to add a new page
        if (currentY > 750) {
            doc.addPage(); // Start a new page
            currentY = 30; // Reset Y position for the new page
        }
    });

    // Finalize the PDF and end the response
    doc.end();
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
	postPreRegisterFaculty,
	getPreRegisterFaculty,
	checkAvailability,
	getAttendance,
	postAttendance,
	getRoster,getDownloadAttendance,
	getLogout,
	getError403,
	getError404,
};
