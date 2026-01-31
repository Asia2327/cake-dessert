/* =====================================================
   GLOBAL SELECTORS & UTILS
===================================================== */
// Bu fonksiyon, eleman sayfada yoksa hata almamızı engeller
const safeQuery = (id) => document.getElementById(id);

/* =====================================================
   CORE LOGIC (DOMContentLoaded içinde)
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    
    // Selectors
    const header = safeQuery('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const reservationForm = safeQuery("reservationForm"); // HTML'de id="reservationForm" olmalı
    const reservationsList = safeQuery("reservationsList");
    const editForm = safeQuery("editForm");
    const authLink = safeQuery("authLink");

    let editingId = null;

    /* --- NAVBAR Smooth Scroll --- */
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
                }
            }
        });
    });

    /* --- SCROLL EFFECTS --- */
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 120) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        if (header) {
            header.style.boxShadow = window.scrollY > 50 ? '0 5px 15px rgba(0,0,0,0.2)' : 'none';
        }
    });

    /* --- 1. REZERVASYON OLUŞTURMA --- */
    if (reservationForm) {
        reservationForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const sessionRes = await fetch("/session-status");
            const sessionData = await sessionRes.json();

            if (!sessionData.loggedIn) {
                alert("Please login first");
                window.location.href = "/login";
                return;
            }

            const reservation = {
                name: safeQuery("name")?.value,
                email: safeQuery("email")?.value,
                persons: safeQuery("persons")?.value,
                date: safeQuery("date")?.value,
                time: safeQuery("time")?.value,
                message: safeQuery("message")?.value || ""
            };

            const res = await fetch("/reserve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservation)
            });

            if (res.ok) {
                reservationForm.reset();
                alert("Reservation created ✅");
            } else {
                alert("Error while booking");
            }
        });
    }

    /* --- 2. REZERVASYONLARI LİSTELEME --- */
    async function loadMyReservations() {
        if (!reservationsList) return;

        try {
            const res = await fetch("/my-reservations");
            if (res.status === 401) return; 

            const data = await res.json();
            reservationsList.innerHTML = "";

            if (!data || data.length === 0) {
                reservationsList.innerHTML = "<p>No reservations found.</p>";
                return;
            }

           // script.js içindeki data.forEach kısmını bununla güncelle:
data.forEach(r => {
    const card = document.createElement('div');
    card.className = 'reservation-card';
    card.innerHTML = `
        <p>📅 <strong>Date:</strong> ${r.date}</p>
        <p>⏰ <strong>Time:</strong> ${r.time}</p>
        <p>👥 <strong>Persons:</strong> ${r.persons} People</p>
        <div style="margin-top:15px;">
            <button onclick="editReservation(${r.id}, '${r.date}', '${r.time}', ${r.persons})">⚙️ Update</button>
            <button onclick="deleteReservation(${r.id})">🗑️ Delete</button>
        </div>
    `;
    reservationsList.appendChild(card);
});
        } catch (err) {
            console.error("Load error:", err);
        }
    }

    /* --- 3. GÜNCELLEME VE SİLME --- */
    window.deleteReservation = async function(id) {
        if (!confirm("Are you sure?")) return;
        const res = await fetch(`/reserve/${id}`, { method: "DELETE" });
        if (res.ok) loadMyReservations();
    };

    window.editReservation = function(id, date, time, persons) {
        editingId = id;
        if (safeQuery("editPersons")) safeQuery("editPersons").value = persons;
        if (safeQuery("editDate")) safeQuery("editDate").value = date;
        if (safeQuery("editTime")) safeQuery("editTime").value = time;

        if (editForm) {
            editForm.style.display = "block";
            window.scrollTo({ top: editForm.offsetTop - 100, behavior: "smooth" });
        }
    };

    if (editForm) {
        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const updated = {
                persons: safeQuery("editPersons").value,
                date: safeQuery("editDate").value,
                time: safeQuery("editTime").value,
                name: "Updated", // Backend update rotası name beklediği için ekledik
                email: "Updated" 
            };

            const res = await fetch(`/reserve/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            });

            if (res.ok) {
                editForm.style.display = "none";
                loadMyReservations();
                alert("Updated successfully!");
            }
        });
    }

    /* --- 4. AUTH / PROFİL İKONU --- */
    if (authLink) {
        authLink.addEventListener("click", async (e) => {
            e.preventDefault();
            const res = await fetch("/session-status");
            const data = await res.json();
            window.location.href = data.loggedIn ? "mybookings.html" : "login.html";
        });
    }

    // İlk yükleme
    loadMyReservations();
});