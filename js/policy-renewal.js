document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const customerPolicyID = localStorage.getItem("selectedPolicyID");
    const policyDetailsContainer = document.getElementById("policyDetailsContainer");
    const renewButton = document.getElementById("renewButton");

    if (!token || !customerPolicyID) {
        window.location.href = "MyPolicies.html";
        return;
    }

    fetch(`http://localhost:5104/api/CustomerPolicy/Get/${customerPolicyID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "*/*"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error fetching policy details: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            const expiryDate = new Date(data.expiryDate).toLocaleDateString();
            policyDetailsContainer.innerHTML = `
                <h3>Policy Status: ${data.status}</h3>
                <p>Policy ID: ${data.policyID}</p>
                <p>Expiry Date: ${expiryDate}</p>
            `;
        }
    })
    .catch(error => {
        console.error("Error fetching policy details:", error);
        policyDetailsContainer.innerHTML = `<p>${error.message}</p>`;
    });

    renewButton.addEventListener("click", function () {
        fetch(`http://localhost:5104/api/Renewal/add/${customerPolicyID}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            localStorage.setItem("renewalID", data.renewalID);
            localStorage.setItem("renewalAmount", data.renewalAmount); 
            window.location.href = "../../html/Customer/payment.html"; // Navigate to payment page
        })
        .catch(error => alert("Error processing renewal: " + error.message));
    });
});
