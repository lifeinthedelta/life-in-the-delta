const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav-links");
const modal = document.getElementById("site-modal");
const modalTitle = document.getElementById("modal-title");
const modalCopy = document.getElementById("modal-copy");

document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 35);
});

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.6 });

counters.forEach(counter => counterObserver.observe(counter));

function openModal(title, copy) {
  modalTitle.textContent = title;
  modalCopy.textContent = copy;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close")?.focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".trailer-button").forEach(button => {
  button.addEventListener("click", () => {
    openModal(
      "The official teaser is coming soon.",
      "Follow the official Facebook page so you are among the first to see it."
    );
  });
});

document.querySelectorAll(".episode-info").forEach(button => {
  button.addEventListener("click", () => {
    openModal(
      button.dataset.episode,
      "This episode is currently in development. More details, photos, and release information will be added as production moves forward."
    );
  });
});

document.querySelectorAll(".gallery-tile").forEach(button => {
  button.addEventListener("click", () => {
    openModal(
      button.dataset.caption,
      "Original photos will be added to this gallery once production begins."
    );
  });
});

document.querySelectorAll("[data-close-modal]").forEach(element => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});

const deltaTowns = {
  cleveland: {
    name: "Cleveland",
    coords: [33.7440, -90.7248],
    status: "Home Base",
    description: "The home base of Life in the Delta and the starting point for the series."
  },
  shaw: {
    name: "Shaw",
    coords: [33.6029, -90.7668],
    status: "Future Story Location",
    description: "A close-knit Delta town with local history, family stories, and community pride."
  },
  ruleville: {
    name: "Ruleville",
    coords: [33.7251, -90.5512],
    status: "Future Story Location",
    description: "A possible stop for community features, businesses, and hometown personalities."
  },
  indianola: {
    name: "Indianola",
    coords: [33.4509, -90.6551],
    status: "Future Story Location",
    description: "Music, food, culture, and local life offer many possible stories."
  },
  greenville: {
    name: "Greenville",
    coords: [33.4101, -91.0618],
    status: "Future Story Location",
    description: "A major Delta city with river culture, events, businesses, and unforgettable personalities."
  },
  clarksdale: {
    name: "Clarksdale",
    coords: [34.2001, -90.5709],
    status: "Future Story Location",
    description: "Known for blues history, arts, tourism, and a strong creative community."
  },
  greenwood: {
    name: "Greenwood",
    coords: [33.5162, -90.1795],
    status: "Future Story Location",
    description: "A possible destination for food, history, business, and lifestyle features."
  },
  leland: {
    name: "Leland",
    coords: [33.4057, -90.8973],
    status: "Future Story Location",
    description: "A Delta town with art, agriculture, culture, and hometown stories."
  }
};

function initializeDeltaMap() {
  const mapElement = document.getElementById("delta-map");
  if (!mapElement || typeof L === "undefined") return;

  const selectedTown = document.getElementById("selected-town");
  const townFilter = document.getElementById("town-filter");
  const map = L.map(mapElement, { scrollWheelZoom: false, zoomControl: true });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const markers = {};
  const allCoordinates = [];

  const updatePanel = town => {
    selectedTown.innerHTML = `
      <span>${town.status}</span>
      <strong>${town.name}</strong>
      <p>${town.description}</p>
    `;
  };

  Object.entries(deltaTowns).forEach(([key, town]) => {
    allCoordinates.push(town.coords);
    const isHome = key === "cleveland";
    const icon = L.divIcon({
      className: "",
      html: `<span class="delta-marker${isHome ? " home" : ""}" aria-hidden="true"></span>`,
      iconSize: isHome ? [36, 36] : [28, 28],
      iconAnchor: isHome ? [18, 18] : [14, 14],
      popupAnchor: [0, -18]
    });

    const marker = L.marker(town.coords, { icon, title: town.name }).addTo(map);
    marker.bindPopup(`<strong>${town.name}</strong><span>${town.status}</span><p>${town.description}</p>`);
    marker.on("click", () => {
      updatePanel(town);
      townFilter.value = key;
    });
    markers[key] = marker;
  });

  const fullBounds = L.latLngBounds(allCoordinates);
  map.fitBounds(fullBounds.pad(0.16));

  townFilter.addEventListener("change", event => {
    const key = event.target.value;
    if (key === "all") {
      map.fitBounds(fullBounds.pad(0.16));
      map.closePopup();
      selectedTown.innerHTML = `
        <span>Currently viewing</span>
        <strong>The Mississippi Delta</strong>
        <p>Choose a marker or town above to learn more.</p>
      `;
      return;
    }

    const town = deltaTowns[key];
    if (!town) return;
    map.flyTo(town.coords, 12, { duration: 1.1 });
    markers[key].openPopup();
    updatePanel(town);
  });

  setTimeout(() => map.invalidateSize(), 200);
}

window.addEventListener("load", initializeDeltaMap);


document.querySelectorAll(".social-card").forEach((card, index) => {
  card.style.transitionDelay = `${index * 45}ms`;
});
