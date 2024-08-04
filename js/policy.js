document.addEventListener('DOMContentLoaded', async () => {
    const policiesContainer = document.getElementById('policies-container');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You are not logged in. Please login to view policies.');
        window.location.href = '../../html/login.html';
        return;
    }

    try {
        // Fetch all policies
        const response = await fetch('http://localhost:5104/api/InsurancePolicy/GetAllPolicies', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const policies = data.$values || [];

        // Render policies
        if (policies.length === 0) {
            policiesContainer.innerHTML = '<p>No available policies.</p>';
        } else {
            policies.forEach(policy => {
                const policyCard = document.createElement('div');
                policyCard.classList.add('policy-card');
                policyCard.innerHTML = `
                    <div class="policy-details">
                        <h3>${policy.policyName}</h3>
                        <p>Policy Number: ${policy.policyNumber}</p>
                        <p>Type: ${policy.policyType}</p>
                        <p>Coverage Amount: ${policy.coverageAmount}</p>
                        <p>Premium Amount: ${policy.premiumAmount}</p>
                    </div>
                    <div class="policy-actions">
                        <button class="details">Details</button>
                        <button class="apply">Apply</button>
                    </div>
                `;
                policiesContainer.appendChild(policyCard);

                // Handle Details button click
                policyCard.querySelector('.details').addEventListener('click', () => {
                    localStorage.setItem('policyId', policy.policyID);
                    window.location.href = '../../html/Customer/policy-details.html';
                });

                // Handle Apply button click
                policyCard.querySelector('.apply').addEventListener('click', () => {
                    if (confirm('Are you sure you want to apply for this policy?')) {
                        applyForPolicy(policy.policyID);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching policies. Please try again later.');
    }
});

// Function to apply for a policy

function raiseClaim(policyID) {
    localStorage.setItem("selectedPolicyID", policy.policyID);
    window.location.href = "../../html/Customer/raise-claim.html";
}

async function applyForPolicy(policyID) {
    const token = localStorage.getItem('token');
    const applyPolicyUrl = 'http://localhost:5104/api/CustomerPolicy/ApplyPolicy';
    const requestBody = {
        policyID: policyID,
        status: 'Active'
    };

    try {
        const response = await fetch(applyPolicyUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        if (response.ok) {
            alert('Policy applied successfully.');
        } else {
            alert(`Failed to apply for policy: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while applying for the policy. Please try again later.');
    }
}
