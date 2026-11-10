
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const modal = $("#location-modal");
  const locationButton = $("#location-open");
  const locationLabel = $("#location-label");
  const locationForm = $("#location-form");
  const stateSearch = $("#state-search");
  const stateList = $("#state-list");
  const locationCity = $("#location-city");
  const deliveryAddress = $("#delivery-address");
  const locationNote = $("#location-note");

  const states = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra",
    "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo",
    "Ekiti", "Enugu", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo",
    "Osun", "Oyo", "Plateau", "Rivers",
    "Sokoto", "Taraba", "Yobe", "Zamfara",
    "Federal Capital Territory (FCT)"
  ];

  let selectedState = "";

  const getSavedLocation = () => {
    try {
      return JSON.parse(localStorage.getItem("crunchies-location"));
    } catch {
      return null;
    }
  };

  const updateLocationLabel = (location) => {
    if (!location) {
      locationLabel.textContent = "Set location";
      return;
    }

    locationLabel.textContent =
      `${location.city}, ${location.state}`;
  };

  // Display states in a vertical list
  const renderStates = (search = "") => {
    stateList.innerHTML = "";
    stateList.hidden = false;

    const filteredStates = states.filter(state =>
      state.toLowerCase().includes(search.trim().toLowerCase())
    );

    if (filteredStates.length === 0) {
      stateList.textContent = "No state found.";
      return;
    }

    filteredStates.forEach(state => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "state-option";
      button.textContent = state;
      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", () => {
        selectedState = state;

        // Show only the selected state in the search box
        stateSearch.value = selectedState;

        // Completely remove the state list and its space
        stateList.innerHTML = "";
        stateList.hidden = true;

        locationNote.textContent = "";
      });

      stateList.appendChild(button);
    });
  };

  // Restore saved location without opening the modal
  const savedLocation = getSavedLocation();

  if (savedLocation) {
    selectedState = savedLocation.state || "";
    stateSearch.value = selectedState;
    locationCity.value = savedLocation.city || "";
    deliveryAddress.value = savedLocation.address || "";

    updateLocationLabel(savedLocation);
  } else {
    updateLocationLabel(null);
    stateList.hidden = true;
  }

  // Search or choose another state
  stateSearch.addEventListener("focus", () => {
    if (!modal.hidden && selectedState) {
      selectedState = "";
      stateSearch.value = "";
      renderStates();
    }
  });

  stateSearch.addEventListener("input", () => {
    selectedState = "";
    renderStates(stateSearch.value);
  });

  // Open location window only when Set Location is clicked
  const openModal = () => {
    modal.hidden = false;
    document.body.classList.add("location-modal-open");

    const saved = getSavedLocation();

    if (saved) {
      selectedState = saved.state || "";
      stateSearch.value = selectedState;
      locationCity.value = saved.city || "";
      deliveryAddress.value = saved.address || "";
      stateList.innerHTML = "";
      stateList.hidden = true;
    } else {
      selectedState = "";
      stateSearch.value = "";
      locationCity.value = "";
      deliveryAddress.value = "";
      renderStates();
    }

    locationNote.textContent = "";

    $("button[data-close-modal]", modal).focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("location-modal-open");
  };

  locationButton.addEventListener("click", openModal);

  modal.addEventListener("click", event => {
    if (
      event.target === modal ||
      event.target.closest("[data-close-modal]")
    ) {
      closeModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  // Save location
  locationForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!selectedState) {
      locationNote.textContent = "Please select your state.";
      return;
    }

    if (!locationCity.value.trim()) {
      locationNote.textContent = "Please enter your city or town.";
      locationCity.focus();
      return;
    }

    if (!deliveryAddress.value.trim()) {
      locationNote.textContent = "Please enter your delivery address.";
      deliveryAddress.focus();
      return;
    }

    const location = {
      state: selectedState,
      city: locationCity.value.trim(),
      address: deliveryAddress.value.trim()
    };

    localStorage.setItem(
      "crunchies-location",
      JSON.stringify(location)
    );

    updateLocationLabel(location);

    locationNote.textContent = "Your location has been saved.";

    setTimeout(() => {
      closeModal();
      locationNote.textContent = "";
    }, 700);
  });

  // Mobile navigation
  const menuToggle = $("#menu-toggle");
  const mobileNav = $("#mobile-nav");

  menuToggle.addEventListener("click", () => {
    const expanded =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileNav.hidden = expanded;
  });

  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Delivery and pickup selection
  document.querySelectorAll("[data-order]").forEach(button => {
    button.addEventListener("click", () => {
      const type = button.dataset.order;

      localStorage.setItem("crunchies-order-type", type);

      document.querySelectorAll("[data-order]").forEach(item => {
        item.classList.toggle("is-selected", item === button);
      });
    });
  });

  // Menu categories
  document.querySelectorAll("[data-category]").forEach(card => {
    card.addEventListener("click", () => {
      localStorage.setItem(
        "crunchies-active-category",
        card.dataset.category
      );
    });
  });

  $("#see-menu").addEventListener("click", () => {
    localStorage.setItem("crunchies-active-category", "0");
  });

  // My Account
  $("#account-form").addEventListener("submit", event => {
    event.preventDefault();

    const account = {
      name: $("#account-name").value.trim(),
      email: $("#account-email").value.trim()
    };

    localStorage.setItem(
      "crunchies-account",
      JSON.stringify(account)
    );

    $("#account-note").textContent =
      "Your details have been saved on this device.";
  });

  // Customer Support
  $("#support-form").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("#support-name").value.trim();
    const email = $("#support-email").value.trim();
    const message = $("#support-message").value.trim();

    const subject = encodeURIComponent("Crunchies Customer Support");

    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    $("#support-note").textContent =
      "Opening your email application...";

    window.location.href =
      `mailto:customercare@crunchiesonline.com?subject=${subject}&body=${body}`;
  });

  // Loyalty button
  $("#loyalty-button").addEventListener("click", () => {
    $("#account").scrollIntoView({ behavior: "smooth" });
  });

  // Newsletter
  $("#newsletter-form").addEventListener("submit", event => {
    event.preventDefault();

    $("#newsletter-note").textContent =
      "Newsletter sign-up is not connected in this standalone recreation.";
  });

  // Restore delivery option
  const savedOrder = localStorage.getItem("crunchies-order-type");

  if (savedOrder) {
    document.querySelectorAll("[data-order]").forEach(button => {
      button.classList.toggle(
        "is-selected",
        button.dataset.order === savedOrder
      );
    });
  }

})();
