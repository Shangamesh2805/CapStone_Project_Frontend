$(document).ready(function() {
    // Check login status and update navbar
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'Agent') {
        $('#nav-links').append(`
            <li><a href="../../html/Agent/agent-profile.html">Profile</a></li>
            <li><a href="#" id="logout">Logout</a></li>
        `);
    } else {
        $('#nav-links').append(`
            <li><a href="../../html/login.html">Login</a></li>
            <li><a href="../../html/register.html">Register</a></li>
        `);
    }

    // Logout functionality
    $('#logout').click(() => {
        localStorage.clear();
        window.location.href = '../../html/login.html';
    });
});
