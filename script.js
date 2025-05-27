let clickCount = 0;

// Track every user click on the page
document.addEventListener("click", () => {
    clickCount++;
});

// Track the Learn More button click
function trackClick(version) {
    const timestamp = new Date().toISOString();
    const data = {
        version,
        timestamp,
        clickCount
    };
    localStorage.setItem("ab_click_data", JSON.stringify(data));
    window.location.href = `survey.html`;
}