// Ensure the DOM is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", () => {
    // Select the form and input elements by their IDs
    const form = document.getElementById("form");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const error = document.getElementById("error");
    const success = document.getElementById("success");

    // Check if the form element exists
    if (!form) {
        console.error("Form element with ID 'form' not found");
        return;
    }

    // Add an event listener to handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page

        // Construct the login object with email and password
        const login = {
            email: email.value,
            password: password.value,
        };

        // Send a POST request to the login API endpoint
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(login), // Send the login data as a JSON string
            headers: {
                "Content-Type": "application/json", // Indicate JSON content type
            },
        })
            .then((res) => res.json()) // Parse the response as JSON
            .then((data) => {
                // Handle the response from the server
                if (data.status === "error") {
                    // Display error message if login fails
                    error.style.display = "block";
                    success.style.display = "none";
                    error.innerText = data.error;
                } else {
                    // Display success message if login succeeds
                    error.style.display = "none";
                    success.style.display = "block";
                    success.innerText = data.success;
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    }
                }
            })
            .catch((err) => {
                // Handle unexpected errors
                console.error("Error:", err);
                error.style.display = "block";
                success.style.display = "none";
                error.innerText = "An unexpected error occurred.";
            });
    });
});

