document.addEventListener('DOMContentLoaded', async () => {
    const role = localStorage.getItem('role');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const revivalsContainer = document.getElementById('revivals-container');
    const noRevivalsMessage = document.getElementById('no-revivals-message');
    const token = localStorage.getItem('token');

    // Check if the user is logged in and has the "Agent" role
    if (!isLoggedIn || role !== 'Agent') {
        alert('Access denied. Please log in as an Agent to view and manage revivals.');
        window.location.href = '../../html/login.html';
        return;
    }

    try {
        // Fetch all revivals
        const response = await fetch('http://localhost:5104/api/Revival', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const revivals = data.$values || [];

        if (revivals.length === 0) {
            noRevivalsMessage.style.display = 'block';
        } else {
            revivals.forEach(revival => {
                const revivalCard = document.createElement('div');
                revivalCard.classList.add('revival-card');
                revivalCard.innerHTML = `
                    <h3>Revival ID: ${revival.revivalID}</h3>
                    <p><strong>Approved:</strong> ${revival.isApproved}</p>
                    <p><strong>Policy ID:</strong> ${revival.customerPolicyID}</p>
                    <p><strong>Date:</strong> ${new Date(revival.revivalDate).toLocaleDateString()}</p>
                    <p><strong>Reason:</strong> ${revival.reason}</p>
                    <div class="buttons">
                        <button class="btn approve">Approve</button>
                        <button class="btn reject">Reject</button>
                    </div>
                `;
                revivalsContainer.appendChild(revivalCard);

                // Approve revival
                revivalCard.querySelector('.approve').addEventListener('click', async () => {
                    await updateRevivalStatus(revival.revivalID, 'approve');
                    revivalCard.remove();
                    checkEmptyRevivals();
                });

                // Reject revival
                revivalCard.querySelector('.reject').addEventListener('click', async () => {
                    await updateRevivalStatus(revival.revivalID, 'reject');
                    revivalCard.remove();
                    checkEmptyRevivals();
                });
            });
        }
    } catch (error) {
        console.error('Error fetching revivals:', error);
        alert('An error occurred while fetching revivals. Please try again later.');
    }
});

// Function to update revival status
async function updateRevivalStatus(revivalID, action) {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5104/api/Revival/${action}/${revivalID}`;

    try {
        const response = await fetch(url, {
            method: 'PUT', // Assuming PUT method
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        let data;
        try {
            data = await response.json();
        } catch (error) {
            data = null;
        }

        if (response.ok) {
            alert(`Revival ${action}d successfully.`);
        } else {
            const message = data ? data.message : 'Unknown error occurred';
            alert(`Failed to ${action} revival: ${message}`);
        }
    } catch (error) {
        console.error(`Error ${action}ing revival:`, error);
        alert(`An error occurred while trying to ${action} the revival. Please try again later.`);
    }
}

// Function to check if there are no more revivals left
function checkEmptyRevivals() {
    const revivalsContainer = document.getElementById('revivals-container');
    const noRevivalsMessage = document.getElementById('no-revivals-message');

    if (revivalsContainer.children.length === 0) {
        noRevivalsMessage.style.display = 'block';
    }
}
