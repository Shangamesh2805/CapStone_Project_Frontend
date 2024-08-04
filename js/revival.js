document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const customerPolicyID = localStorage.getItem("selectedPolicyID");
    const revivalDate = new Date().toLocaleDateString();

    const policyIDSpan = document.getElementById("policyID");
    const revivalDateSpan = document.getElementById("revivalDate");
    const revivalForm = document.getElementById("revivalForm");
    const reasonInput = document.getElementById("reason");
    const messageDiv = document.getElementById("message");

    if (!token || !customerPolicyID) {
        window.location.href = "MyPolicies.html";
        return;
    }

    policyIDSpan.textContent = customerPolicyID;
    revivalDateSpan.textContent = revivalDate;

    revivalForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const reason = reasonInput.value;
        const revivalData = {
            customerPolicyID: customerPolicyID,
            revivalDate: new Date().toISOString(),
            reason: reason
        };

        fetch(`http://localhost:5104/api/Revival/add`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(revivalData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            messageDiv.textContent = data.message;
            messageDiv.classList.remove("hidden");
            messageDiv.style.color = "green";

            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        })
        .catch(error => {
            messageDiv.textContent = "Error processing revival: " + error.message;
            messageDiv.classList.remove("hidden");
            messageDiv.style.color = "red";
        });
    });
});
