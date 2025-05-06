document.addEventListener("DOMContentLoaded", () => {
    const target = "APPLE";
    const fillerWords = ["CHAIR", "HELLO", "MOUSE", "PLANE", "BRICK", "SHARP", "WATER", "STONE", "LEVEL", "BREAD"];
    const allWords = [...fillerWords, target].sort(() => 0.5 - Math.random());
  
    const grid = document.getElementById("word-grid");
    if (grid) {
        allWords.forEach(word => {
            const span = document.createElement("span");
            span.textContent = word;
            span.onclick = () => {
            if (word === target) {
                span.style.backgroundColor = "#90ee90";
                alert("Correct! Proceed to the next step.");
            } else {
                span.style.backgroundColor = "#ffcccb";
            }
            };
            grid.appendChild(span);
        });
    }
  });