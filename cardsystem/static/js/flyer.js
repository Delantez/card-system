document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const submitButton = document.querySelector(".btn-primary");

    // Utility to show message card
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

    // Form validation
    const validateForm = () => {
        let isValid = true;

        // Validate required fields
        const fields = [
            { name: "name", message: "Flyer Name is required" },
            { name: "description", message: "Flyer Description is required" },
        ];

        fields.forEach((field) => {
            const input = form.querySelector(`[name="${field.name}"]`);
            if (!input.value.trim()) {
                showMessageCard(field.message, false);
                input.focus();
                isValid = false;
            }
        });

        // Validate flyer file
        const flyerFileInput = form.querySelector('[name="flyer_file"]');
        const flyerFile = flyerFileInput.files[0];
        if (!flyerFile) {
            showMessageCard("Please upload a Flyer file", false);
            flyerFileInput.focus();
            isValid = false;
        } else {
            const allowedExtensions = ["application/pdf", "image/jpeg", "image/png"];
            if (!allowedExtensions.includes(flyerFile.type)) {
                showMessageCard(
                    "Flyer file must be a PDF or an image file (jpg, jpeg, png)",
                    false
                );
                flyerFileInput.focus();
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
        formData.append("name", form.querySelector('[name="name"]').value);
        formData.append(
            "description",
            form.querySelector('[name="description"]').value
        );
        formData.append(
            "flyer_file",
            form.querySelector('[name="flyer_file"]').files[0]
        );

        try {
            const response = await fetch("http://127.0.0.1:8080/api/flyers/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your authentication token
                },
                body: formData,
            });

            if (response.ok) {
                showMessageCard("Flyer added successfully!", true);
                setTimeout(() => {
                    window.location.href = "/dashboard/"; // Redirect to the flyers page
                }, 3000); // Redirect after 3 seconds
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
                showMessageCard(
                    "Failed to add flyer. Please try again.",
                    false
                );
            }
        } catch (error) {
            console.error("Error:", error);
            showMessageCard("An error occurred. Please try again.", false);
        }
    });
});
