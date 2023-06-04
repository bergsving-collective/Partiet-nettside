document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("scroll", function () {
        var navbar = document.querySelector(".navbar");
        if (window.scrollY > 10) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    });

    // Function to handle link click event
    function handleLinkClick(event) {
        event.preventDefault(); // Prevent the default link behavior

        var target = document.querySelector(this.getAttribute("href")); // Get the target element
        var navbarHeight = document.querySelector(".navbar").offsetHeight; // Get the height of the navbar
        var offsetTop = target.offsetTop - navbarHeight; // Calculate the scroll offset

        window.scrollTo({
            top: offsetTop,
            behavior: "smooth", // Add smooth scrolling behavior
        });

        // Collapse the navbar after click
        collapseNavbar();
    }

    // Attach the click event handler to each navbar link
    var navbarLinks = document.querySelectorAll(".navbar-nav li a");
    navbarLinks.forEach(function (link) {
        link.addEventListener("click", handleLinkClick);
    });

    // Fetch the content of navbar.html
    fetch("../navbar.html")
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            // Insert the navbar HTML into the placeholder div
            document.getElementById("navbar-placeholder").innerHTML = html;
        })
        .catch(function (error) {
            console.log("Error fetching navbar.html:", error);
        });

    // Fetch the content of footer.html
    fetch("../footer.html")
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            // Insert the footer HTML into the placeholder div
            document.getElementById("footer-placeholder").innerHTML = html;
        })
        .catch(function (error) {
            console.log("Error fetching footer.html:", error);
        });
});
