const roleSelect = document.getElementById("role");
const studentFields = document.getElementById("studentFields");
const teacherFields = document.getElementById("teacherFields");
const signupForm = document.getElementById("signupForm");

// ===============================
// TOGGLE FIELDS
// ===============================
roleSelect.addEventListener("change", () => {
  if (roleSelect.value === "student") {
    studentFields.style.display = "block";
    teacherFields.style.display = "none";
  } else if (roleSelect.value === "teacher") {
    studentFields.style.display = "none";
    teacherFields.style.display = "block";
  } else {
    studentFields.style.display = "none";
    teacherFields.style.display = "none";
  }
});

// ===============================
// SUBMIT SIGNUP
// ===============================
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const role = roleSelect.value;
  let payload = { role };

  if (role === "student") {
    const name = document.getElementById("studentName").value.trim();
    const section = document.getElementById("studentSection").value;
    const parentEmail = document.getElementById("parentEmail").value.trim();

    if (!name || !section || !parentEmail) {
      alert("Please complete all student fields");
      return;
    }

    payload = { role, name, section, parentEmail };
  } else if (role === "teacher") {
    const name = document.getElementById("teacherName").value.trim();
    const section = document.getElementById("teacherSection").value;
    const email = document.getElementById("teacherEmail").value.trim();
    const teacherCode = document.getElementById("teacherCode").value.trim();

    if (!name || !section || !email || !teacherCode) {
      alert("Please complete all teacher fields");
      return;
    }

    payload = { role, name, section, email, teacherCode };
  } else {
    alert("Please select a role");
    return;
  }

  try {
    const res = await fetch("/signup", {   // <-- relative URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Signup failed");
      return;
    }

    alert("Signup successful!");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Cannot connect to backend");
  }
});
