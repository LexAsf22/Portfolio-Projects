/* carousel.js — fully automatic, no manual controls */
(function () {
    const slides = document.querySelector('.carousel-slides');
    const total  = document.querySelectorAll('.carousel-slide').length;
    let current  = 0;

    function next() {
        current = (current + 1) % total;
        slides.style.transform = `translateX(-${current * 100}%)`;
    }

    setInterval(next, 3500);

    // Show/hide password toggle
    const pwToggle = document.getElementById('pwToggle');
    const pwInput  = document.getElementById('password');
    if (pwToggle && pwInput) {
        pwToggle.addEventListener('click', () => {
            const show = pwInput.type === 'password';
            pwInput.type         = show ? 'text' : 'password';
            pwToggle.textContent = show ? 'Hide' : 'Show';
        });
    }
})();