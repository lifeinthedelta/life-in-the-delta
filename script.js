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

const townFallbackImage = (town, era) => {
  const background = era === "Then" ? "171b17" : "1d2b21";
  const accent = era === "Then" ? "c99a46" : "e6c886";
  const label = encodeURIComponent(`${town} — ${era}`);
  return `https://placehold.co/1200x760/${background}/${accent}?text=${label}`;
};

const commonsFile = filename =>
  `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}?width=1200`;

const deltaTowns = {
  cleveland: {
    name: "Cleveland",
    coords: [33.7440, -90.7248],
    status: "Home Base",
    description: "The home base of Life in the Delta and the starting point for the series.",
    historic: {
      image: commonsFile("Downtown Historic District (Cleveland, Mississippi).jpg"),
      title: "Historic downtown",
      caption: "A look at Cleveland’s historic commercial center."
    },
    present: {
      image: commonsFile("Grover Hotel.JPG"),
      title: "A Cleveland landmark",
      caption: "The Grover Hotel, photographed in the modern era."
    }
  },
  shaw: {
    name: "Shaw",
    coords: [33.6029, -90.7668],
    status: "Future Story Location",
    description: "A close-knit Delta town with local history, family stories, and community pride.",
    historic: {
      image: "https://www.mshistorynow.mdah.ms.gov/sites/default/files/styles/large/public/2021-11/italians_cuicchi_home.jpg",
      title: "Life near Shaw",
      caption: "A historic Delta-Italian family gathering place east of Shaw."
    },
    present: {
      image: townFallbackImage("Shaw", "Now"),
      title: "Present-day Shaw",
      caption: "A current local photograph can be added here."
    }
  },
  ruleville: {
    name: "Ruleville",
    coords: [33.7251, -90.5512],
    status: "Future Story Location",
    description: "A possible stop for community features, businesses, and hometown personalities.",
    historic: {
      image: commonsFile("IC Depot, 1976, Ruleville, Miss. (30320033341).jpg"),
      title: "Ruleville depot",
      caption: "The Illinois Central depot in a historic archival image."
    },
    present: {
      image: commonsFile("Water Towers, Ruleville, Mississippi.jpg"),
      title: "Ruleville water towers",
      caption: "A recognizable present-day view from Ruleville."
    }
  },
  indianola: {
    name: "Indianola",
    coords: [33.4509, -90.6551],
    status: "Future Story Location",
    description: "Music, food, culture, and local life offer many possible stories.",
    historic: {
      image: commonsFile("IndianolaPostOfficeMS.jpg"),
      title: "Historic post office",
      caption: "Indianola’s historic post office building."
    },
    present: {
      image: commonsFile("BB King Museum and Delta Interpretive Center in Indianola, Mississippi showing the cotton gin.jpg"),
      title: "B.B. King Museum",
      caption: "The museum and interpretive center honoring the Delta blues legend."
    }
  },
  greenville: {
    name: "Greenville",
    coords: [33.4101, -91.0618],
    status: "Future Story Location",
    description: "A major Delta city with river culture, events, businesses, and unforgettable personalities.",
    historic: {
      image: commonsFile("Greenville, Miss., from the air.jpg"),
      title: "Historic Greenville",
      caption: "An archival view of the city and its built landscape."
    },
    present: {
      image: commonsFile("Greenville, MS - WWII Monument.jpg"),
      title: "Greenville today",
      caption: "A modern view featuring one of Greenville’s public landmarks."
    }
  },
  clarksdale: {
    name: "Clarksdale",
    coords: [34.2001, -90.5709],
    status: "Future Story Location",
    description: "Known for blues history, arts, tourism, and a strong creative community.",
    historic: {
      image: commonsFile("1940 Census Enumeration District Descriptions - Mississippi - Coahoma County - ED 14-22, ED 14-23, ED 14-24, ED 14-25, ED 14-26 - NARA - 5871936.jpg"),
      title: "Historic Clarksdale record",
      caption: "A 1940-era archival record documenting the city."
    },
    present: {
      image: commonsFile("Delta Avenue in Clarksdale, Mississippi.png"),
      title: "Delta Avenue",
      caption: "A modern downtown view of Clarksdale."
    }
  },
  greenwood: {
    name: "Greenwood",
    coords: [33.5162, -90.1795],
    status: "Future Story Location",
    description: "A possible destination for food, history, business, and lifestyle features.",
    historic: {
      image: commonsFile("FOUR CORNERS HISTORIC DISTRICT, GREENWOOD, LEFLORE COUNTY, MS.jpg"),
      title: "Old Greenwood Library",
      caption: "A historic Greenwood building dating to the early twentieth century."
    },
    present: {
      image: commonsFile("Greenwood, MS (20220125-RD-LSC-0059).jpg"),
      title: "Downtown Greenwood",
      caption: "Churches and storefronts in downtown Greenwood in 2022."
    }
  },
  leland: {
    name: "Leland",
    coords: [33.4057, -90.8973],
    status: "Future Story Location",
    description: "A Delta town with art, agriculture, culture, and hometown stories.",
    historic: {
      image: commonsFile("Rex theatre.jpg"),
      title: "The Rex Theatre",
      caption: "A historic 1937 view from downtown Leland."
    },
    present: {
      image: commonsFile("Leland Mississippi Kermit Water tower.jpg"),
      title: "Kermit water tower",
      caption: "A colorful modern landmark along Highway 61."
    }
  }
};

function initializeDeltaMap() {
  const mapElement = document.getElementById("delta-map");
  if (!mapElement || typeof L === "undefined") return;

  const selectedTown = document.getElementById("selected-town");
  const townFilter = document.getElementById("town-filter");
  const townModal = document.getElementById("town-modal");
  const map = L.map(mapElement, { scrollWheelZoom: false, zoomControl: true });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const markers = {};
  const allCoordinates = [];

  function loadTownImage(imageElement, source, fallback, alt) {
    imageElement.onerror = () => {
      imageElement.onerror = null;
      imageElement.src = fallback;
    };
    imageElement.alt = alt;
    imageElement.src = source;
  }

  function openTownModal(town) {
    const historicImage = document.getElementById("town-historic-image");
    const presentImage = document.getElementById("town-present-image");

    document.getElementById("town-modal-title").textContent = town.name;
    document.getElementById("town-modal-status").textContent = town.status;
    document.getElementById("town-modal-description").textContent = town.description;

    document.getElementById("town-historic-title").textContent = town.historic.title;
    document.getElementById("town-historic-caption").textContent = town.historic.caption;
    document.getElementById("town-present-title").textContent = town.present.title;
    document.getElementById("town-present-caption").textContent = town.present.caption;

    loadTownImage(
      historicImage,
      town.historic.image,
      townFallbackImage(town.name, "Then"),
      `${town.historic.title} in ${town.name}`
    );
    loadTownImage(
      presentImage,
      town.present.image,
      townFallbackImage(town.name, "Now"),
      `${town.present.title} in ${town.name}`
    );

    townModal.classList.add("open");
    townModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    townModal.querySelector(".town-modal-close")?.focus();
  }

  function closeTownModal() {
    townModal.classList.remove("open");
    townModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll("[data-close-town-modal]").forEach(element => {
    element.addEventListener("click", closeTownModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && townModal.classList.contains("open")) {
      closeTownModal();
    }
  });

  const updatePanel = town => {
    selectedTown.innerHTML = `
      <span>${town.status}</span>
      <strong>${town.name}</strong>
      <p>${town.description}</p>
      <button class="map-gallery-button" type="button">View Then &amp; Now</button>
    `;
    selectedTown.querySelector(".map-gallery-button")
      ?.addEventListener("click", () => openTownModal(town));
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
    marker.bindTooltip(`${town.name} — click for Then & Now`, {
      direction: "top",
      offset: [0, -15]
    });

    marker.on("click", () => {
      updatePanel(town);
      townFilter.value = key;
      openTownModal(town);
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
        <p>Choose a marker or town above to see its Then &amp; Now gallery.</p>
      `;
      return;
    }

    const town = deltaTowns[key];
    if (!town) return;

    map.flyTo(town.coords, 12, { duration: 1.1 });
    updatePanel(town);
    openTownModal(town);
  });

  setTimeout(() => map.invalidateSize(), 200);
}

window.addEventListener("load", initializeDeltaMap);


document.querySelectorAll(".social-card").forEach((card, index) => {
  card.style.transitionDelay = `${index * 45}ms`;
});
