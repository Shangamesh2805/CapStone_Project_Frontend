document.addEventListener('DOMContentLoaded', () => {
    const addPolicyForm = document.getElementById('addPolicyForm');

    if (addPolicyForm) {
        addPolicyForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Gather form data
            const policyName = document.getElementById('policyName').value;
            const policyNumber = document.getElementById('policyNumber').value;
            const policyType = document.getElementById('policyType').value;
            const coverageAmount = document.getElementById('coverageAmount').value;
            const premiumAmount = document.getElementById('premiumAmount').value;
            const renewalAmount = document.getElementById('renewalAmount').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            try {
                // Make an API call to the backend to add a new policy
                const response = await fetch('http://localhost:5104/api/InsurancePolicy/AddPolicy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ policyName, policyNumber, policyType, coverageAmount, premiumAmount, renewalAmount, startDate, endDate })
                });

                const data = await response.json();
                if (response.ok) {
                    document.getElementById('message').textContent = 'Policy added successfully!';
                    document.getElementById('message').classList.remove('hidden');
                    addPolicyForm.reset();
                } else {
                    alert('Failed to add policy: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }
});
