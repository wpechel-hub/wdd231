const membersContainer = document.querySelector("#members-container");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

async function getMembers() {
  try {
    const response = await fetch("./data/members.json");
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    membersContainer.innerHTML = `<p>Business directory could not be loaded.</p>`;
    console.error(error);
  }
}

function displayMembers(members) {
  membersContainer.innerHTML = "";

  members.forEach((member) => {
    const card = document.createElement("article");
    card.classList.add("member-card");

    const levelText = getMembershipLevel(member.membership);
    const levelClass = member.membership === 3 ? "gold" : "silver";

    card.innerHTML = `
      <div class="member-card-top">
        <h2 class="member-name">${member.name}</h2>
        <p class="member-tagline">${member.tagline}</p>
      </div>

      <div class="member-card-body">
        <img class="member-logo" src="./images/${member.image}" alt="${member.name}" loading="lazy">

        <div class="member-info">
          <p><strong>Email</strong> <span>${member.email}</span></p>
          <p><strong>Phone</strong> <span>${member.phone}</span></p>
          <p><strong>URL</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.websiteText}</a></p>

          <div class="member-level ${levelClass}">
            ${levelText} Member
          </div>
        </div>
      </div>
    `;

    membersContainer.appendChild(card);
  });
}

function getMembershipLevel(level) {
  if (level === 3) return "Gold";
  if (level === 2) return "Silver";
  return "Basic";
}

gridButton.addEventListener("click", () => {
  membersContainer.classList.add("grid");
  membersContainer.classList.remove("list");
});

listButton.addEventListener("click", () => {
  membersContainer.classList.add("list");
  membersContainer.classList.remove("grid");
});

getMembers();