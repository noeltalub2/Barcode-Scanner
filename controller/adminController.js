import query from "../database/query_db.js";
import db from "../database/connect_db.js";
import bcrypt from "bcrypt";
import readXlsxFile from "read-excel-file/node";
import fs from "fs";
import mysqldump from "mysqldump";

const getDashboard = async (req, res) => {
	const total_student = await query(
		"SELECT COUNT(*) AS total_users FROM student"
	);
	const total_faculty = await query(
		"SELECT COUNT(*) AS total_users FROM faculty"
	);
	const total_admin = await query(
		"SELECT COUNT(*) AS total_users FROM users WHERE role = 'admin'"
	);
	const total_classes = await query(
		"SELECT COUNT(*) AS total_classes FROM classes"
	);
	const total_subjects = await query(
		"SELECT COUNT(*) AS total_subjects FROM subjects"
	);
	const total_attendances = await query(
		"SELECT COUNT(*) AS total_attendances FROM attendance"
	);

	const get_attendance = await query(
		"SELECT a.*, c.class_name, sub.subject_name, s.student_id, s.name AS student_name, s.email, sub.subject_name FROM attendance a JOIN classes c ON a.class_id = c.class_id JOIN student s ON a.student_id = s.student_id JOIN subjects sub ON c.subject_id = sub.subject_id ORDER BY a.log_date DESC LIMIT 10;"
	);

	const data = {
		total_student: total_student[0].total_users,
		total_faculty: total_faculty[0].total_users,
		total_admin: total_admin[0].total_users,
		total_classes: total_classes[0].total_classes,
		total_subjects: total_subjects[0].total_subjects,
		total_attendances: total_attendances[0].total_attendances,
	};

	res.render("Admin/dashboard", {
		title: "Dashboard",
		page: "dashboard",
		data,
		get_attendance,
	});
};

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

const getStudent = (req, res) => {
	res.render("Admin/student", { title: "Manage Student", page: "student" });
};
const getAllStudent = async (req, res) => {
	const student_record = await query("SELECT * FROM student");
	var resultData = [];

	student_record.forEach((data, index) => {
		resultData.push({
			id: index + 1,
			student_id: data.student_id,
			name: data.name,
			email: data.email,
			degree: data.degree,
			year_section: data.year_section,
		});
	});

	res.json({ data: resultData });
};
const postAddStudent = async (req, res) => {
	const { student_id, name, email, degree, year_section } = req.body;
	try {
		const query_result = await query(
			"INSERT INTO student (student_id, name, email, degree, year_section) VALUES (?, ?, ?, ?, ?)",
			[student_id, name, email, degree, year_section]
		);
		return res.json({
			success: true,
			message: "Student added successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to student" });
	}
};

const getStudentView = async (req, res) => {
	const student_id = req.params.id;
	const student = (
		await query("SELECT * FROM student WHERE student_id = ?", student_id)
	)[0];
	const attendance = await query(
		"SELECT a.*, c.class_name, s.subject_name FROM attendance a JOIN classes c ON a.class_id = c.class_id JOIN subjects s ON c.subject_id = s.subject_id WHERE a.student_id = ? ORDER BY a.attendance_id DESC;",
		student_id
	);

	const classes = await query(
		`
       SELECT c.class_name, s.subject_name FROM student_class sc JOIN classes c ON sc.class_id = c.class_id JOIN subjects s ON c.subject_id = s.subject_id WHERE sc.student_id = ?;
    `,
		student_id
	);

	res.render("Admin/student_view", {
		title: "View Student",
		page: "student",
		student,
		attendance,
		classes,
	});
};

const postStudentEdit = async (req, res) => {
	const { student_id, name, email, degree, year_section } = req.body;
	try {
		const query_result = await query(
			"UPDATE student SET name = ?, email = ?, degree = ?, year_section = ? WHERE student_id = ?",
			[name, email, degree, year_section, student_id]
		);
		return res.json({
			success: true,
			message: "Student updated successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to update student" });
	}
};
const postExcelUploadStudent = async (req, res) => {
	if (req.fileValidationError) {
		return res.status(400).json({
			success: false,
			message: req.fileValidationError,
		});
	}

	const filePath = `public/document/${req.file.filename}`;

	// Import Excel Data to MySQL database
	readXlsxFile(filePath)
		.then((rows) => {
			// Remove Header ROW
			rows.shift();

			// MySQL query to insert data
			const query =
				"INSERT INTO student (student_id, name, email, degree, year_section) VALUES ?";

			db.query(query, [rows], (error, response) => {
				if (error) {
					fs.unlink(filePath, (err) => {
						if (err) console.log(err); // Clean up the file if there's an error
					});

					return res.status(500).json({
						success: false,
						message: `Error inserting data: ${error.message}`,
					});
				}

				// Clean up the uploaded file
				fs.unlink(filePath, (err) => {
					if (err) console.log(err); // Handle file deletion error, if any
				});

				// Respond with success
				return res.status(200).json({
					success: true,
					message: "Students data successfully uploaded",
				});
			});
		})
		.catch((error) => {
			// Handle file reading errors
			return res.status(500).json({
				success: false,
				message: `Error reading file: ${error.message}`,
			});
		});
};
const deleteStudent = async (req, res) => {
	const { student_id } = req.body;
	console.log(req.body);
	try {
		const query_result = await query(
			"DELETE FROM student WHERE student_id = ?",
			student_id
		);
		return res.json({
			success: true,
			message: "Student deleted successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to delete student" });
	}
};

const getFaculty = (req, res) => {
	res.render("Admin/faculty", { title: "Manage Faculty", page: "faculty" });
};

const getAllFaculty = async (req, res) => {
	const faculty_record = await query("SELECT * FROM faculty");
	var resultData = [];

	faculty_record.forEach((data, index) => {
		resultData.push({
			id: index + 1,
			faculty_id: data.id,
			name: data.name,
			username: data.username,
			email: data.email,
			profile_url: data.profile_url,
			is_active: data.is_active,
			registration_status: data.registration_status
		});
	});

	res.json({ data: resultData });
};

const postAddFaculty = async (req, res) => {
	const { name, username, email, password } = req.body;
	try {
		// Hash the password before storing
		const hashedPassword = await bcrypt.hash(password, 10);

		const query_result = await query(
			"INSERT INTO faculty (name, username, email, password, profile_url, is_active, registration_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[name, username, email, hashedPassword, "default.jpg", 1, 'approved'] // Assuming profile_url can be null
		);
		return res.json({
			success: true,
			message: "Faculty added successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to add faculty" });
	}
};

const getFacultyView = async (req, res) => {
	const user_id = req.params.id; // Assuming id is the unique identifier
	const faculty = (
		await query("SELECT * FROM faculty WHERE id = ?", user_id)
	)[0];

	res.render("Admin/faculty_view", {
		title: "View Faculty",
		page: "faculty",
		faculty,
	});
};

const postFacultyEdit = async (req, res) => {
	const { id, name, username, email, password, is_active, registration_status } = req.body;

	try {
		// Construct the query based on whether the password is provided or not
		let query_result;
		if (password) {
			// Update with the password if provided
			query_result = await query(
				"UPDATE faculty SET name = ?, username = ?, email = ?,is_active = ?, registration_status = ? password = ? WHERE id = ? ",
				[name, username, email,is_active, registration_status, password, id]
			);
		} else {
			// Update without changing the password
			query_result = await query(
				"UPDATE faculty SET name = ?, username = ?, email = ?, is_active = ?, registration_status = ? WHERE id = ?",
				[name, username, email, is_active, registration_status, id]
			);
		}

		return res.json({
			success: true,
			message: "Faculty updated successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to update faculty" });
	}
};

const deleteFaculty = async (req, res) => {
	const { id } = req.body; // Assuming id is passed in the request body
	try {
		const query_result = await query(
			"DELETE FROM faculty WHERE id = ? ",
			id
		);
		return res.json({
			success: true,
			message: "Faculty deleted successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to delete faculty" });
	}
};

const getSubjects = (req, res) => {
	res.render("Admin/subjects", {
		title: "Manage Subjects",
		page: "subjects",
	});
};

const getAllSubjects = async (req, res) => {
	const subject_record = await query("SELECT * FROM subjects");
	var resultData = [];

	subject_record.forEach((data, index) => {
		resultData.push({
			id: index + 1,
			subject_id: data.subject_id,
			subject_name: data.subject_name,
			subject_code: data.subject_code,
			description: data.description,
			semester: data.semester,
			academic_year: data.academic_year,
			time_day: data.time_day,
			type: data.type,
			created_at: data.created_at,
		});
	});

	res.json({ data: resultData });
};

const postAddSubject = async (req, res) => {
    const { subject_name, subject_code, description, semester, academic_year, time_day, type } = req.body;

    try {
        const query_result = await query(
            "INSERT INTO subjects (subject_name, subject_code, description, semester, academic_year, time_day, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [subject_name, subject_code, description, semester, academic_year, time_day, type]
        );
        return res.json({
            success: true,
            message: "Subject added successfully",
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Failed to add subject" });
    }
};


const postSubjectEdit = async (req, res) => {
    const { subject_id, subject_name, subject_code, description, semester, academic_year, time_day, type } = req.body;

    try {
        const query_result = await query(
            "UPDATE subjects SET subject_name = ?, subject_code = ?, description = ?, semester = ?, academic_year = ?, time_day = ?, type = ? WHERE subject_id = ?",
            [subject_name, subject_code, description, semester, academic_year, time_day, type, subject_id]
        );

        return res.json({
            success: true,
            message: "Subject updated successfully",
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Failed to update subject" });
    }
};
const postExcelUploadSubjects = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({
            success: false,
            message: req.fileValidationError,
        });
    }

    const filePath = `public/document/${req.file.filename}`;

    // Import Excel Data to MySQL database
    readXlsxFile(filePath)
        .then((rows) => {
            // Remove Header ROW
            rows.shift();

            // MySQL query to insert subject data (without created_at and updated_at)
            const query =
                "INSERT INTO subjects (subject_name, subject_code, description, semester, academic_year, time_day, type) VALUES ?";

            // Prepare data to be inserted (without created_at and updated_at)
            const formattedRows = rows.map(row => [
                row[0], // subject_name
                row[1], // subject_code
                row[2], // description
                row[3], // semester
                row[4], // academic_year
                row[5], // time_day
                row[6], // type
            ]);

            db.query(query, [formattedRows], (error, response) => {
                if (error) {
                    // Clean up the file if there's an error
                    fs.unlink(filePath, (err) => {
                        if (err) console.log(err);
                    });

                    return res.status(500).json({
                        success: false,
                        message: `Error inserting data: ${error.message}`,
                    });
                }

                // Clean up the uploaded file
                fs.unlink(filePath, (err) => {
                    if (err) console.log(err);
                });

                // Respond with success
                return res.status(200).json({
                    success: true,
                    message: "Subjects data successfully uploaded",
                });
            });
        })
        .catch((error) => {
            // Handle file reading errors
            return res.status(500).json({
                success: false,
                message: `Error reading file: ${error.message}`,
            });
        });
};


const deleteSubject = async (req, res) => {
	const { id } = req.body; // Assuming subject_id is passed in the request body

	try {
		const query_result = await query(
			"DELETE FROM subjects WHERE subject_id = ?",
			id
		);
		return res.json({
			success: true,
			message: "Subject deleted successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to delete subject" });
	}
};

const getClasses = async (req, res) => {
	const subjects = await query(
		"SELECT subject_id, subject_name FROM subjects"
	); // Fetch subjects from the database
	const faculty = await query("SELECT id, name FROM faculty"); // Fetch faculty from the database

	res.render("Admin/classes", {
		title: "Manage Classes",
		page: "class",
		subjects,
		faculty,
	});
};

const getAllClasses = async (req, res) => {
	const class_record = await query(`
        SELECT classes.*, subjects.subject_name, faculty.name AS faculty_name
        FROM classes 
        LEFT JOIN subjects ON classes.subject_id = subjects.subject_id
        LEFT JOIN faculty ON classes.faculty_id = faculty.id
    `);

	var resultData = [];
	class_record.forEach((data, index) => {
		resultData.push({
			id: index + 1,
			class_id: data.class_id,
			subject_id: data.subject_id,
			faculty_id: data.faculty_id,
			class_name: data.class_name,
			room_number: data.room_number,
			subject_name: data.subject_name,
			faculty_name: data.faculty_name,
			created_at: data.created_at,
			updated_at: data.updated_at,
		});
	});

	res.json({ data: resultData });
};

const postAddClass = async (req, res) => {
	const { subject_id, faculty_id, class_name, room_number } = req.body; // Include all required fields

	try {
		const query_result = await query(
			"INSERT INTO classes (subject_id, faculty_id, class_name, room_number) VALUES (?, ?, ?, ?)",
			[subject_id, faculty_id, class_name, room_number]
		);
		return res.json({
			success: true,
			message: "Class added successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to add class" });
	}
};

const postClassEdit = async (req, res) => {
	const { class_id, subject_id, faculty_id, class_name, room_number } =
		req.body; // Include all required fields
	console.log(req.body);
	try {
		const query_result = await query(
			"UPDATE classes SET subject_id = ?, faculty_id = ?, class_name = ?, room_number = ? WHERE class_id = ?",
			[subject_id, faculty_id, class_name, room_number, class_id]
		);

		return res.json({
			success: true,
			message: "Class updated successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to update class" });
	}
};

const deleteClass = async (req, res) => {
	const { id } = req.body; // Assuming class_id is passed in the request body

	try {
		const query_result = await query(
			"DELETE FROM classes WHERE class_id = ?",
			id
		);
		return res.json({
			success: true,
			message: "Class deleted successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to delete class" });
	}
};

const getAttendance = async (req, res) => {
	const get_attendance = await query(
		"SELECT a.*, c.class_name, sub.subject_name, s.student_id, s.name AS student_name, s.email, sub.subject_name FROM attendance a JOIN classes c ON a.class_id = c.class_id JOIN student s ON a.student_id = s.student_id JOIN subjects sub ON c.subject_id = sub.subject_id ORDER BY a.log_date DESC LIMIT 10;"
	);
	res.render("Admin/attendance", {
		title: "Attendance",
		page: "attendance",
		get_attendance,
	});
};

const getSettings = async (req, res) => {
	const userId = res.locals.user.id;
	res.render("Admin/settings", {
		title: "Settings",
		page: "settings",
		userId,
	});
};

const changePassword = async (req, res) => {
	const { currentPassword, password } = req.body;
	const user = res.locals.user.id;

	try {
		const rows = await query(
			"SELECT password FROM users WHERE id = ? AND role = 'admin'",
			[user]
		);

		const match = await bcrypt.compare(currentPassword, rows[0].password);
		if (match) {
			const hashedPassword = await bcrypt.hash(password, 10);
			await db
				.promise()
				.query(
					"UPDATE users SET password = ? WHERE id = ? AND role = 'admin'",
					[hashedPassword, user]
				);
			return res.json({ success: true, message: "Password changed" });
		} else {
			return res
				.status(400)
				.json({ success: false, message: "Incorrect password" });
		}
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to change password" });
	}
};

const backupSql = async (req, res) => {
	const file_name = `${new Date().toISOString().slice(0, 10)} - backup.sql`;
	const file_path = `./database/${file_name}`;
	try {
		await mysqldump({
			connection: {
				host: process.env.DB_HOST,
				user: process.env.DB_USER,
				password: process.env.DB_PASS,
				database: process.env.DB_NAME,
			},
			dumpToFile: file_path, // Filename for the exported SQL file
			// Add any additional mysqldump options here if needed
		});

		res.setHeader(
			"Content-Disposition",
			"attachment; filename=" + file_name
		);
		res.setHeader("Content-Type", "application/sql");

		const filestream = fs.createReadStream(file_path);
		filestream.pipe(res);

		res.on("close", () => {
			fs.unlink(file_path, (err) => {
				if (err) {
					console.error(err);
				} else {
					res.end();
				}
			});
		});
	} catch (err) {
		console.error("Error: " + err);
		req.flash("error", `Error occur`);
		res.redirect("/settings");
	}
};
const truncateDatabase = async (req, res) => {
	try {
		const { password } = req.body;

		const findUser = `SELECT * from users WHERE id = ? AND role = 'admin'`;
		db.query(findUser, [res.locals.user.id], async (err, result) => {
			if (err) {
				console.log(err);
				return res
					.status(200)
					.json({ success: false, message: "Server error" });
			}

			if (result.length === 0) {
				return res
					.status(200)
					.json({ success: false, message: "Admin not found" });
			}

			const match = await bcrypt.compare(password, result[0].password);
			if (!match) {
				return res
					.status(200)
					.json({ success: false, message: "Incorrect password" });
			}

			// Assuming you have a query function to execute SQL queries
			const [tables] = await db.promise().query("SHOW TABLES"); // Get all table names
	
			// Start transaction (if using transactions in your query helper)
			await query("START TRANSACTION");
			await query("SET FOREIGN_KEY_CHECKS = 0");
			// Truncate each table except 'users'
			for (const table of tables) {
				const tableName = Object.values(table)[0]; // Get table name dynamically

				// Skip the 'users' table
				if (tableName !== "users") {
					await query(`TRUNCATE TABLE \`${tableName}\``); // Truncate table
				}
			}
			await query("SET FOREIGN_KEY_CHECKS = 1");
			// Commit transaction
			await query("COMMIT");

			// Return success response
			return res.status(200).json({
				success: true,
				message: "All tables except 'users' truncated successfully",
			});
		});
	} catch (err) {
		console.error(err);
		// Rollback transaction in case of error
		await query("ROLLBACK");
		return res.status(500).json({
			success: false,
			message: "Failed to truncate database",
		});
	}
};

export default {
	checkAvailability,
	getDashboard,
	getStudent,
	getAllStudent,
	postAddStudent,
	postExcelUploadStudent,
	getStudentView,
	postStudentEdit,
	deleteStudent,
	getFaculty,
	getAllFaculty,
	postAddFaculty,
	getFacultyView,
	postFacultyEdit,
	deleteFaculty,
	getAttendance,
	getSettings,
	changePassword,
	backupSql,
	getSubjects,
	getAllSubjects,
	postAddSubject,
	postExcelUploadSubjects,
	postSubjectEdit,
	deleteSubject,
	getClasses,
	getAllClasses,
	postAddClass,
	postClassEdit,
	deleteClass,
	truncateDatabase,
};
