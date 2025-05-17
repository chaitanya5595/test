async function ValidateLogin() {
    let Email = $("#login-email").val();
    let Password = $("#login-password").val();     
        try {            
            const User = {                
                "Email": Email,
                "Password": Password,
            };
            if (!Email || !Password ) {
                alert("Please fill in all fields.");
                return;
            }
                try {
                    const response = await fetch('Index?handler=ValidateUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            //'RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val() // Ensuring CSRF protection
                        },
                        body: new URLSearchParams(User)
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.status.includes("Valid User")) {
                            window.location.href = "Admin/Dashboard";
                        } else {
                            alert("Signup failed: " + data.status);
                        }
                        

                    } else {
                        console.error("Server responded with a non-OK status:", response.status);
                    }
                } catch (error) {
                    console.error("Error during fetch:", error);
                }
               
                
                       
        }
        catch (error) {
        }  

}
async function savedata() {
    let Username = $("#signup-name").val().trim();
    let userEmail = $("#signup-email").val().trim();
    let userPassword = $("#signup-password").val().trim();
    let Gender = $("#signup-gender option:selected").val();

    // 🔹 Validate inputs before proceeding
    if (!Username || !userEmail || !userPassword || !Gender) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const User = {
            "Name": Username,
            "Email": userEmail,
            "Password": userPassword,
            "Gender": Gender
        };

        // 🔹 Send data using `fetch`
        const response = await fetch('Index?handler=SaveData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(User)
        });

        if (response.ok) {
            const data = await response.json();

            // 🔹 Ensure the response confirms successful signup
            if (data.status.includes("User data saved successfully")) {
                document.getElementById("signup-container").classList.add("hidden");
                document.getElementById("success-popup").classList.remove("hidden");
            } else {
                alert("Signup failed: " + data.status);
            }
        } else {
            console.error("Server responded with an error:", response.status);
            alert("Error: Unable to save user data.");
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
    }
}

async function signup() {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("signup-container").classList.remove("hidden");
}

