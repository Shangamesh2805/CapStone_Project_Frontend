$(document).ready(function() {
     
    $('#login-form').submit(function(e) {
        e.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();  
        $.ajax({
            url: 'http://localhost:5104/api/Auth/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email: email, password: password }),  
            success: function(response) {
                alert('Login successful!');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('token', response.token);
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('role', response.role);

                 
                if (response.role === 'Agent') {
                    window.location.href = '../html/Agent/Agent-index.html';
                } else {
                    window.location.href = '../html/Customer/index.html';
                }
            },
            error: function(error) {
                alert('Login failed: ' + error.responseText);
            }
        });
    });

     
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (isLoggedIn && token) {
        $('#nav-links').html(`
            <li><a href="../html/Customer/index.html">Home</a></li>
            <li><a href="../../html/Customer/AboutUs.html">About</a></li>
            <li><a href="../../html/Customer/policy.html">Policies</a></li>
            <li><a href="../../html/Customer/MyPolicies.html">MyPolicies</a></li>
            <li><a href="../../html/Customer/profile.html">Profile</a></li>
            <li><a href="#" id="logout">Logout</a></li>
        `);

         
        $('#logout').click(function() {
            localStorage.clear();
            window.location.href = '../../html/login.html';
        });
    } else {
         
        $('#nav-links').html(`
            <li><a href="../html/Customer/index.html">Home</a></li>
            <li><a href="../../html/Customer/AboutUs.html">About</a></li>
            <li><a href="../../html/Customer/policy.html">Policies</a></li>
            <li><a href="../../html/login.html">Login</a></li>
            <li><a href="../../html/register.html">Register</a></li>
        `);
    }
});
