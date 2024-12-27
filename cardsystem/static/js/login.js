async function login() {
    const company_name = document.getElementById('company_name').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_name, password }),
        });

        if (response.ok) {
            const data = await response.json();
            // Store tokens in localStorage
            localStorage.setItem('access', data.access);
            localStorage.setItem('refresh', data.refresh);
            console.log("Access Token:", localStorage.getItem('access'));
            console.log("Refresh Token:", localStorage.getItem('refresh'));

            // Redirect to home page
            window.location.href = HOME_URL;
        } else {
            const error = await response.json();
            document.getElementById('login-error').innerText = error.error || 'Invalid credentials.';
        }
    } catch (error) {
        console.error("An error occurred during login:", error);
        document.getElementById('login-error').innerText = 'Something went wrong. Please try again.';
    }
}

// Add event listener for the login button
document.getElementById('login-button').addEventListener('click', login);
