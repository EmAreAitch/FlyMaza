const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

if (btn && menu) {
  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    document.body.style.overflow = menu.classList.contains('hidden') ? '' : 'hidden';
  });

  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      menu.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
  
}

const headers = document.querySelectorAll('.collapsible-header');

headers.forEach(header => {
  header.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const content = document.getElementById(targetId);
    const icon = this.querySelector('.collapsible-icon');
    
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
      content.style.maxHeight = '0';      
      icon.style.transform = 'rotate(0deg)';
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';      
      icon.style.transform = 'rotate(180deg)';
    }
  });
});
