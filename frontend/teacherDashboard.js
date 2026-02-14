const API_URL = "/"; // backend routes are relative

const sectionSelect = document.getElementById("sectionSelect");
const tableBody = document.getElementById("attendanceTable");

// 🔐 SIMPLE LOGIN CHECK
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "teacher") {
  alert("Access denied. Please login as a teacher.");
  window.location.href = "Login.html";
}

// 📥 LOAD ATTENDANCE
async function loadAttendance(section) {
  if (!section) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4">Please select a section</td>
      </tr>
    `;
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/attendance?section=${section}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch attendance");
    }

    const data = await response.json();
    tableBody.innerHTML = "";

    if (data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4">No attendance records found</td>
        </tr>
      `;
      return;
    }

    data.forEach(row => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${row.uid}</td>
        <td>${row.name}</td>
        <td>${row.status}</td>
        <td>${new Date(row.timestamp).toLocaleString()}</td>
      `;

      tableBody.appendChild(tr);
    });

  } catch (error) {
    console.error("❌ Failed to load attendance:", error);
    alert("Unable to load attendance data");
  }
}

// 🔁 LOAD WHEN SECTION CHANGES
sectionSelect.addEventListener("change", () => {
  loadAttendance(sectionSelect.value);
});

// 🔄 AUTO REFRESH EVERY 5 SECONDS (only if section selected)
setInterval(() => {
  if (sectionSelect.value) {
    loadAttendance(sectionSelect.value);
  }
}, 5000);
