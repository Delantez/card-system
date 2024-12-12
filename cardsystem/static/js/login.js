async function login() {
    const company_name = document.getElementById('company_name').value;
    const password = document.getElementById('password').value;

    const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ company_name, password }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        window.location.href = HOME_URL;
    } else {
        alert('Login failed: Invalid credentials');
    }
}

function getCSRFToken() {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    return csrfToken || '';
}

// Add event listener for the login button
document.getElementById('login-button').addEventListener('click', login);
