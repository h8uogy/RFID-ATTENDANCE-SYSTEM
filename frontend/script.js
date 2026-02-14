// LOGIN PAGE SCRIPT

const loginForm = document.getElementById("loginForm");
const roleSelect = document.getElementById("role");
const teacherCodeBox = document.getElementById("teacherCodeBox");

const API_URL = "/"; // backend routes are relative


// Show / hide teacher code input
roleSelect.addEventListener("change", () => {
  teacherCodeBox.style.display =
    roleSelect.value === "teacher" ? "block" : "none";
});

// Handle login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    section: document.getElementById("section").value,
    role: document.getElementById("role").value,
    teacherCode: document.getElementById("teacherCode")?.value.trim()
  };

  // Basic validation
  if (!data.name || !data.email || !data.section || !data.role) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Login failed");
      return;
    }

    // Save user session
    localStorage.setItem("user", JSON.stringify(result));

    // Redirect based on role
    if (result.role === "teacher") {
      window.location.href = "Teacher.html";
    } else {
      window.location.href = "Student.html";
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Cannot connect to backend");
  }
});
