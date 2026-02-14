const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("loginName").value.trim();
  const role = document.getElementById("loginRole").value;
  const section = document.getElementById("loginSection").value;

  if (!name || !role || !section) {
    alert("Please complete all login fields");
    return;
  }

  try {
    const res = await fetch("/login", {  // <-- relative URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, section })
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Login failed");
      return;
    }

    // Save user info in localStorage (keeps user logged in until browser closed)
    localStorage.setItem("user", JSON.stringify(result));

    alert("Login successful!");

    // Redirect to dashboard based on role
    if (role === "student") {
      window.location.href = "student.html";
    } else if (role === "teacher") {
      window.location.href = "teacher.html";
    }

  } catch (err) {
    console.error(err);
    alert("Cannot connect to backend");
  }
});
