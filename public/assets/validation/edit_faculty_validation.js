!(function () {
	"use strict";
	class e {
		static initValidation() {
			// Initialize jQuery validation for faculty
			jQuery(".edit-faculty-validation").validate({
				rules: {
					name: {
						required: true,
						minlength: 2,
					},
					username: {
						required: true,
						minlength: 3,
						remote: {
							url: "/admin/availability",
							type: "POST",
							data: {
								id: function () {
									return $("#edit-id").val();
								},
								field: "username",
								value: function () {
									return $("#edit-username").val();
								},
								user: "faculty",
							},
							dataType: "json",
							async: true,
							dataFilter: function (response) {
								var json = JSON.parse(response);
								return json.available ? "true" : "false";
							},
						},
					},
					email: {
						required: true,
						email: true,
						remote: {
							url: "/admin/availability",
							type: "POST",
							data: {
								id: function () {
									return $("#edit-id").val();
								},
								field: "email",
								value: function () {
									return $("#edit-email").val();
								},
								user: "faculty",
							},
							dataType: "json",
							async: true,
							dataFilter: function (response) {
								var json = JSON.parse(response);
								return json.available ? "true" : "false";
							},
						},
					},
					password: {
						required: false,
						minlength: 6,
					},
					confirm_password: {
						required: false,
						equalTo: "#edit-password",
					},
					is_active: {
						required: true,
					},
					registration_status: {
						required: true,
					}
				},
				messages: {
					name: {
						required: "Please enter the name",
						minlength:
							"The name must consist of at least 2 characters",
					},
					username: {
						required: "Please enter a username",
						minlength:
							"The username must consist of at least 3 characters",
						remote: "This username is not available",
					},
					email: {
						required: "Please enter the email address",
						email: "Please enter a valid email address",
						remote: "This email is already registered",
					},
					password: {
						required: "Please provide a password",
						minlength:
							"Your password must be at least 6 characters long",
					},
					confirm_password: {
						required: "Please confirm your password",
						equalTo: "Passwords do not match",
					},
					is_active: {
						required: "Please select a status",
					},
					registration_status: {
						required: "Please select a status",
					}
				},
				submitHandler: function (form) {
					const submitButton =
						document.getElementById("submit-button");
					const spinner =
						submitButton.querySelector(".spinner-border");
					// Show spinner and disable button
					spinner.style.display = "inline-block";
					submitButton.disabled = true;
					submitButton.innerHTML =
						'<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Inserting...';

					const formData = new FormData(form); // Collect form data

					fetch("/admin/faculty/edit", {
						method: "POST",
						body: formData,
					})
						.then((response) => response.json())
						.then((data) => {
							spinner.style.display = "none";
							submitButton.disabled = false;
							submitButton.innerHTML =
								'Insert <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>';
							if (data.success) {
								const modal =
									document.querySelector("#editFaculty"); // Updated to correct modal ID
								if (modal) {
									const modalInstance =
										bootstrap.Modal.getInstance(modal);
									if (modalInstance) {
										modalInstance.hide(); // Close the modal
									}
								}
								$.notify(
									{
										type: "success",
										icon: "fa fa-check me-1",
										message: data.message,
									},
									{
										type: "success",
										allow_dismiss: false,
									}
								);
								form.reset(); // Reset the form
								table.ajax.reload(null, false);
							} else {
								$.notify(
									{
										type: "danger",
										icon: "fa fa-times-circle me-1",
										message: data.message,
									},
									{
										type: "danger",
										allow_dismiss: false,
									}
								);
							}
						})
						.catch((error) => {
							spinner.style.display = "none";
							submitButton.disabled = false;
							submitButton.innerHTML =
								'Insert <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>';
							$.notify(
								{
									type: "danger",
									icon: "fa fa-times-circle me-1",
									message:
										"An error occurred. Please try again.",
								},
								{
									type: "danger",
									allow_dismiss: false,
								}
							);
							console.error("Error:", error);
						});
				},
			});
		}

		static init() {
			this.initValidation();
		}
	}

	// Call init function on document ready
	$(document).ready(() => e.init());
})();
