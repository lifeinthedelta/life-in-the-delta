const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav-links");
const modal = document.getElementById("site-modal");
const modalTitle = document.getElementById("modal-title");
const modalCopy = document.getElementById("modal-copy");

document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 35);
});

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

function openModal(title, copy) {
  if (!modal || !modalTitle || !modalCopy) return;
  modalTitle.textContent = title;
  modalCopy.textContent = copy;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close")?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".trailer-button").forEach(button => {
  button.addEventListener("click", () => {
    openModal(
      "The official introduction is coming soon.",
      "The video section is ready. Once your first video is uploaded, its YouTube embed can replace this preview screen."
    );
  });
});

document.querySelectorAll(".episode-info").forEach(button => {
  button.addEventListener("click", () => {
    openModal(
      button.dataset.episode || "Episode details",
      "This episode is currently in development. Interviews, locations, filming dates, and release information will be added as they are confirmed."
    );
  });
});

document.querySelectorAll(".gallery-tile").forEach(button => {
  button.addEventListener("click", () => {
    openModal(
      button.dataset.caption || "Visual journal",
      "This gallery category is ready for your original photos and production stills once filming begins."
    );
  });
});

document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal?.classList.contains("open")) closeModal();
});

const towns = {
  cleveland: {
    name: "Cleveland",
    coords: [33.7440, -90.7248],
    status: "Home Base",
    description: "The production home base and starting point for local businesses, events, arts, education, food, and community stories."
  },
  boyle: {
    name: "Boyle",
    coords: [33.7040, -90.7275],
    status: "Featured Community",
    description: "A close-knit neighboring community selected as one of the first places featured by Living in the Delta."
  }
};

function initializeMap() {
  const mapElement = document.getElementById("delta-map");
  if (!mapElement || typeof L === "undefined") return;

  const selected = document.getElementById("selected-town");
  const filter = document.getElementById("town-filter");
  const map = L.map(mapElement, { scrollWheelZoom: false }).setView([33.724, -90.726], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const markers = {};
  const bounds = [];

  function updatePanel(town) {
    selected.innerHTML = `<span>${town.status}</span><strong>${town.name}</strong><p>${town.description}</p>`;
  }

  Object.entries(towns).forEach(([key, town]) => {
    bounds.push(town.coords);
    const icon = L.divIcon({
      className: "",
      html: `<span class="delta-marker${key === "cleveland" ? " home" : ""}" aria-hidden="true"></span>`,
      iconSize: key === "cleveland" ? [36,36] : [28,28],
      iconAnchor: key === "cleveland" ? [18,18] : [14,14]
    });

    const marker = L.marker(town.coords, { icon, title: town.name }).addTo(map);
    marker.bindPopup(`<strong>${town.name}</strong><span>${town.status}</span><p>${town.description}</p>`);
    marker.on("click", () => {
      updatePanel(town);
      filter.value = key;
    });
    markers[key] = marker;
  });

  const fullBounds = L.latLngBounds(bounds);
  map.fitBounds(fullBounds.pad(0.55));

  filter?.addEventListener("change", event => {
    const key = event.target.value;
    if (key === "all") {
      map.fitBounds(fullBounds.pad(0.55));
      map.closePopup();
      selected.innerHTML = `<span>Current launch area</span><strong>Cleveland & Boyle</strong><p>Select a marker to learn more about the community and planned story focus.</p>`;
      return;
    }
    const town = towns[key];
    if (!town) return;
    map.flyTo(town.coords, 13, { duration: 1 });
    markers[key].openPopup();
    updatePanel(town);
  });

  setTimeout(() => map.invalidateSize(), 250);
}

window.addEventListener("load", initializeMap);
