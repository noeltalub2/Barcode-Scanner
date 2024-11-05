!(function () {
	"use strict";
	class e {
		static initValidation() {
			// Initialize jQuery validation
			jQuery(".add-student-validation").validate({
				rules: {
					student_id: {
						required: true,
						minlength: 9,
						remote: {
							url: "/admin/availability",
							type: "POST",
							data: {
								field: "student_id",
								value: function () {
									return $("#student_id").val();
								},
								user: "student",
							},
							dataType: "json",
							async: true, // Ensures that the request is asynchronous
							dataFilter: function (response) {
								// Handle response to check if the email is available
								var json = JSON.parse(response);
								return json.available ? "true" : "false";
							},
						},
					},
					name: {
						required: true,
						minlength: 2,
					},

					degree: {
						required: true,
						minlength: 2,
					},

					year_section: {
						required: true,
						minlength: 2,
					},

					email: {
						required: true,
						email: true,
						remote: {
							url: "/admin/availability",
							type: "POST",
							data: {
								field: "email",
								value: function () {
									return $("#email").val();
								},
								user: "student",
							},
							dataType: "json",
							async: true, // Ensures that the request is asynchronous
							dataFilter: function (response) {
								// Handle response to check if the email is available
								var json = JSON.parse(response);
								return json.available ? "true" : "false";
							},
						},
					},
				},
				messages: {
					student_id: {
						required: "Please enter the student number",
						minlength:
							"The student number must consist of at least 9 characters",
						remote: "This student number is already registered",
					},
					name: {
						required: "Please enter the name",
						minlength:
							"The name must consist of at least 2 characters",
					},
					degree: {
						required: "Please enter the degree program",
						minlength:
							"The degree program must consist of at least 2 characters",
					},
					year_section: {
						required: "Please enter the year and section",
						minlength:
							"The year and section must consist of at least 2 characters",
					},
					email: {
						required: "Please enter the email address",
						email: "Please enter a valid email address",
						remote: "This email is already registered",
					},

					// Other messages
				},
				submitHandler: function (form, event) {
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

					fetch("/admin/student", {
						method: "POST",
						body: formData,
					})
						.then((response) => response.json())
						.then((data) => {
							spinner.style.display = "none";
							submitButton.disabled = false;
							submitButton.innerHTML =
								'<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style="display: none;"></span>Insert';
							if (data.success) {
								
								const modal =
									document.querySelector("#addUser"); // Replace with your modal's ID
								if (modal) {
									const modalInstance =
										bootstrap.Modal.getInstance(modal); // Bootstrap 5
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
								// Reset the form
								form.reset();
								table.ajax.reload(null, false); 
							} else {
								$.notify(
									{
										type: "danger",
										icon: "fa fa-check me-1",
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
								'<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style="display: none;"></span>Insert';
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
