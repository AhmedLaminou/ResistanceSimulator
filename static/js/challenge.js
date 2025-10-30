/**
 * challenge.js
 * Handles the logic for the challenge.html page
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- SELECTORS ---
    const guessInput = document.getElementById("guessInput");
    const bandSelect = document.getElementById("bandSelectChallenge");
    const submitBtn = document.getElementById("submitBtn");
    const nextBtn = document.getElementById("nextBtn");
    const scoreLabel = document.getElementById("scoreLabel");
    const bandsContainer = document.getElementById("resistor-bands-container");

    const successSound = document.getElementById("successSound");
    const errorSound = document.getElementById("errorSound");

    let score = 0;
    let currentValue = 0;
    let currentBands = [];

    // --- GAME FUNCTIONS ---

    /**
     * Requests a new random resistor from the server
     */
    async function newChallenge() {
        const bandCount = bandSelect.value;
        try {
            const resp = await fetch(`/random?bands=${bandCount}`);
            const data = await resp.json();
            
            if (data.error) {
                window.showModal("Erreur", "Impossible de générer une nouvelle résistance.", 'error');
            } else {
                currentValue = data.value;
                currentBands = data.bands;
                drawResistorBands(data.bands, true); // true = challenge mode (hide)
                guessInput.value = "";
                guessInput.disabled = false;
                submitBtn.disabled = false;
            }
        } catch (err) {
            window.showModal("Erreur Réseau", "Impossible de contacter le serveur.", 'error');
        }
    }

    /**
     * Handles submission of the guess
     */
    function submitGuess() {
        const guessValue = parseResistanceValue(guessInput.value);

        if (guessValue === null) {
            window.showModal("Erreur", "Format de valeur invalide. Ex: 10k, 4.7M, 330", 'error');
            return;
        }

        // Reveal the actual colors
        drawResistorBands(currentBands, false);
        guessInput.disabled = true;
        submitBtn.disabled = true;

        // Check the answer
        // We check if the value is within a 1% margin (for floats)
        const margin = currentValue * 0.01;
        if (Math.abs(guessValue - currentValue) <= margin) {
            // CORRECT
            score++;
            window.showModal("Correct !", `Bravo ! La valeur était ${formatResistanceValue(currentValue)}Ω`, 'success');
            if(successSound) successSound.play().catch(e => {});
        } else {
            // INCORRECT
            score--;
            window.showModal("Incorrect", `Dommage. La bonne réponse était ${formatResistanceValue(currentValue)}Ω`, 'error');
            if(errorSound) errorSound.play().catch(e => {});
        }
        
        scoreLabel.textContent = `Score: ${score}`;
    }

    /**
     * Draws the bands (challenge mode or normal)
     */
    function drawResistorBands(colors, isChallenge = false) {
        bandsContainer.innerHTML = "";
        if (!colors || colors.length === 0) return;
        
        colors.forEach((color, index) => {
            const band = document.createElement("div");
            band.className = "resistor-band";
            
            if (index === colors.length - 1) band.classList.add("tolerance");
            
            // If challenge, use a grey color; otherwise the real color
            band.style.backgroundColor = isChallenge ? 'var(--color-secondary)' : color;
            
            if (!isChallenge && color === 'white') band.style.borderColor = '#ccc';

            bandsContainer.appendChild(band);
            
            setTimeout(() => {
                band.style.transform = 'scaleY(1)';
                band.style.opacity = '1';
            }, index * 100);
        });
    }

    // --- EVENT LISTENERS ---
    submitBtn.addEventListener("click", submitGuess);
    nextBtn.addEventListener("click", newChallenge);
    guessInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submitGuess();
    });
    bandSelect.addEventListener("change", newChallenge); // Change the game when the number of bands changes

    // --- STARTUP ---
    newChallenge();


    // --- UTILITY FUNCTIONS (copied from main.js) ---
    function parseResistanceValue(str) {
        if (!str) return null;
        str = str.toLowerCase().trim().replace('r', '.').replace('ω', '');
        let multiplier = 1;
        
        if (str.endsWith('k')) {
            multiplier = 1e3;
            str = str.slice(0, -1);
        } else if (str.endsWith('m')) {
            multiplier = 1e6;
            str = str.slice(0, -1);
        } else if (str.endsWith('g')) {
            multiplier = 1e9;
            str = str.slice(0, -1);
        }

        const value = parseFloat(str.replace(',', '.'));
        if (isNaN(value)) return null;
        
        return value * multiplier;
    }

    function formatResistanceValue(value) {
        if (value >= 1e9) return (value / 1e9).toPrecision(3) + "G";
        if (value >= 1e6) return (value / 1e6).toPrecision(3) + "M";
        if (value >= 1e3) return (value / 1e3).toPrecision(3) + "k";
        if (value < 1) return value.toPrecision(2);
        if (value % 1 !== 0) return value.toPrecision(3);
        return value.toString();
    }
});
