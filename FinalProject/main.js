document.querySelectorAll(".panel").forEach(function (panel) {
    var file = panel.dataset.section;
    fetch("sections/" + file + ".html")
        .then(function (res) { return res.text(); })
        .then(function (html) {
            panel.innerHTML = html;
        })
        .catch(function (err) {
            console.log("Failed to load section:", file, err);
        });
});

// Scroll to a section by its data-section value
function scrollToSection(sectionId) {
    var selector = '.panel[data-section="' + sectionId + '"]';
    var target = document.querySelector(selector);
    if (!target) {
        console.log("Section not found:", sectionId);
        return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Cookie funds tracking
var cookieFunds = 0;
var cookieSpan = document.getElementById("cookieAmount");

function updateWithdrawDisplay() {
    var wAmount = document.getElementById("withdrawAmount");
    if (wAmount) {
        var dollars = cookieFunds * 1000; // 100 cookies = 100,000$
        wAmount.textContent = "$" + dollars.toLocaleString();
    }
}

function addCookies(amount) {
    cookieFunds += amount;
    if (cookieSpan) cookieSpan.textContent = cookieFunds;
    updateWithdrawDisplay();
}

// Don't accept button runs away
document.addEventListener("mousemove", function (e) {
    var btn = document.querySelector(".dont-accept-btn");
    var box = document.querySelector(".terms-buttons");
    if (!btn || !box) return;

    var r = btn.getBoundingClientRect();
    var padding = 70;

    if (
        e.clientX > r.left - padding &&
        e.clientX < r.right + padding &&
        e.clientY > r.top - padding &&
        e.clientY < r.bottom + padding
    ) {
        var max = box.clientWidth - btn.clientWidth;
        var current = parseInt(btn.style.left || 0, 10);
        var move = current + (Math.random() < 0.5 ? -120 : 120);
        if (move < (max*0.47)) move = (max*0.47);
        if (move > (max*0.97)) move = (max*0.97);
        btn.style.left = move + "px";
    }
});

var gameImages = [
    "images/game1.jpg",
    "images/game2.jpg",
    "images/game3.jpg",
    "images/game4.jpg",
    "images/game5.jpg",
    "images/game6.jpg",
];

var gameIndex = 0;
var breachMode = false;

function startBreach() {
    if (breachMode) return;
    breachMode = true;

    var dbOWrapper = document.querySelector(".debrief-outer-wrapper");
    var dbWrapper = document.querySelector(".debrief-wrapper");

    if (dbOWrapper) {
        dbOWrapper.style.backgroundColor = "#020617";
    }

    if (dbWrapper) {
        dbWrapper.style.backgroundColor = "#020617";
    }

    var wrapper = document.querySelector(".withdraw-wrapper");
    var title = document.querySelector(".withdraw-title");
    var note = document.querySelector(".withdraw-note");
    var btn = document.querySelector(".withdraw-btn");

    if (wrapper) {
        wrapper.classList.add("breach-mode");
        wrapper.style.backgroundColor = "#3b0000";
    }
    if (title) {
        title.textContent = "Data Breach Detected";
        title.style.color = "#ffb3b3";
    }
    if (note) {
        note.textContent = "Your cookie funds have been compromised and wiped.";
        note.style.color = "#ffd6d6";
    }
    if (btn) {
        btn.textContent = "View Incident Report";
        btn.style.backgroundColor = "#ff4d4d";
        btn.style.color = "#3b0000";
    }

    var start = cookieFunds;
    var steps = 30;
    var currentStep = 0;

    var timer = setInterval(function () {
        currentStep++;
        var remaining = Math.round(start * (1 - currentStep / steps));
        if (remaining < 0) remaining = 0;
        cookieFunds = remaining;
        if (cookieSpan) cookieSpan.textContent = cookieFunds;
        updateWithdrawDisplay();
        if (currentStep >= steps) {
            clearInterval(timer);
            cookieFunds = 0;
            if (cookieSpan) cookieSpan.textContent = 0;
            updateWithdrawDisplay();
        }
    }, 30);
}

document.addEventListener("click", function (e) {
    var el = e.target;

    if (el.dataset && el.dataset.cookieBonus) {
        var amount = parseInt(el.dataset.cookieBonus, 10) || 0;
        addCookies(amount, el.dataset.cookieReason || "");
    }

    if (el.classList && el.classList.contains("withdraw-btn")) {
        e.preventDefault();
        if (!breachMode) {
            startBreach();
            return;
        } else {
            scrollToSection("10-telemetry");
            return;
        }
    }

    if (el.dataset && el.dataset.nextSection) {
        e.preventDefault();
        scrollToSection(el.dataset.nextSection);
    }

    if (el.matches("[data-close-popup]")) {
        var card = el.closest("[data-popup]");
        if (card && !card.classList.contains("persistent")) {
            card.style.display = "none";
        }
    }

    if (el.matches(".persistent-close")) {
        el.style.transform = "translateX(-6px)";
        setTimeout(function () {
            el.style.transform = "translateX(6px)";
        }, 80);
        setTimeout(function () {
            el.style.transform = "translateX(0)";
        }, 160);
    }

    if (el.matches("[data-next-post]")) {
        gameIndex++;
        if (gameIndex >= gameImages.length) gameIndex = gameImages.length - 1;

        var img = document.querySelector(".game-image img");
        if (img) img.src = gameImages[gameIndex];

        var meter = document.getElementById("meterFill");
        if (meter) {
            var pct = (gameIndex + 1) * (100 / gameImages.length);
            meter.style.width = pct + "%";
        }
    }
});

updateWithdrawDisplay();
