function validate(e) {
  e.preventDefault();
  let msg: string = '';
  let err = false;
  let nameEl = document.getElementById('name') as HTMLInputElement;
  let ageEl = document.getElementById('age') as HTMLInputElement;
  let emailEl = document.getElementById('email') as HTMLInputElement;
  let passwordEl = document.getElementById('password') as HTMLInputElement;
  let name = nameEl.value.trim();
  let age = ageEl.value.trim();
  let email = emailEl.value.trim();
  let password = passwordEl.value;
  let res = document.getElementById('res');
  let notification = document.getElementById('info');
  // Reset backgrounds
  nameEl.style.background = '';
  ageEl.style.background = '';
  emailEl.style.background = '';
  passwordEl.style.background = '';

  // Name validation
  if (name === '') {
    nameEl.placeholder = 'Name should not be empty';
    nameEl.style.background = 'rgb(255, 200, 200)';
    err = true;
  }
  // Age validation
  if (age === '') {
    ageEl.placeholder = 'Age should not be empty';
    ageEl.style.background = 'rgb(255, 200, 200)';
    err = true;
  }
  // Email validation
  if (email === '') {
    emailEl.placeholder = 'Email should not be empty';
    emailEl.style.background = 'rgb(255, 200, 200)';
    err = true;
  }
  // Password validation
  if (password === '') {
    passwordEl.placeholder = 'Password should not be empty';
    passwordEl.style.background = 'rgb(255, 200, 200)';
    err = true;
  }

  // Password strength checker (only if no errors)
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) {
    passwordEl.style.background = 'rgb(255, 0, 0)';
    err = true;
  }
  if (strength === 3) {
    passwordEl.style.background = 'rgb(255, 166, 0)';
  }
  if (strength === 4 || strength === 5) {
    passwordEl.style.background = 'rgb(13, 227, 13)';
  }
  if (err) {
    res.innerHTML = msg;
    res.style.color = 'red';
    notification.style.display="flex";
    return;
  } else {
    res.innerHTML = 'Sign-up Successful';
    res.style.color = 'green';
  }
}
