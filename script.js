/* =========================================================
   FOOD CORNER - script.js
   Complete JavaScript
========================================================= */

(function () {
    "use strict";

    /* =====================================================
       RUN AFTER HTML IS LOADED
    ===================================================== */
    document.addEventListener("DOMContentLoaded", function () {

        /* =================================================
           HELPER FUNCTIONS
        ================================================= */
        function get(id) {
            return document.getElementById(id);
        }

        function getAll(selector) {
            return Array.from(document.querySelectorAll(selector));
        }

        function scrollToSection(id) {
            var section = get(id);

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }


        /* =================================================
           ELEMENTS
        ================================================= */

        /* Welcome Popup */
        var welcomeOverlay = get("welcomeOverlay");
        var welcomeClose = get("welcomeClose");
        var exploreBtn = get("exploreBtn");

        /* Navigation */
        var menuToggle = get("menuToggle");
        var navLinks = get("navLinks");

        /* Search */
        var foodSearch = get("foodSearch");
        var mobileFoodSearch = get("mobileFoodSearch");
        var clearSearch = get("clearSearch");

        /* Menu */
        var foodCards = getAll(".food-card");
        var filterButtons = getAll(".filter-btn");

        /* Cart */
        var addButtons = getAll(".add-btn");
        var cartFloat = get("cartFloat");
        var cartCountElement = get("cartCount");
        var headerCart = get("headerCart");
        var headerCartCount = get("headerCartCount");
        var headerCartTotal = get("headerCartTotal");

        /* Favorite */
        var heartButtons = getAll(".heart-btn");

        /* Location */
        var locationPicker = get("locationPicker");

        /* Profile */
        var profileBtn = get("profileBtn");
        var profilePanel = get("profilePanel");
        var profileClose = get("profileClose");
        var profileBackdrop = get("profileBackdrop");
        var profileLogin = get("profileLogin");

        /* Gallery */
        var galleryItems = getAll(".gallery-item");
        var lightbox = get("lightbox");
        var lightboxImage = get("lightboxImage");
        var lightboxTitle = get("lightboxTitle");
        var lightboxClose = get("lightboxClose");

        /* Testimonials */
        var testimonials = getAll(".testimonial");
        var sliderDots = get("sliderDots");

        /* Contact */
        var contactForm = get("contactForm");
        var formMessage = get("formMessage");

        /* Header */
        var header = document.querySelector(".site-header");

        /* Toast */
        var toast = get("toast");


        /* =================================================
           TOAST MESSAGE
        ================================================= */

        var toastTimer;

        function showToast(message) {

            if (!toast) {
                alert(message);
                return;
            }

            toast.textContent = message;
            toast.classList.add("show");

            clearTimeout(toastTimer);

            toastTimer = setTimeout(function () {
                toast.classList.remove("show");
            }, 2500);
        }


        /* =================================================
           WELCOME POPUP
        ================================================= */

        function closeWelcome() {

            if (!welcomeOverlay) return;

            welcomeOverlay.classList.add("hide");

            try {
                sessionStorage.setItem(
                    "foodCornerWelcome",
                    "closed"
                );
            } catch (error) {
                /* Storage may be blocked */
            }
        }

        var welcomeAlreadyClosed = false;

        try {
            welcomeAlreadyClosed =
                sessionStorage.getItem("foodCornerWelcome") === "closed";
        } catch (error) {
            welcomeAlreadyClosed = false;
        }

        if (welcomeOverlay && welcomeAlreadyClosed) {
            welcomeOverlay.classList.add("hide");
        }

        if (welcomeClose) {
            welcomeClose.addEventListener(
                "click",
                closeWelcome
            );
        }

        if (exploreBtn) {

            exploreBtn.addEventListener("click", function () {

                closeWelcome();

                setTimeout(function () {
                    scrollToSection("menu");
                }, 200);

            });
        }


        /* =================================================
           MOBILE MENU
        ================================================= */

        function closeMobileMenu() {

            if (!navLinks) return;

            navLinks.classList.remove("open");

            if (menuToggle) {
                menuToggle.textContent = "☰";
            }
        }

        if (menuToggle && navLinks) {

            menuToggle.addEventListener(
                "click",
                function () {

                    var isOpen =
                        navLinks.classList.toggle("open");

                    menuToggle.textContent =
                        isOpen ? "✕" : "☰";
                }
            );
        }

        getAll(".nav-links a").forEach(function (link) {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });


        /* =================================================
           CART
        ================================================= */

        var cartCount = 0;
        var cartTotal = 0;

        function updateCart() {

            if (cartCountElement) {
                cartCountElement.textContent =
                    cartCount;
            }

            if (headerCartCount) {
                headerCartCount.textContent =
                    cartCount;
            }

            if (headerCartTotal) {
                headerCartTotal.textContent =
                    cartTotal;
            }
        }

        function addItemToCart(button) {

            if (!button) return;

            var itemName =
                button.getAttribute("data-name") ||
                "Food item";

            var itemPrice =
                parseInt(
                    button.getAttribute("data-price")
                ) || 0;

            cartCount++;
            cartTotal += itemPrice;

            updateCart();

            showToast(
                itemName +
                " added to cart ✓"
            );

            /* Button animation */
            var oldHTML = button.innerHTML;

            button.disabled = true;
            button.classList.add("added");
            button.innerHTML = "Added ✓";

            setTimeout(function () {

                button.disabled = false;
                button.classList.remove("added");
                button.innerHTML = oldHTML;

            }, 1000);
        }

        addButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {
                    addItemToCart(button);
                }
            );

        });

        function openCart() {

            if (cartCount === 0) {

                showToast(
                    "Your cart is empty 🛒"
                );

            } else {

                showToast(
                    cartCount +
                    (cartCount === 1
                        ? " item"
                        : " items") +
                    " • Total ₹" +
                    cartTotal
                );
            }
        }

        if (cartFloat) {
            cartFloat.addEventListener(
                "click",
                openCart
            );
        }

        if (headerCart) {
            headerCart.addEventListener(
                "click",
                openCart
            );
        }

        updateCart();


        /* =================================================
           MENU FILTER
        ================================================= */

        var activeCategory = "all";
        var searchText = "";

        function filterMenu() {

            var foundItems = 0;

            foodCards.forEach(function (card) {

                var category =
                    (
                        card.getAttribute(
                            "data-category"
                        ) || ""
                    ).toLowerCase();

                var text =
                    (
                        card.textContent || ""
                    ).toLowerCase();

                var categoryMatches =
                    activeCategory === "all" ||
                    category === activeCategory;

                var searchMatches =
                    searchText === "" ||
                    text.includes(searchText);

                var show =
                    categoryMatches &&
                    searchMatches;

                card.classList.toggle(
                    "hidden",
                    !show
                );

                if (show) {
                    foundItems++;
                }
            });

            if (clearSearch) {

                clearSearch.classList.toggle(
                    "visible",
                    searchText.length > 0
                );
            }

            if (
                searchText !== "" &&
                foundItems === 0
            ) {

                showToast(
                    "No food found for \"" +
                    searchText +
                    "\""
                );
            }
        }


        /* =================================================
           CATEGORY BUTTONS
        ================================================= */

        filterButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (btn) {
                            btn.classList.remove(
                                "active"
                            );
                        }
                    );

                    button.classList.add(
                        "active"
                    );

                    activeCategory =
                        (
                            button.getAttribute(
                                "data-filter"
                            ) || "all"
                        ).toLowerCase();

                    filterMenu();
                }
            );

        });


        /* =================================================
           SEARCH
        ================================================= */

        function updateSearch(value) {

            searchText =
                String(value || "")
                    .trim()
                    .toLowerCase();

            if (foodSearch) {
                foodSearch.value =
                    value || "";
            }

            if (mobileFoodSearch) {
                mobileFoodSearch.value =
                    value || "";
            }

            filterMenu();
        }

        if (foodSearch) {

            foodSearch.addEventListener(
                "input",
                function () {
                    updateSearch(
                        foodSearch.value
                    );
                }
            );

            foodSearch.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {
                        event.preventDefault();
                        scrollToSection("menu");
                    }
                }
            );
        }

        if (mobileFoodSearch) {

            mobileFoodSearch.addEventListener(
                "input",
                function () {
                    updateSearch(
                        mobileFoodSearch.value
                    );
                }
            );

            mobileFoodSearch.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Enter") {
                        event.preventDefault();
                        scrollToSection("menu");
                    }
                }
            );
        }

        if (clearSearch) {

            clearSearch.addEventListener(
                "click",
                function () {

                    updateSearch("");

                    if (foodSearch) {
                        foodSearch.focus();
                    }
                }
            );
        }


        /* =================================================
           FAVORITE / HEART BUTTONS
        ================================================= */

        heartButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    var liked =
                        button.classList.toggle(
                            "liked"
                        );

                    button.setAttribute(
                        "aria-pressed",
                        liked ? "true" : "false"
                    );

                    button.textContent =
                        liked ? "♥" : "♡";

                    showToast(
                        liked
                            ? "Added to favourites ♥"
                            : "Removed from favourites"
                    );
                }
            );

        });


        /* =================================================
           LOCATION
        ================================================= */

        if (locationPicker) {

            locationPicker.addEventListener(
                "click",
                function () {

                    showToast(
                        "Delivery location: Jaipur, Rajasthan 📍"
                    );

                }
            );
        }


        /* =================================================
           PROFILE PANEL
        ================================================= */

        function openProfile() {

            if (!profilePanel) return;

            profilePanel.classList.add(
                "open"
            );

            if (profileBackdrop) {
                profileBackdrop.classList.add(
                    "open"
                );
            }

            profilePanel.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "panel-open"
            );
        }

        function closeProfile() {

            if (!profilePanel) return;

            profilePanel.classList.remove(
                "open"
            );

            if (profileBackdrop) {
                profileBackdrop.classList.remove(
                    "open"
                );
            }

            profilePanel.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "panel-open"
            );
        }

        if (profileBtn) {
            profileBtn.addEventListener(
                "click",
                openProfile
            );
        }

        if (profileClose) {
            profileClose.addEventListener(
                "click",
                closeProfile
            );
        }

        if (profileBackdrop) {
            profileBackdrop.addEventListener(
                "click",
                closeProfile
            );
        }

        if (profileLogin) {

            profileLogin.addEventListener(
                "click",
                function () {

                    closeProfile();

                    showToast(
                        "Welcome! Sign-in system can be connected here 👋"
                    );
                }
            );
        }


        /* =================================================
           GALLERY LIGHTBOX
        ================================================= */

        function closeLightbox() {

            if (!lightbox) return;

            lightbox.classList.remove(
                "open"
            );

            document.body.classList.remove(
                "lightbox-open"
            );
        }

        galleryItems.forEach(function (item) {

            item.addEventListener(
                "click",
                function () {

                    if (!lightbox) return;

                    var imageURL =
                        item.getAttribute(
                            "data-image"
                        );

                    var title =
                        item.getAttribute(
                            "data-title"
                        ) || "Food Corner";

                    if (
                        lightboxImage &&
                        imageURL
                    ) {

                        lightboxImage.src =
                            imageURL;

                        lightboxImage.alt =
                            title;
                    }

                    if (lightboxTitle) {
                        lightboxTitle.textContent =
                            title;
                    }

                    lightbox.classList.add(
                        "open"
                    );

                    document.body.classList.add(
                        "lightbox-open"
                    );
                }
            );

        });

        if (lightboxClose) {

            lightboxClose.addEventListener(
                "click",
                closeLightbox
            );
        }

        if (lightbox) {

            lightbox.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        lightbox
                    ) {
                        closeLightbox();
                    }
                }
            );
        }


        /* =================================================
           TESTIMONIAL SLIDER
        ================================================= */

        var currentSlide = 0;
        var dots = [];

        function showSlide(index) {

            if (testimonials.length === 0) {
                return;
            }

            currentSlide =
                (index + testimonials.length) %
                testimonials.length;

            testimonials.forEach(
                function (slide, i) {

                    slide.classList.toggle(
                        "active",
                        i === currentSlide
                    );
                }
            );

            dots.forEach(
                function (dot, i) {

                    dot.classList.toggle(
                        "active",
                        i === currentSlide
                    );
                }
            );
        }

        if (
            sliderDots &&
            testimonials.length
        ) {

            sliderDots.innerHTML = "";

            testimonials.forEach(
                function (_, index) {

                    var dot =
                        document.createElement(
                            "button"
                        );

                    dot.type = "button";
                    dot.className =
                        "slider-dot";

                    dot.setAttribute(
                        "aria-label",
                        "Show testimonial " +
                        (index + 1)
                    );

                    dot.addEventListener(
                        "click",
                        function () {
                            showSlide(index);
                        }
                    );

                    sliderDots.appendChild(
                        dot
                    );

                    dots.push(dot);
                }
            );
        }

        if (testimonials.length) {

            showSlide(0);

            if (testimonials.length > 1) {

                setInterval(
                    function () {

                        showSlide(
                            currentSlide + 1
                        );

                    },
                    4500
                );
            }
        }


        /* =================================================
           CONTACT FORM
        ================================================= */

        if (contactForm) {

            contactForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    var nameField =
                        get("name");

                    var name =
                        nameField
                            ? nameField.value.trim()
                            : "";

                    if (formMessage) {

                        formMessage.textContent =
                            "Thank you " +
                            (name || "Foodie") +
                            "! Your message has been sent successfully.";
                    }

                    showToast(
                        "Message sent successfully ✓"
                    );

                    contactForm.reset();
                }
            );
        }


        /* =================================================
           SCROLL REVEAL ANIMATION
        ================================================= */

        var revealElements =
            getAll(".reveal");

        if (
            "IntersectionObserver" in window
        ) {

            var observer =
                new IntersectionObserver(
                    function (
                        entries,
                        obs
                    ) {

                        entries.forEach(
                            function (entry) {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "visible"
                                    );

                                    obs.unobserve(
                                        entry.target
                                    );
                                }
                            }
                        );

                    },
                    {
                        threshold: 0.12
                    }
                );

            revealElements.forEach(
                function (element) {
                    observer.observe(
                        element
                    );
                }
            );

        } else {

            revealElements.forEach(
                function (element) {
                    element.classList.add(
                        "visible"
                    );
                }
            );
        }


        /* =================================================
           HEADER SHADOW ON SCROLL
        ================================================= */

        function updateHeader() {

            if (!header) return;

            if (window.scrollY > 20) {

                header.style.boxShadow =
                    "0 8px 30px rgba(0,0,0,0.10)";

            } else {

                header.style.boxShadow =
                    "none";
            }
        }

        window.addEventListener(
            "scroll",
            updateHeader,
            {
                passive: true
            }
        );

        updateHeader();


        /* =================================================
           CLOSE EVERYTHING WITH ESCAPE
        ================================================= */

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Escape") {
                    return;
                }

                closeProfile();
                closeLightbox();
                closeMobileMenu();
            }
        );


        /* =================================================
           NAVIGATION LINKS
        ================================================= */

        getAll(
            'a[href^="#"]'
        ).forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        var targetID =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !targetID ||
                            targetID === "#"
                        ) {
                            return;
                        }

                        var target =
                            document.querySelector(
                                targetID
                            );

                        if (target) {

                            event.preventDefault();

                            target.scrollIntoView(
                                {
                                    behavior:
                                        "smooth",
                                    block:
                                        "start"
                                }
                            );

                            closeMobileMenu();
                        }
                    }
                );

            }
        );


        /* =================================================
           INITIALIZE
        ================================================= */

        filterMenu();
        updateCart();

    });

})();