document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    
    const customerPolicyID = localStorage.getItem("selectedPolicyID");
   
    
    
    if (!token || !customerPolicyID) {
        console.error("Missing required data or elements");
        return;
    }

    

    const claimForm = document.getElementById("claimForm");
    claimForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const claimAmount = parseFloat(document.getElementById("claimAmount").value);
        const reason = document.getElementById("reason").value;
       

        if (!customerPolicyID || isNaN(claimAmount) || claimAmount <= 0 || !reason) {
            alert("Please fill out all fields correctly.");
            return;
        }

        const requestData = {
            customerPolicyID: customerPolicyID,
            claimAmount: claimAmount,
            reason: reason
        };

        console.log("Request Data:", requestData);
        fetch("http://localhost:5104/api/Claim/RaiseClaim", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("Error response data:", errorData);
                    throw new Error(errorData.message || 'Network response was not ok');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Response Data:", data);
            alert(data.message);
            window.location.href = "../../html/Customer/My-Policies.html"; 
        })
        .catch(error => {
            console.error("Error raising claim:", error);
            alert("Error raising claim: " + error.message);
        });
        
    });
});
