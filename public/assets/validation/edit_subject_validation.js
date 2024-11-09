(function () {
    "use strict";
    class e {
        static initValidation() {
            // Initialize jQuery validation for subjects
            jQuery(".edit-subject-validation").validate({
                rules: {
                    subject_name: {
                        required: true,
                        minlength: 2,
                    },
                    subject_code: {
                        required: true,
                        minlength: 3,
                    },
                    description: {
                        required: true,
                        minlength: 10,
                    },
                    semester: {
                        required: true,
                    },
                    academic_year: {
                        required: true,
                        minlength: 4,
                        maxlength: 9, // Example: "2023-2024"
                    },
                    time_day: {
                        required: true,
                    },
                    type: {
                        required: true,
                    },
                },
                messages: {
                    subject_name: {
                        required: "Please enter the subject name",
                        minlength: "The subject name must consist of at least 2 characters",
                    },
                    subject_code: {
                        required: "Please enter a subject code",
                        minlength: "The subject code must consist of at least 3 characters",
                    },
                    description: {
                        required: "Please provide a description",
                        minlength: "The description must be at least 10 characters long",
                    },
                    semester: {
                        required: "Please select the semester",
                    },
                    academic_year: {
                        required: "Please enter the academic year",
                        minlength: "Please enter a valid academic year (e.g., 2023-2024)",
                        maxlength: "Academic year should be in 'YYYY-YYYY' format",
                    },
                    time_day: {
                        required: "Please specify the time/day",
                    },
                    type: {
                        required: "Please specify the type",
                    },
                },
                submitHandler: function (form) {
                    const submitButton = document.getElementById("submit-button");
                    const spinner = submitButton.querySelector(".spinner-border");

                    // Show spinner and disable button
                    spinner.style.display = "inline-block";
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Updating...';

                    const formData = new FormData(form); // Collect form data

                    fetch("/admin/subjects/edit", {
                        method: "POST",
                        body: formData,
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        spinner.style.display = "none";
                        submitButton.disabled = false;
                        submitButton.innerHTML = 'Update <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>';

                        if (data.success) {
                            const modal = document.querySelector("#editSubject"); // Correct modal ID for editing
                            if (modal) {
                                const modalInstance = bootstrap.Modal.getInstance(modal);
                                if (modalInstance) {
                                    modalInstance.hide(); // Close the modal after successful edit
                                }
                            }

                            $.notify({
                                type: "success",
                                icon: "fa fa-check me-1",
                                message: data.message,
                            }, {
                                type: "success",
                                allow_dismiss: false,
                            });

                            form.reset(); // Reset the form
                            table.ajax.reload(null, false); // Reload the table without resetting pagination
                        } else {
                            $.notify({
                                type: "danger",
                                icon: "fa fa-times-circle me-1",
                                message: data.message,
                            }, {
                                type: "danger",
                                allow_dismiss: false,
                            });
                        }
                    })
                    .catch((error) => {
                        spinner.style.display = "none";
                        submitButton.disabled = false;
                        submitButton.innerHTML = 'Update <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>';

                        $.notify({
                            type: "danger",
                            icon: "fa fa-times-circle me-1",
                            message: "An error occurred. Please try again.",
                        }, {
                            type: "danger",
                            allow_dismiss: false,
                        });
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
