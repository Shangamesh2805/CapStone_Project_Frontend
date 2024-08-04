document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customerID"); 
    const profileContainer = document.getElementById("profileContainer");

    if (!token) {
        window.location.href = "../../html/login.html";
        return;
    }

    fetch(`http://localhost:5104/api/Customer/GetCustomerById/${customerId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "accept": "*/*"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            document.getElementById("name").innerText = data.name;
            document.getElementById("address").innerText = data.address;
            document.getElementById("phone").innerText = data.phone;
            document.getElementById("dateOfBirth").innerText = new Date(data.dateOfBirth).toLocaleDateString();
        }
    })
    .catch(error => console.error("Error fetching customer data:", error));

    function logout() {
        
        localStorage.removeItem("token");
        localStorage.removeItem("selectedPolicyID");
        localStorage.removeItem("PolicyID");
        
        window.location.href = "../../html/login.html";
    }
    
});
function logout() {
        
    localStorage.removeItem("token");
    localStorage.removeItem("selectedPolicyID");
    localStorage.removeItem("PolicyID");
    
    window.location.href = "../../html/login.html";
}
