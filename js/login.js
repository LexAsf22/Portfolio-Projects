const pwToggle  = document.getElementById('pwToggle');
const pwInput   = document.getElementById('password');
const emailInput = document.getElementById('email');
const loginBtn  = document.getElementById('loginBtn');
const form      = document.getElementById('loginForm');

// Password show/hide toggle
pwToggle.addEventListener('click', () => {
    const isHidden = pwInput.type === 'password';
    pwInput.type = isHidden ? 'text' : 'password';
    pwToggle.textContent = isHidden ? 'Hide' : 'Show';
});

// Validate a single field
function validateField(input) {
    const empty    = input.value.trim() === '';
    const badEmail = input.type === 'email' && !empty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    const invalid  = empty || badEmail;
    input.classList.toggle('invalid', invalid);
    return !invalid;
}

// Live validation
[emailInput, pwInput].forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) validateField(input);
    });
});

// Submit
form.addEventListener('submit', function(e) {
    const emailOk = validateField(emailInput);
    const passOk  = validateField(pwInput);
    if (!emailOk || !passOk) {
        e.preventDefault();
        return;
    }
    loginBtn.textContent = 'Signing in…';
    loginBtn.classList.add('loading');
});