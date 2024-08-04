document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const renewalID = localStorage.getItem("renewalID");
    const renewalAmount = parseFloat(localStorage.getItem("renewalAmount"));

    const paymentForm = document.getElementById("paymentForm");
    const amountInput = document.getElementById("amount");
    const messageDiv = document.getElementById("message");
    const renewalIDElement = document.getElementById("renewalID");
    const renewalAmountElement = document.getElementById("renewalAmount");

    if (!token || !renewalID || isNaN(renewalAmount)) {
        window.location.href = "MyPolicies.html";
        return;
    }

    renewalIDElement.textContent = `Renewal ID: ${renewalID}`;
    renewalAmountElement.textContent = `Amount to be Paid: $${renewalAmount.toFixed(2)}`;

    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const enteredAmount = parseFloat(amountInput.value);

        if (enteredAmount !== renewalAmount) {
            messageDiv.textContent = "Please enter the correct renewal amount.";
            messageDiv.classList.remove("hidden");
            messageDiv.style.color = "red";
        } else {
            const paymentData = {
                renewalID: renewalID,
                amount: enteredAmount
            };

            fetch(`http://localhost:5104/api/Payment/renewal?renewalId=${renewalID}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(paymentData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                messageDiv.textContent = "Payment successful!";
                messageDiv.classList.remove("hidden");
                messageDiv.style.color = "green";

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            })
            .catch(error => {
                messageDiv.textContent = "Error processing payment: " + error.message;
                messageDiv.classList.remove("hidden");
                messageDiv.style.color = "red";
            });
        }
    });
});
