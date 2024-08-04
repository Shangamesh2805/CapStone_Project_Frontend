document.addEventListener('DOMContentLoaded', async () => {
    const policyDetailsContainer = document.getElementById('policy-details');
    const policyId = localStorage.getItem('policyId');
    const token = localStorage.getItem('token');

    if (!token || !policyId) {
        alert('Unable to find the requested policy. Please try again.');
        window.location.href = '../../html/Customer/policy.html';
        return;
    }

    try {
         
        const response = await fetch(`http://localhost:5104/api/InsurancePolicy/Get/${policyId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch policy details.');
        }

        const policy = await response.json();

         
        policyDetailsContainer.innerHTML = `
            <h2>${policy.policyName}</h2>
            <p><strong>Policy Number:</strong> ${policy.policyNumber}</p>
            <p><strong>Type:</strong> ${policy.policyType}</p>
            <p><strong>Coverage Amount:</strong> ${policy.coverageAmount}</p>
            <p><strong>Premium Amount:</strong> ${policy.premiumAmount}</p>
            <p><strong>Renewal Amount:</strong> ${policy.renewalAmount}</p>
            <p><strong>Start Date:</strong> ${new Date(policy.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> ${new Date(policy.endDate).toLocaleDateString()}</p>
            <p><strong>Description:</strong> ${policy.description || 'No description available.'}</p>
        `;

        
        document.getElementById('apply-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to apply for this policy?')) {
                applyForPolicy(policy.policyID);
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching policy details. Please try again later.');
    }
});

 
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
