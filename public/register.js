const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(e){
  e.preventDefault(); // 🔹 Prevent default form submission

  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `name=${encodeURIComponent(document.getElementById("name").value)}&email=${encodeURIComponent(document.getElementById("email").value)}&password=${encodeURIComponent(document.getElementById("password").value)}`
  }).then(res => {
    if(res.redirected){
      window.location.href = res.url; // 🔹 Redirect to login after registration
    }
  });
});
