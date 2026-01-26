const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){
  e.preventDefault(); // 🔹 Prevent default form submission

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `email=${encodeURIComponent(document.getElementById("email").value)}&password=${encodeURIComponent(document.getElementById("password").value)}`
  }).then(res => {
    if(res.redirected){
      window.location.href = res.url; // 🔹 Redirect if login successful
    } else {
      alert("Invalid email or password"); // 🔹 Show alert if failed
    }
  });
});
