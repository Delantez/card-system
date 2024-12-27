const token = localStorage.getItem('access'); // JWT token from localStorage

fetch('/your-api-endpoint/', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`, // Pass JWT token in Authorization header
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    // Log the full name of the user for debugging
    console.log("Logged-in User's Full Name:", data.full_name || "Name not found");
})
.catch(error => {
    console.error("Error fetching user details:", error);
});
