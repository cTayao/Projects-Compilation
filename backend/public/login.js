document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Save token in localStorage
      localStorage.setItem("token", data.token);
      document.getElementById("message").innerText = "✅ Login successful!";
      // Redirect
      window.location.href = "index.html";
    } else {
      document.getElementById("message").innerText = "❌ " + data.error;
    }
  } catch (err) {
    document.getElementById("message").innerText = "⚠️ Error: " + err.message;
  }
});
