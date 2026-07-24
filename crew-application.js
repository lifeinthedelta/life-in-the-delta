document.getElementById("crewApplication").addEventListener("submit", function (event) {
  event.preventDefault();

  const form = new FormData(event.target);
  const value = (name) => form.get(name) || "Not provided";

  const subject = encodeURIComponent("Crew Application - " + value("name"));

  const body = encodeURIComponent(
`JOIN OUR CREW APPLICATION

Name: ${value("name")}
Email: ${value("email")}
Phone: ${value("phone")}
City/State: ${value("city")}
Age: ${value("age")}

Position Interested In:
${value("position")}

Experience:
${value("experience")}

Equipment Owned:
${value("equipment")}

Availability:
${value("availability")}

Portfolio or Demo Reel:
${value("portfolio")}

Why They Want to Join:
${value("why")}

Additional Information:
${value("additional")}

Applicant understands this is currently a volunteer opportunity: ${value("volunteer")}`
  );

  window.location.href =
    "mailto:deltahouseproductions@outlook.com?subject=" +
    subject +
    "&body=" +
    body;
});
