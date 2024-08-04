
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const policyID = localStorage.getItem("selectedPolicyID");
    const policyDetailsContainer = document.getElementById("policyDetailsContainer");

    if (!token || !policyID) {
        window.location.href = "../../html/Customer/MyPolicies.html";
        return;
    }

    fetch(`http://localhost:5104/api/CustomerPolicy/GetByCustomer/${policyID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "*/*"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            policyDetailsContainer.innerHTML = `
                <h3>Policy ID: ${data.policyID}</h3>
                <p>Status: ${data.status}</p>
                <p>Discount Eligibility: ${data.discountEligibility}</p>
                <!-- Add other policy details here -->
            `;
        }
    })
    .catch(error => console.error("Error fetching policy details:", error));
});
