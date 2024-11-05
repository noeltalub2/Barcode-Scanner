!(function () {
    "use strict";
    class e {
        static initValidation() {
            // Initialize jQuery validation for editing a class
            jQuery(".edit-class-validation").validate({
                rules: {
                    class_name: {
                        required: true,
                        minlength: 2,
                    },
                    room_number: {
                        required: true,
                        minlength: 1,
                    },
                    subject_id: {
                        required: true,
                    },
                    faculty_id: {
                        required: true,
                    },
                },
                messages: {
                    class_name: {
                        required: "Please enter the class name",
                        minlength: "The class name must consist of at least 2 characters",
                    },
                    room_number: {
                        required: "Please enter the room number",
                        minlength: "The room number must be at least 1 character long",
                    },
                    subject_id: {
                        required: "Please select a subject",
                    },
                    faculty_id: {
                        required: "Please select a faculty member",
                    },
                },
                submitHandler: function (form) {
                    const submitButton = document.getElementById("edit-submit-button"); // Change to edit button
                    const spinner = submitButton.querySelector(".spinner-border");
                    // Show spinner and disable button
                    spinner.style.display = "inline-block";
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Updating...';

                    const formData = new FormData(form); // Collect form data

                    fetch("/admin/class/edit", { // Update URL for editing
                        method: "POST",
                        body: formData,
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        spinner.style.display = "none";
                        submitButton.disabled = false;
                        submitButton.innerHTML = 'Update <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" style="display: none;"></span>';
                        if (data.success) {
                            const modal = document.querySelector("#editClass"); // Change to edit modal
                            if (modal) {
                                const modalInstance = bootstrap.Modal.getInstance(modal);
                                if (modalInstance) {
                                    modalInstance.hide(); // Close the modal
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
                            table.ajax.reload(null, false); 
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
