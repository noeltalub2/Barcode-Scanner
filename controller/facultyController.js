import query from "../database/query_db.js";
import db from "../database/connect_db.js";
import bcrypt from "bcrypt";
import readXlsxFile from "read-excel-file/node";
import fs from "fs";
import mysqldump from "mysqldump";
import moment from "moment";

const getDashboard = async (req, res) => {
	const total_student = await query(
		"SELECT COUNT(*) AS total_users FROM student_class WHERE faculty_id = ?",
		[res.locals.user.id]
	);

	const total_classes = await query(
		"SELECT COUNT(*) AS total_classes FROM classes  WHERE faculty_id = ?",
		[res.locals.user.id]
	);
	const total_subjects = await query(
		"SELECT COUNT(DISTINCT subject_id) AS total_subjects FROM classes WHERE faculty_id = ?",
		[res.locals.user.id]
	);
	const total_attendances = await query(
		"SELECT COUNT(*) AS total_attendances FROM attendance a JOIN classes c ON a.class_id = c.class_id WHERE c.faculty_id = ?",
		[res.locals.user.id]
	);
	const get_attendance = await query(
		"SELECT a.*, s.student_id, s.name AS student_name, s.email FROM attendance a JOIN classes c ON a.class_id = c.class_id JOIN student s ON a.student_id = s.student_id WHERE c.faculty_id = ? ORDER BY a.log_date DESC LIMIT 10;",
		[res.locals.user.id]
	);



	const data = {
		total_student: total_student[0].total_users,
		total_classes: total_classes[0].total_classes,
		total_subjects: total_subjects[0].total_subjects,
		total_attendances: total_attendances[0].total_attendances,
	};

	
	res.render("Faculty/dashboard", {
		title: "Dashboard",
		page: "dashboard",
		data,
		get_attendance
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
	res.render("Faculty/student", { title: "Manage Student", page: "student" });
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
		"SELECT * FROM attendance WHERE student_id = ? ORDER BY attendance_id DESC",
		student_id
	);

	res.render("Faculty/student_view", {
		title: "View Student",
		page: "student",
		student,
		attendance,
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
const postExcelUpload = async (req, res) => {
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

const getAttendance = async (req, res) => {
	const class_records = await query(
		`
		SELECT c.class_id, c.class_name, c.room_number, f.name AS faculty_name, s.subject_name
		FROM classes c
		JOIN faculty f ON c.faculty_id = f.id
		JOIN subjects s ON c.subject_id = s.subject_id
		WHERE c.faculty_id = ?
	`,
		[res.locals.user.id]
	);

	res.render("Faculty/attendance", {
		title: "Record Attendance",
		page: "attendance",
		class_records,
	});
};
const postAttendance = async (req, res) => {
	const { barcode, attendance_type, class_id } = req.body;

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

		const isRegistered = (
			await query(
				`SELECT count(*) as 'count' FROM student_class WHERE student_id = ? AND class_id = ?`,
				[barcode, class_id]
			)
		)[0].count;

		if (!isRegistered) {
			return res.status(400).json({
				status: "error",
				msg: "Student is not registered for this class",
			});
		}
		if (!class_id) {
			return res.status(400).json({
				status: "error",
				msg: "No class name selected",
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
const getAttendanceClass = async (req, res) => {
    const { class_id } = req.params;
	
    try {
        const attendance = await query(
            `SELECT a.attendance_id, a.student_id, a.class_id, a.log_date, a.status, a.logs, 
                    s.name 
             FROM attendance a 
             LEFT JOIN student s ON a.student_id = s.student_id 
             WHERE a.class_id = ? 
             ORDER BY a.log_date DESC, a.logs DESC;`,
            [class_id]  // Pass class_id to the query for filtering
        );

        // Map the results to the desired output format for DataTables
        const resultData = attendance.map((data,index) => ({
            attendance_id: index + 1,
            student_id: data.student_id,
            class_id: data.class_id,
            log_date: new Date(data.log_date ).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}),
            status: data.status,
            name: data.name,
			logs: data.logs,
        }));

        res.json({ data: resultData });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};



const getClasses = async (req, res) => {
	const class_records = await query(
		`
		SELECT c.class_id, c.class_name, s.description, c.room_number, f.name AS faculty_name, s.subject_name, s.subject_code,s.time_day, s.type,semester, s.academic_year
		FROM classes c
		JOIN faculty f ON c.faculty_id = f.id
		JOIN subjects s ON c.subject_id = s.subject_id
		WHERE c.faculty_id = ?
	`,
		[res.locals.user.id]
	);

	res.render("Faculty/class", {
		title: "Manage Classes",
		page: "class",
		class_records,
	});
};

const getClassView = async (req, res) => {
	const { class_id } = req.params;

	try {
		const class_info = (
			await query(
				`SELECT c.class_id, c.class_name, c.room_number, f.name AS faculty_name, s.description, s.subject_name, c.faculty_id ,s.subject_code,s.time_day, s.type,semester, s.academic_year
                 FROM classes c 
                 JOIN faculty f ON c.faculty_id = f.id 
                 JOIN subjects s ON c.subject_id = s.subject_id 
                 WHERE c.class_id = ?`,
				[class_id]
			)
		)[0];

		// Check if the faculty is authorized
		if (class_info.faculty_id !== res.locals.user.id) {
			return res.render("unauthorized", {
				title: "403 - Unauthorized",
				page: "unauthorized",
			});
		}

		// Query to get students and their attendance
		const student_class = await query(
			`
           SELECT sc.student_id, s.name, s.email, s.degree, s.year_section FROM student_class sc JOIN student s ON sc.student_id = s.student_id WHERE sc.class_id = ?;
        `,
			[class_id]
		);

		const student_attendance = await query(
			`
          SELECT sc.student_id, s.name, s.email, s.degree, s.year_section, a.attendance_id, a.log_date, a.status, a.logs FROM student_class sc JOIN student s ON sc.student_id = s.student_id JOIN attendance a ON sc.student_id = a.student_id WHERE sc.class_id = ? AND a.class_id = ?;
        `,
			[class_id,class_id]
		);

		const attendance_summary = await query("SELECT sc.student_id, s.name, s.email, s.degree, s.year_section, COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS present_count, COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) AS absent_count FROM student_class sc JOIN student s ON sc.student_id = s.student_id LEFT JOIN attendance a ON sc.student_id = a.student_id AND a.class_id = sc.class_id WHERE sc.class_id = ? GROUP BY sc.student_id;",
			[class_id]
		);

		

		res.render("Faculty/class_view", {
			title: "View Class",
			page: "class",
			class_info,
			student_class,student_attendance,attendance_summary
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: "Failed to fetch class details",
		});
	}
};

const getAttendanceHistoryForStudent = async (req, res) => {
	const { class_id, student_id } = req.params;
  
	try {
	  const student_attendance_history = await query(
		`
		SELECT 
		  sc.student_id, 
		  s.name, 
		  s.email, 
		  s.degree, 
		  s.year_section, 
		  a.attendance_id, 
		  a.log_date, 
		  a.status, 
		  a.logs 
		FROM 
		  student_class sc 
		JOIN 
		  student s ON sc.student_id = s.student_id 
		JOIN 
		  attendance a ON sc.student_id = a.student_id 
		WHERE 
		  sc.class_id = ? 
		  AND a.class_id = ? 
		  AND sc.student_id = ?;
		`,
		[class_id, class_id, student_id]  // Pass class_id and student_id for filtering
	  );
  
	  // Map the results to the desired output format for DataTables
	  const resultData = student_attendance_history.map((data, index) => ({
		attendance_id: index + 1,
		
		log_date: new Date(data.log_date).toLocaleDateString("en-US", {
		  year: "numeric",
		  month: "long",
		  day: "numeric",
		}),
		status: data.status,
		logs: data.logs,
	  }));
  
	  res.json({ data: resultData });
	} catch (error) {
	  console.error("Error fetching student attendance history:", error);
	  res.status(500).json({
		status: "error",
		message: "Internal server error",
	  });
	}
  };
  

const postEnrollStudent = async (req, res) => {
	const { student_id, class_id } = req.body;

	try {
		// Check if the student is already enrolled in the class
		const existingEnrollment = await query(
			"SELECT COUNT(*) as count FROM student_class WHERE student_id = ? AND class_id = ?",
			[student_id, class_id]
		);

		if (existingEnrollment[0].count > 0) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Student is already enrolled in this class",
				});
		}

		// Insert the new enrollment record
		await query(
			"INSERT INTO student_class (student_id, class_id, faculty_id) VALUES (?, ?, ?)",
			[student_id, class_id, res.locals.user.id]
		);

		return res.json({
			success: true,
			message: "Student enrolled successfully",
		});
	} catch (err) {
		return res
			.status(500)
			.json({ success: false, message: "Failed to enroll student" });
	}
};

const postExcelEnrollStudent = async (req, res) => {
	if (req.fileValidationError) {
	  return res.status(400).json({
		success: false,
		message: req.fileValidationError,
	  });
	}
  
	const filePath = `public/document/${req.file.filename}`;
  
	// Import Excel Data to MySQL database
	readXlsxFile(filePath)
	  .then(async (rows) => {
		// Remove Header ROW
		rows.shift();
  
		// Prepare an array for inserting records
		const enrollments = [];
		const errors = [];
  
		// Loop through each row of student data
		for (const row of rows) {
		  const [student_id, name, email, degree, year_section] = row;
  
		  // Check if the student is already enrolled in the class
		  const existingEnrollment = await query(
			"SELECT COUNT(*) as count FROM student_class WHERE student_id = ? AND class_id = ?",
			[student_id, req.body.class_id] // Assuming class_id is passed in the body
		  );
  
		  if (existingEnrollment[0].count > 0) {
			errors.push(`Student with ID ${student_id} is already enrolled. <br>`);
		  } else {
			// Add to the enrollment array for bulk insert
			enrollments.push([student_id, req.body.class_id, res.locals.user.id]);
		  }
		}
  
		// Insert new enrollments if there are any valid enrollments
		if (enrollments.length > 0) {
		  const insertQuery =
			"INSERT INTO student_class (student_id, class_id, faculty_id) VALUES ?";
		  await query(insertQuery, [enrollments]);
		}
  
		// Clean up the uploaded file
		fs.unlink(filePath, (err) => {
		  if (err) console.log(err); // Handle file deletion error, if any
		});
  
		// Respond with success or errors
		if (errors.length > 0) {
		  return res.status(400).json({
			success: false,
			message: `There was an error: <br>${errors.join("")}`,
		  });
		}
  
		return res.status(200).json({
		  success: true,
		  message: "Students data successfully uploaded and enrolled",
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
  

const removeStudent = async (req, res) => {
	const { student_id, class_id } = req.body;

	try {
		const query_result = await query(
			"DELETE FROM student_class WHERE student_id = ? AND faculty_id = ? AND class_id = ?",
			[student_id, res.locals.user.id, class_id]
		);
		return res.json({
			success: true,
			message: "Student removed from the class successfully",
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, message: "Failed to remove student" });
	}
};

const getProfile = async (req, res) => {
	const faculty = (await query(
		"SELECT * FROM faculty WHERE id = ?",
		[res.locals.user.id]
	))[0]

	
	res.render("Faculty/profile", { title: "Profile", page: "profile",faculty });
};

const postProfile = async (req, res) => {
	const { id, name, username, email, password } = req.body;

	try {
		// Construct the query based on whether the password is provided or not
		let query_result;
		if (password) {
			// Update with the password if provided
			query_result = await query(
				"UPDATE faculty SET name = ?, username = ?, email = ?, password = ? WHERE id = ? ",
				[name, username, email, password, id]
			);
		} else {
			// Update without changing the password
			query_result = await query(
				"UPDATE faculty SET name = ?, username = ?, email = ? WHERE id = ?",
				[name, username, email, id]
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

export default {
	checkAvailability,
	getDashboard,
	getStudent,
	getAllStudent,
	postAddStudent,
	postExcelUpload,
	getStudentView,
	postStudentEdit,
	deleteStudent,
	getAttendance,
	postAttendance,
	getClasses,
	getClassView,
	postEnrollStudent,postExcelEnrollStudent,getAttendanceHistoryForStudent,
	removeStudent,getAttendanceClass,getProfile,
	postProfile
};
