// script.js
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener('scroll', function () {
        var navbar = document.querySelector('.navbar');
        if (window.scrollY > 10) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    $(document).ready(function () {
        $(".navbar-nav li a").on('click', function () {
            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-collapse').collapse('hide');
            }
        });
    });


    // Fetch the content of navbar.html
    fetch("navbar.html")
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
    fetch("footer.html")
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
