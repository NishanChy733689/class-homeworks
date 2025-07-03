function validate(e) {
    e.preventDefault();
    var msg = '';
    var err = false;
    var col = 'green';
    var name = document.getElementById('name').value;
    var age = document.getElementById('age').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var res = document.getElementById('res');
    if (name == '') {
        msg += ' Name should not be empty' + '<br>';
        col = 'red';
        err = true;
    }
    if (age == '') {
        msg += 'Age should not be empty' + '<br>';
        col = 'red';
        err = true;
    }
    if (email == '') {
        msg += 'Email should not be empty' + '<br>';
        col = 'red';
        err = true;
    }
    if (password == '') {
        msg += ' Password should not be empty' + '<br>';
        col = 'red';
        err = true;
    }
    if (err == true) {
        res.innerHTML = msg;
        res.style.color = col;
    }
    else {
        res.innerHTML = 'Login Successful';
        res.style.color = col;
    }
    //The password strenght part
    var passwordEl = document.getElementById('password');
    if (password !== '') {
        var strengthMsg = '';
        var strength = 0;
        if (password.length >= 8)
            strength++;
        if (/[A-Z]/.test(password))
            strength++;
        if (/[a-z]/.test(password))
            strength++;
        if (/[0-9]/.test(password))
            strength++;
        if (/[^A-Za-z0-9]/.test(password))
            strength++;
        if (strength <= 2) {
            strengthMsg = 'Password strength: Weak';
            passwordEl.style.backgroundColor = 'rgb(255, 0, 0)';
        }
        else if (strength === 3) {
            strengthMsg = 'Password strength: Medium';
            passwordEl.style.backgroundColor = 'rgb(255, 166, 0)';
        }
        else if (strength === 4 || strength === 5) {
            strengthMsg = 'Password strength: Strong';
            passwordEl.style.backgroundColor = 'rgb(13, 227, 13)';
        }
        res.innerHTML += '<mark>' + '<br>' + strengthMsg + '</mark>';
    }
    else {
        passwordEl.style.backgroundColor = '';
    }
}
