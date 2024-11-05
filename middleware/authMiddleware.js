import jwt from "jsonwebtoken";
import db from "../database/connect_db.js";

const queryUserById = async (id, role) => {
	try {
		if (role === "admin") {
			const [rows] = await db
				.promise()
				.query("SELECT id, profile_url, name FROM users WHERE id = ?", [
					id,
				]);
			return rows;
		} else if (role === "faculty") {
			const [rows] = await db
				.promise()
				.query(
					"SELECT id, profile_url, name FROM faculty WHERE id = ?",
					[id]
				);
			return rows;
		} else {
			throw new Error("Invalid role"); // Handle invalid role more gracefully
		}
	} catch (err) {
		throw err;
	}
};

const requireAuth = async (req, res, next) => {
	const token = req.cookies.token;

	if (token) {
		jwt.verify(
			token,
			process.env.JWT_SECRET_KEY,
			async (err, decodedToken) => {
				if (err) {
					return res.redirect("/unauthorized");
				}

				const user = await queryUserById(
					decodedToken.id,
					decodedToken.role
				);

				if (
					user.length === 0 ||
					!["admin", "faculty"].includes(decodedToken.role)
				) {
					return res.redirect("/unauthorized");
				}

				const currentUser = user[0];
				res.locals.user = {
					id: currentUser.id,
					role: decodedToken.role,
				};

				res.locals.user_info = {
					profile_url: currentUser.profile_url || "default.jpg",
					fullname: currentUser.name,
				};

				next();
			}
		);
	} else {
		res.redirect("/unauthorized");
	}
};

const forwardAuth = async (req, res, next) => {
	const token = req.cookies.token;

	if (token) {
		jwt.verify(
			token,
			process.env.JWT_SECRET_KEY,
			async (err, decodedToken) => {
				if (err) {
					return next();
				}

				const user = await queryUserById(
					decodedToken.id,
					decodedToken.role
				);

				if (
					user.length === 0 ||
					!["admin", "faculty"].includes(decodedToken.role)
				) {
					return next();
				}

				const currentUser = user[0];
				res.locals.user = {
					id: currentUser.id,
					role: currentUser.role,
				};

				res.locals.user_info = {
					profile_url: currentUser.profile_url || "default.jpg",
					fullname: currentUser.name,
				};

				// Redirect based on role
				switch (currentUser.role) {
					case "admin":
						return res.redirect("/admin/dashboard");
					case "faculty":
						return res.redirect("/faculty/dashboard");
					default:
						return next();
				}
			}
		);
	} else {
		next();
	}
};

const checkRole = (roles) => (req, res, next) => {
	const userRole = res.locals.user.role;

	if (roles.includes(userRole)) {
		next();
	} else {
		res.redirect("/unauthorized");
	}
};

export default {
	forwardAuth,
	requireAuth,
	checkRole,
};
