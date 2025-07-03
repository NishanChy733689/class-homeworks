function validate(e) {
  e.preventDefault();
  let msg = '';
  let err = false;
  let col = 'green';
  let name = (document.getElementById('name') as HTMLInputElement).value;
  let age = (document.getElementById('age') as HTMLInputElement).value;
  let email = (document.getElementById('email') as HTMLInputElement).value;
  let password = (document.getElementById('password') as HTMLInputElement).value;
  let res = document.getElementById('res');
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
  } else {
    res.innerHTML = 'Login Successful';
    res.style.color = col;
  }

  //The password strenght part

  let passwordEl = document.getElementById('password') as HTMLInputElement;
  if (password !== '') {
    let strengthMsg = '';
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      strengthMsg = 'Password strength: Weak';

      passwordEl.style.backgroundColor = 'rgb(255, 0, 0)';
    } else if (strength === 3) {
      strengthMsg = 'Password strength: Medium';

      passwordEl.style.backgroundColor = 'rgb(255, 166, 0)';
    } else if (strength === 4 || strength === 5) {
      strengthMsg = 'Password strength: Strong';

      passwordEl.style.backgroundColor = 'rgb(13, 227, 13)';
    }

    res.innerHTML += '<mark>' + '<br>' + strengthMsg + '</mark>';
  } else {
    passwordEl.style.backgroundColor = '';
  }
}
