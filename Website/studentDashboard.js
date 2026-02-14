document.addEventListener("DOMContentLoaded", async () => {
 const API_URL = "/"; // backend routes are relative

  // ELEMENTS
  const nameEl = document.getElementById("studentName");
  const sectionEl = document.getElementById("studentSection");
  const tableBody = document.querySelector("#attendanceTable tbody");

  const presentCount = document.querySelector(".present-circle span");
  const lateCount = document.querySelector(".late-circle span");
  const absentCount = document.querySelector(".absent-circle span");

  // SAFETY CHECK
  if (!nameEl || !sectionEl || !tableBody) {
    console.error("Required HTML elements not found");
    return;
  }

  // GET LOGGED-IN USER
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "student") {
    alert("Please log in first");
    window.location.href = "Login.html";
    return;
  }

  // SET BASIC INFO
  nameEl.textContent = user.name;
  sectionEl.textContent = user.section;

  try {
    // FETCH ATTENDANCE BY SECTION
    const res = await fetch(
      `${API_URL}/attendance?section=${encodeURIComponent(user.section)}`
    );

    if (!res.ok) {
      alert("Failed to load attendance");
      return;
    }

    const records = await res.json();

    let present = 0;
    let late = 0;
    let absent = 0;

    tableBody.innerHTML = "";

    // FILTER ONLY THIS STUDENT
    const studentRecords = records.filter(
      r => r.name === user.name
    );

    if (studentRecords.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="2" style="text-align:center;">
            No attendance records found
          </td>
        </tr>
      `;
    } else {
      studentRecords.forEach(record => {
        const tr = document.createElement("tr");

        const date = new Date(record.timestamp).toLocaleDateString();

        tr.innerHTML = `
          <td>${date}</td>
          <td class="${record.status.toLowerCase()}">${record.status}</td>
        `;

        tableBody.appendChild(tr);

        if (record.status === "Present") present++;
        if (record.status === "Late") late++;
        if (record.status === "Absent") absent++;
      });
    }

    // UPDATE COUNTERS
    presentCount.textContent = present;
    lateCount.textContent = late;
    absentCount.textContent = absent;

  } catch (err) {
    console.error("Dashboard error:", err);
    alert("Cannot connect to server");
  }
});
