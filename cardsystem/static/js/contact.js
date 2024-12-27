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

        const fields = [
            { name: "first_name", message: "First Name is required" },
            { name: "last_name", message: "Last Name is required" },
            { name: "email", message: "Email is required" },
            { name: "job", message: "Job title is required" },
            { name: "address", message: "Address is required" },
            { name: "country", message: "Country is required" },
        ];

        fields.forEach((field) => {
            const input = form.querySelector(`[name="${field.name}"]`);
            if (!input.value.trim()) {
                showMessageCard(field.message, false);
                input.focus();
                isValid = false;
                return;
            }

            // Specific validation for email
            if (field.name === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
                showMessageCard("Please enter a valid email address", false);
                input.focus();
                isValid = false;
            }
        });

        // Specific validation for phone
        const phoneInput = form.querySelector('[name="phone"]');
        const phoneValue = phoneInput.value.trim();
        const phonePattern = /^(07|06)\d{8}$/;

        if (!phonePattern.test(phoneValue)) {
            showMessageCard(
                "Phone number must start with 07 or 06 and be exactly 10 digits",
                false
            );
            phoneInput.focus();
            isValid = false;
        }

        return isValid;
    };

    // Submit event handler
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = {
            first_name: form.querySelector('[name="first_name"]').value,
            last_name: form.querySelector('[name="last_name"]').value,
            phone: form.querySelector('[name="phone"]').value,
            email: form.querySelector('[name="email"]').value,
            job: form.querySelector('[name="job"]').value,
            address: form.querySelector('[name="address"]').value,
            country: form.querySelector('[name="country"]').value,
        };

        try {
            console.log(`Bearer ${localStorage.getItem("token")}`); 
            const response = await fetch("http://127.0.0.1:8080/api/contacts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, 
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showMessageCard("Contact added successfully!", true);
                setTimeout(() => {
                    window.location.href = "/dashboard/"; // Redirect to dashboard
                }, 3000); // Redirect after 3 seconds
            } else {
                const errorData = await response.json();
                console.log(localStorage.getItem("token")); // Check if the token is correctly saved
                console.error("Error:", errorData);
                showMessageCard("Failed to add contact. Please try again.", false);
            }
        } catch (error) {
            console.error("Error:", error);
            showMessageCard("An error occurred. Please try again.", false);
        }
    });
});
