document.addEventListener('DOMContentLoaded', async () => {
    const claimsContainer = document.getElementById('claims-container');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You are not logged in. Please login to view claims.');
        window.location.href = '../../html/login.html';
        return;
    }

    try {
         
        const response = await fetch('http://localhost:5104/api/Claim', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const claims = data.$values || [];

      
        const pendingClaims = claims.filter(claim => claim.claimStatus === 'Pending');
        if (pendingClaims.length === 0) {
            claimsContainer.innerHTML = '<p>No pending claims.</p>';
        } else {
            pendingClaims.forEach(claim => {
                const claimCard = document.createElement('div');
                claimCard.classList.add('card');
                claimCard.innerHTML = `
                    <h3>Claim ID: ${claim.claimID}</h3>
                    <p>Claim Date: ${new Date(claim.claimDate).toLocaleDateString()}</p>
                    <p>Claim Amount: ${claim.claimAmount}</p>
                    <p>Reason: ${claim.reason}</p>
                    <button class="approve">Approve</button>
                    <button class="reject">Reject</button>
                `;
                claimsContainer.appendChild(claimCard);

                 
                claimCard.querySelector('.approve').addEventListener('click', async () => {
                    await updateClaimStatus(claim.claimID, 'approve');
                    claimCard.remove();
                });

                 
                claimCard.querySelector('.reject').addEventListener('click', async () => {
                    await updateClaimStatus(claim.claimID, 'reject');
                    claimCard.remove();
                });
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching claims. Please try again later.');
    }
});

 
async function updateClaimStatus(claimID, action) {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5104/api/Agent/Claim-${claimID}/${action}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert(`Claim ${action}d successfully.`);
        } else {
            alert(`Failed to ${action} claim: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`An error occurred while trying to ${action} the claim. Please try again later.`);
    }
}
