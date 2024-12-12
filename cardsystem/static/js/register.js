document.getElementById("registrationForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const company = document.getElementById("company").value;
    const location = document.getElementById("location").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch("/auth/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: company,
                last_name: location,
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            alert("Registration successful!");
            window.location.href = "/home_view/";
        } else {
            const data = await response.json();
            alert(`Error: ${data.detail || "Something went wrong"}`);
        }
    } catch (error) {
        console.error(error);
        alert("Error registering company!");
    }
});
