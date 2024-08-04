document.addEventListener('DOMContentLoaded', async () => {
    const customerPolicyDetailsContainer = document.getElementById('customerPolicyDetails');
    const customerPolicyID = localStorage.getItem('selectedPolicyID');
    const token = localStorage.getItem('token');
    
    console.log('customerPolicyID:', customerPolicyID);
    console.log('token:', token);

    if (!token || !customerPolicyID) {
        alert('Unable to find the requested customer policy. Please try again.');
        window.location.href = '../../html/Customer/MyPolicies.html';
        return;
    }

    try {
         
        const response = await fetch(`http://localhost:5104/api/CustomerPolicy/${customerPolicyID}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch customer policy details. Status: ${response.status}`);
        }

        const customerPolicy = await response.json();

         
        customerPolicyDetailsContainer.innerHTML = `
            <div class="policy-card">
                <p>Policy ID: ${customerPolicy.policyID}</p>
                <p>Status: ${customerPolicy.status}</p>
                <p>Start Date: ${new Date(customerPolicy.startDate).toLocaleDateString()}</p>
                <p>Expiry Date: ${new Date(customerPolicy.expiryDate).toLocaleDateString()}</p>
                <p>Discount Eligibility: ${customerPolicy.discountEligibility}</p>
                <p>Coverage Amount: ${customerPolicy.coverageAmount}</p>
                <p>Premium Amount: ${customerPolicy.premiumAmount}</p>
            </div>
            <div class="claims">
                <h3>Claims</h3>
                ${customerPolicy.claims.$values.map(claim => `
                    <div class="claim-card">
                        <p>Claim ID: ${claim.claimID}</p>
                        <p>Claim Date: ${new Date(claim.claimDate).toLocaleDateString()}</p>
                        <p>Status: ${claim.claimStatus}</p>
                        <p>Amount: ${claim.claimAmount}</p>
                        <p>Reason: ${claim.reason}</p>
                    </div>
                `).join('')}
            </div>
            <div class="payments">
                <h3>Payments</h3>
                ${customerPolicy.payments.$values.map(payment => `
                    <div class="payment-card">
                        <p>Payment ID: ${payment.paymentID}</p>
                        <p>Date: ${new Date(payment.date).toLocaleDateString()}</p>
                        <p>Amount: ${payment.amount}</p>
                        <p>Type: ${payment.paymentType}</p>
                    </div>
                `).join('')}
            </div>
            <div class="renewals">
                <h3>Renewals</h3>
                ${customerPolicy.renewals.$values.map(renewal => `
                    <div class="renewal-card">
                        <p>Renewal ID: ${renewal.renewalID}</p>
                        <p>Date: ${new Date(renewal.renewalDate).toLocaleDateString()}</p>
                        <p>Amount: ${renewal.renewalAmount}</p>
                        <p>Discount Applied: ${renewal.discountApplied}</p>
                        <p>Is Renewed: ${renewal.isRenewed}</p>
                    </div>
                `).join('')}
            </div>
            <div class="revivals">
                <h3>Revivals</h3>
                ${customerPolicy.revivals.$values.length > 0 ? customerPolicy.revivals.$values.map(revival => `
                    <div class="revival-card">
                        <p>Revival ID: ${revival.revivalID}</p>
                        <p>Date: ${new Date(revival.revivalDate).toLocaleDateString()}</p>
                        <p>Reason: ${revival.reason}</p>
                        <p>Status: ${revival.status}</p>
                    </div>
                `).join('') : '<p>No revivals available.</p>'}
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching customer policy details. Please try again later.');
    }
});

function viewPolicyDetails(customerPolicyID) {
    localStorage.setItem("selectedPolicyID", customerPolicyID);
    window.location.href = "../../html/Customer/CustomerPolicyDetails.html";
}
