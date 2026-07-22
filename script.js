const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();


const deltaTowns = {
  cleveland: {
    name: "Cleveland",
    coords: [33.7440, -90.7248],
    status: "Home Base",
    description: "The heart of the show and the starting point for community stories."
  },
  shaw: {
    name: "Shaw",
    coords: [33.6029, -90.7668],
    status: "Future Story Location",
    description: "A Delta community with local history and hometown stories."
  },
  ruleville: {
    name: "Ruleville",
    coords: [33.7251, -90.5512],
    status: "Future Story Location",
    description: "A possible stop for people, businesses, and community features."
  },
  indianola: {
    name: "Indianola",
    coords: [33.4509, -90.6551],
    status: "Future Story Location",
    description: "Music, food, history, and community life offer plenty of story ideas."
  },
  greenville: {
    name: "Greenville",
    coords: [33.4101, -91.0618],
    status: "Future Story Location",
    description: "A major Delta city with events, businesses, river culture, and local personalities."
  },
  clarksdale: {
    name: "Clarksdale",
    coords: [34.2001, -90.5709],
    status: "Future Story Location",
    description: "Blues history, arts, tourism, and community stories make this a strong future stop."
  },
  greenwood: {
    name: "Greenwood",
    coords: [33.5162, -90.1795],
    status: "Future Story Location",
    description: "A possible location for food, history, business, and lifestyle features."
  }
};

function initializeDeltaMap() {
  const mapElement = document.getElementById("delta-map");
  if (!mapElement || typeof L === "undefined") return;

  const map = L.map(mapElement, {
    scrollWheelZoom: false
  }).setView([33.72, -90.66], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const markers = {};

  Object.entries(deltaTowns).forEach(([key, town]) => {
    const isHome = key === "cleveland";
    const icon = L.divIcon({
      className: "",
      html: `<span class="delta-marker${isHome ? " home" : ""}" aria-hidden="true"></span>`,
      iconSize: isHome ? [34, 34] : [28, 28],
      iconAnchor: isHome ? [17, 17] : [14, 14],
      popupAnchor: [0, -17]
    });

    const marker = L.marker(town.coords, {
      icon,
      title: town.name
    }).addTo(map);

    marker.bindPopup(
      `<strong>${town.name}</strong>
       <span>${town.status}</span>
       <p>${town.description}</p>`
    );

    markers[key] = marker;
  });

  const fullBounds = L.latLngBounds(Object.values(deltaTowns).map((town) => town.coords));
  map.fitBounds(fullBounds.pad(0.18));

  const townFilter = document.getElementById("town-filter");
  townFilter?.addEventListener("change", (event) => {
    const selected = event.target.value;

    if (selected === "all") {
      map.fitBounds(fullBounds.pad(0.18));
      map.closePopup();
      return;
    }

    const town = deltaTowns[selected];
    const marker = markers[selected];

    if (town && marker) {
      map.flyTo(town.coords, 12, { duration: 1.1 });
      marker.openPopup();
    }
  });
}

window.addEventListener("load", initializeDeltaMap);
