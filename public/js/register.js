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
        console.error("Form element with ID 'form-id' not found");
        return;
    }

    // Add a submit event listener to the form
    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page

        // Construct the register object with email and password
        const register = {
            email: email.value,
            password: password.value,
        };

        // Send a POST request to the register API endpoint
        fetch("/api/register", {
            method: "POST",
            body: JSON.stringify(register), // Convert the object to a JSON string
            headers: {
                "Content-Type": "application/json", // Specify JSON content type
            },
        })
            .then((res) => res.json()) // Parse the response as JSON
            .then((data) => {
                // Handle the server's response
                if (data.status === "error") {
                    error.style.display = "block";
                    success.style.display = "none";
                    error.innerText = data.error;
                } else {
                    error.style.display = "none";
                    success.style.display = "block";
                    success.innerText = data.success;
                }
            })
            .catch((err) => {
                // Handle any unexpected errors
                console.error("Error:", err);
                error.style.display = "block";
                success.style.display = "none";
                error.innerText = "An unexpected error occurred.";
            });
    });
});
