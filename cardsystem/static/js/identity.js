document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const submitButton = document.querySelector(".btn-primary");

    // Utility to show a message card
    const showMessageCard = (message, isSuccess) => {
        const messageCard = document.createElement("div");
        messageCard.style.position = "fixed";
        messageCard.style.top = "50%";
        messageCard.style.left = "50%";
        messageCard.style.transform = "translate(-50%, -50%)";
        messageCard.style.padding = "20px";
        messageCard.style.borderRadius = "10px";
        messageCard.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        messageCard.style.color = "#fff";
        messageCard.style.fontSize = "18px";
        messageCard.style.backgroundColor = isSuccess ? "#28a745" : "#dc3545";
        messageCard.style.zIndex = "1000";
        messageCard.innerText = message;

        document.body.appendChild(messageCard);

        setTimeout(() => {
            messageCard.remove();
        }, 3000); // Card disappears after 3 seconds
    };

    // Validation function
    const validateForm = () => {
        let isValid = true;

        // Validate required fields
        const fields = [
            { name: "first_name", message: "First Name is required" },
            { name: "last_name", message: "Last Name is required" },
            { name: "id_number", message: "ID Number is required" },
            { name: "position", message: "Position is required" },
            { name: "expiry_date", message: "Expiry Date is required" },
            { name: "work_status", message: "Work Status is required" },
        ];

        fields.forEach((field) => {
            const input = form.querySelector(`[name="${field.name}"]`);
            if (!input.value.trim()) {
                showMessageCard(field.message, false);
                input.focus();
                isValid = false;
                return;
            }
        });

        // Validate ID Number
        const idInput = form.querySelector('[name="id_number"]');
        const idValue = idInput.value.trim();
        if (!/^[a-zA-Z0-9]{1,15}$/.test(idValue)) {
            showMessageCard(
                "ID Number must be alphanumeric and not exceed 15 characters",
                false
            );
            idInput.focus();
            isValid = false;
        }

        // Validate Photograph (image file only)
        const photographInput = form.querySelector('[name="photograph"]');
        const photographFile = photographInput.files[0];
        if (!photographFile) {
            showMessageCard("Please upload a Photograph", false);
            photographInput.focus();
            isValid = false;
        } else {
            const allowedExtensions = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            if (!allowedExtensions.includes(photographFile.type)) {
                showMessageCard(
                    "Photograph must be an image file (jpg, jpeg, png, gif)",
                    false
                );
                photographInput.focus();
                isValid = false;
            }
        }

        return isValid;
    };

    // Submit event handler
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("first_name", form.querySelector('[name="first_name"]').value);
        formData.append("last_name", form.querySelector('[name="last_name"]').value);
        formData.append("id_number", form.querySelector('[name="id_number"]').value);
        formData.append("photograph", form.querySelector('[name="photograph"]').files[0]);
        formData.append("position", form.querySelector('[name="position"]').value);
        formData.append("expiry_date", form.querySelector('[name="expiry_date"]').value);
        formData.append("work_status", form.querySelector('[name="work_status"]').value);   

        try {
            const response = await fetch("http://127.0.0.1:8080/api/identities/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your authentication token
                },
                body: formData,
            });

            if (response.ok) {
                showMessageCard("Identity added successfully!", true);
                setTimeout(() => {
                    window.location.href = "/dashboard/"; // Redirect to dashboard
                }, 3000); // Redirect after 3 seconds
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
                showMessageCard("Failed to add identity. Please try again.", false);
            }
        } catch (error) {
            console.error("Error:", error);
            showMessageCard("An error occurred. Please try again.", false);
        }
    });
});
