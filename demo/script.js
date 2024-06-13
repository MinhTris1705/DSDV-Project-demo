document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.getElementById('get-started-btn');
    const content = document.querySelector('.content');
    const navbarBtn = document.getElementById('navbar-btn');
    const navbarContent = document.querySelector('.navbar-content');
    const exitBtn = document.getElementById('exit-btn');
    const navbar = document.querySelector('.navbar');

    // Show content and hide hero section when 'Get Started' button is clicked
    getStartedBtn.addEventListener('click', () => {
        content.style.display = 'block';
        document.querySelector('.hero').style.display = 'none';
    });

    // Toggle navbar content display and adjust navbar width when navbar button is clicked
    navbarBtn.addEventListener('click', () => {
        if (navbar.style.width === '124px') {
            navbar.style.width = '60px';
            navbarContent.style.display = 'none';
        } else {
            navbar.style.width = '124px';
            navbarContent.style.display = 'flex';
        }
    });

    // Smooth scroll to section when navbar link is clicked
    document.querySelectorAll('.navbar-content a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Go back to hero section when 'Exit' button is clicked
    exitBtn.addEventListener('click', () => {
        content.style.display = 'none';
        document.querySelector('.hero').style.display = 'flex';
    });
});
