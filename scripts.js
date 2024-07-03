const links = document.querySelectorAll('nav a');
const contents = document.querySelectorAll('.content');
const gameButton = document.getElementById('gameButton');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        contents.forEach(content => {
            if(content.id === targetId) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    });
});




document.getElementById('about').style.display = 'block';

gameButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});

document.addEventListener('mousemove', function(e) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);
    setTimeout(() => {
        trail.remove();
    }, 1000); 
});
