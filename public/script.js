document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');


    if (href.startsWith('#')) {
      e.preventDefault();
      const targetSection = document.querySelector(href);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 90,
          behavior: 'smooth'
        });
      }
    }

  });
});


// ===============================
// Active Link on Scroll
// ===============================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar ul li a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===============================
// Sticky Header Shadow on Scroll
// ===============================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    header.style.transform = 'translateZ(0)'; // 3D effect
  } else {
    header.style.boxShadow = 'none';
    header.style.transform = 'none';
  }
});

// ===============================
// Section Fade-in Animation
// ===============================
const faders = document.querySelectorAll('section');

const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll){
  entries.forEach(entry => {
    if(!entry.isIntersecting){
      return;
    } else {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      entry.target.style.transition = 'all 1s ease-out';
      appearOnScroll.unobserve(entry.target);
    }
  });
}, appearOptions);

faders.forEach(fader => {
  fader.style.opacity = 0;
  fader.style.transform = 'translateY(50px)';
  appearOnScroll.observe(fader);
});

// ===============================
// Button Hover Animation
// ===============================
const buttons = document.querySelectorAll('.btn, .btn-submit');
buttons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-5px) scale(1.05)';
    btn.style.transition = 'all 0.3s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0) scale(1)';
  });
});

// ===============================
// Navbar Link 3D Hover
// ===============================
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.style.transform = 'translateZ(5px) rotateX(2deg)';
    link.style.transition = 'all 0.3s ease';
  });
  link.addEventListener('mouseleave', () => {
    link.style.transform = 'none';
  });
});

// ===============================
// Contact Form Validation
// ===============================
const form = document.querySelector('#contact form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const persons = document.getElementById('persons').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!name || !email || !persons || !date || !time) {
    alert('Please fill in all required fields.');
    return;
  }

  const resultBox = document.getElementById('reservation-result');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const persons = document.getElementById('persons').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!name || !email || !persons || !date || !time) {
    alert('Please fill in all required fields.');
    return;
  }

  // Show data on the page
  document.getElementById('r-name').textContent = name;
  document.getElementById('r-email').textContent = email;
  document.getElementById('r-persons').textContent = persons;
  document.getElementById('r-date').textContent = date;
  document.getElementById('r-time').textContent = time;

  resultBox.style.display = 'block';
});

});

// Fade-in when scrolling through all sections
const allSections = document.querySelectorAll('section');

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

allSections.forEach(section => sectionObserver.observe(section));

// Buttons hover effect 
const allBtns = document.querySelectorAll('.btn, .btn-submit');

allBtns.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.05) translateY(-3px)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1) translateY(0)';
  });
});

// Navbar hover 
const navLinksEnh = document.querySelectorAll('.navbar ul li a');

navLinksEnh.forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.style.color = '#6D2932';
    link.style.transform = 'translateY(-2px)';
  });
  link.addEventListener('mouseleave', () => {
    link.style.color = '';
    link.style.transform = 'translateY(0)';
  });
});


//navbar

const indicator = document.querySelector('.nav-indicator');
const links = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar ul');

function moveIndicator(element) {
    const rect = element.getBoundingClientRect();
    const navRect = navbar.getBoundingClientRect();

    indicator.style.width = rect.width + 'px';
    indicator.style.height = rect.height + 'px';
    indicator.style.left = (rect.left - navRect.left) + 'px';
    indicator.style.top = (rect.top - navRect.top) + 'px';
}
// When the mouse hovers
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        moveIndicator(link);
    });
});

// When the mouse exits, it returns to the active link
navbar.addEventListener('mouseleave', () => {
    const active = document.querySelector('.nav-link.active');
    moveIndicator(active);
});

// Formatting when the page loads
window.addEventListener('load', () => {
    const active = document.querySelector('.nav-link.active');
    moveIndicator(active);

// Reset after a short moment to ensure font loading
    setTimeout(() => {
        moveIndicator(active);
    }, 100);
});


// ===============================
// Book a Table - CRUD (User Side)
// ===============================

const reservationForm = document.querySelector('#contact form');
const reservationsList = document.getElementById('reservations-list');

// CREATE reservation
reservationForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const reservation = {
    name: name.value,
    email: email.value,
    persons: persons.value,
    date: date.value,
    time: time.value,
    message: message.value
  };

  const response = await fetch('/reserve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservation)
  });

  if (response.ok) {
    reservationForm.reset();
    loadReservations();
  } else {
    alert('Error while booking reservation');
  }
});

// READ reservations
async function loadReservations() {
  const res = await fetch('/reserve');
  const data = await res.json();

  reservationsList.innerHTML = '';

  data.forEach(r => {
    reservationsList.innerHTML += `
      <div class="reservation-card" data-id="${r.id}">
        <p><strong>Name:</strong> ${r.name}</p>
        <p><strong>Email:</strong> ${r.email}</p>
        <p><strong>Persons:</strong> ${r.persons}</p>
        <p><strong>Date:</strong> ${r.date}</p>
        <p><strong>Time:</strong> ${r.time}</p>
        <p><strong>Message:</strong> ${r.message || ''}</p>

        <button onclick="editReservation(${r.id})">Update</button>
        <button onclick="deleteReservation(${r.id})">Delete</button>
        <hr>
      </div>
    `;
  });
}

// DELETE
async function deleteReservation(id) {
  await fetch(`/reserve/${id}`, { method: 'DELETE' });
  loadReservations();
}

// UPDATE (fill form)
async function editReservation(id) {
  const res = await fetch(`/reserve/${id}`);
  const r = await res.json();

  name.value = r.name;
  email.value = r.email;
  persons.value = r.persons;
  date.value = r.date;
  time.value = r.time;
  message.value = r.message;

  reservationForm.onsubmit = async function (e) {
    e.preventDefault();

    await fetch(`/reserve/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        persons: persons.value,
        date: date.value,
        time: time.value,
        message: message.value
      })
    });

    reservationForm.reset();
    reservationForm.onsubmit = null;
    loadReservations();
  };
}

// Load reservations on page load
loadReservations();



