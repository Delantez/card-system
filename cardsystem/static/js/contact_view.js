document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("contact-table-body");

    // Function to fetch and display contacts
    const fetchContacts = async () => {
        try {
            // Replace with your API endpoint
            console.log("Authorization Header:", `Bearer ${localStorage.getItem('access')}`);
            console.log("Logged-in User:", userName);
            const response = await fetch("/api/contacts/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Include auth token if required
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch contacts. Please check the API.");
            }

            const contacts = await response.json();

            // Populate the table
            tableBody.innerHTML = ""; // Clear existing content
            if (contacts.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="text-muted">No contacts available</td></tr>`;
            } else {
                contacts.forEach((contact, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${contact.first_name}</td>
                        <td>${contact.last_name}</td>
                        <td>${contact.phone}</td>
                        <td>${contact.email}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
            tableBody.innerHTML = `<tr><td colspan="5" class="text-danger">Error loading contacts. Please try again later.</td></tr>`;
        }
    };

    // Call the fetch function when the page loads
    fetchContacts();
});
