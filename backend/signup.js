document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("button");

  form.addEventListener("click", async (e) => {
    e.preventDefault();

    const role = document.querySelector("select").value;

    let data = {
      role: role,
      name: "",
      section: ""
    };

    if (role === "student") {
      data.name = document.querySelectorAll("input")[0].value;
      data.section = document.querySelectorAll("select")[1].value;
      data.parentEmail = document.querySelectorAll("input")[1].value;
    }

    if (role === "teacher") {
      data.name = document.querySelectorAll("input")[2].value;
      data.section = document.querySelectorAll("select")[2].value;
      data.email = document.querySelectorAll("input")[3].value;
      data.teacherCode = document.querySelectorAll("input")[4].value;
    }

    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);
  });
});
