/**
 * main.js
 * Handles all logic for the index.html page
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- 0. APP NAVIGATION (New) ---
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const toolPages = document.querySelectorAll('.tool-page');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetPageId = link.dataset.page;
            
            // 1. Update Links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // 2. Update Pages
            toolPages.forEach(page => {
                if (page.id === targetPageId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
            
            // 3. Activate icons on the new page
            if (window.lucide) {
                window.lucide.createIcons();
            }
        });
    });


    // --- SELECTORS - MAIN SIMULATOR ---
    const resistanceInput = document.getElementById("resistanceInput");
    const bandSelect = document.getElementById("bandSelect");
    const showBtn = document.getElementById("showBtn");
    const randomBtn = document.getElementById("randomBtn");
    const valueLabel = document.getElementById("valueLabel");
    const bandsContainer = document.getElementById("resistor-bands-container");

    const successSound = document.getElementById("successSound");
    const errorSound = document.getElementById("errorSound");

    // --- SELECTORS - INVERSE CALCULATOR ---
    const invBand1 = document.getElementById("invBand1");
    const invBand2 = document.getElementById("invBand2");
    const invBand3 = document.getElementById("invBand3");
    const invBand3Wrapper = document.getElementById("invBand3Wrapper");
    const invMultiplier = document.getElementById("invMultiplier");
    const invTolerance = document.getElementById("invTolerance");
    const inverseValueLabel = document.getElementById("inverseValueLabel");
    const allInverseSelects = document.querySelectorAll('.inv-select');
    
    // --- SELECTORS - OHM'S LAW ---
    const ohmVoltage = document.getElementById("ohmVoltage");
    const ohmCurrent = document.getElementById("ohmCurrent");
    const ohmResistance = document.getElementById("ohmResistance");
    const ohmCalculateBtn = document.getElementById("ohmCalculateBtn");
    const ohmClearBtn = document.getElementById("ohmClearBtn");
    const ohmResultLabel = document.getElementById("ohmResultLabel");
    const ohmInputs = [ohmVoltage, ohmCurrent, ohmResistance];

    // --- SELECTORS - BUILDER (Drag & Drop) ---
    const calculateCustomBtn = document.getElementById('calculateCustomBtn');
    const customValueLabel = document.getElementById('customValueLabel');
    // ... (autres sélecteurs D&D si nécessaire) ...

    // --- SELECTORS - SERIES/PARALLEL ---
    const resistorList = document.getElementById("resistorList");
    const addResistorBtn = document.getElementById("addResistorBtn");
    const connectionType = document.getElementById("connectionType");
    const calcTotalBtn = document.getElementById("calcTotalBtn");
    const totalResistanceLabel = document.getElementById("totalResistanceLabel");
    
    // --- SELECTORS - HISTORY ---
    const historyPanel = document.getElementById("historyPanel");
    const exportHistoryBtn = document.getElementById("exportHistoryBtn");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn"); // NEW
    
    // --- SELECTORS - LED CALCULATOR ---
    const ledSupplyVoltage = document.getElementById("ledSupplyVoltage");
    const ledForwardVoltage = document.getElementById("ledForwardVoltage");
    const ledForwardCurrent = document.getElementById("ledForwardCurrent");
    const ledCalculateBtn = document.getElementById("ledCalculateBtn");
    const ledResultLabel = document.getElementById("ledResultLabel");
    const ledShowResistorBtn = document.getElementById("ledShowResistorBtn");
    let lastLedResistorValue = null; 

    // --- DATA ---
    const BANDS_DATA = { /* ... (data unchanged) ... */
        digits: [
            { text: 'Black', value: 0, color: 'black' },
            { text: 'Brown', value: 1, color: 'brown' },
            { text: 'Red', value: 2, color: 'red' },
            { text: 'Orange', value: 3, color: 'orange' },
            { text: 'Yellow', value: 4, color: 'yellow' },
            { text: 'Green', value: 5, color: 'green' },
            { text: 'Blue', value: 6, color: 'blue' },
            { text: 'Purple', value: 7, color: 'purple' },
            { text: 'Grey', value: 8, color: 'grey' },
            { text: 'White', value: 9, color: 'white' }
        ],
        multipliers: [
            { text: 'Black (x1)', value: 1, color: 'black' },
            { text: 'Brown (x10)', value: 10, color: 'brown' },
            { text: 'Red (x100)', value: 100, color: 'red' },
            { text: 'Orange (x1k)', value: 1e3, color: 'orange' },
            { text: 'Yellow (x10k)', value: 1e4, color: 'yellow' },
            { text: 'Green (x100k)', value: 1e5, color: 'green' },
            { text: 'Blue (x1M)', value: 1e6, color: 'blue' },
            { text: 'Purple (x10M)', value: 1e7, color: 'purple' },
            { text: 'Grey (x100M)', value: 1e8, color: 'grey' },
            { text: 'White (x1G)', value: 1e9, color: 'white' },
            { text: 'Gold (x0.1)', value: 0.1, color: 'gold' },
            { text: 'Silver (x0.01)', value: 0.01, color: 'silver' }
        ],
        tolerances: [
            { text: 'Brown (±1%)', value: '±1%', color: 'brown' },
            { text: 'Red (±2%)', value: '±2%', color: 'red' },
            { text: 'Green (±0.5%)', value: '±0.5%', color: 'green' },
            { text: 'Blue (±0.25%)', value: '±0.25%', color: 'blue' },
            { text: 'Purple (±0.1%)', value: '±0.1%', color: 'purple' },
            { text: 'Grey (±0.05%)', value: '±0.05%', color: 'grey' },
            { text: 'Gold (±5%)', value: '±5%', color: 'gold' },
            { text: 'Silver (±10%)', value: '±10%', color: 'silver' },
            { text: 'None (±20%)', value: '±20%', color: 'transparent' }
        ]
    };
    
    // NEW: Load history from localStorage on startup
    let history = JSON.parse(localStorage.getItem('resistorHistory')) || [];

    // Initialize the visual resistor
    drawResistorBands([]);

    // --- 1. MAIN SIMULATOR (Value -> Color) ---
    if (showBtn) {
        showBtn.addEventListener("click", calculateAndShow);
    }
    if (resistanceInput) {
        resistanceInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") calculateAndShow();
        });
    }

    async function calculateAndShow() {
        let value = parseOhmValue(resistanceInput.value);
        const bands = bandSelect.value;

        if (value === null) {
            handleError("Invalid value format. Ex: 10k, 4.7M, 330");
            return;
        }

        try {
            const resp = await fetch("/calculate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: value, bands: bands })
            });
            const data = await resp.json();

            if (data.error) {
                handleError(data.error);
            } else {
                handleSuccess(data.value, data.bands);
                addToHistory(data.value, data.bands);
            }
        } catch (err) {
            handleError("Server connection error.");
        }
    }

    if (randomBtn) {
        randomBtn.addEventListener("click", async () => {
            const bands = bandSelect.value;
            try {
                const resp = await fetch(`/random?bands=${bands}`);
                const data = await resp.json();
                
                if (data.error) {
                    handleError(data.error);
                } else {
                    resistanceInput.value = formatResistanceValue(data.value);
                    handleSuccess(data.value, data.bands);
                    addToHistory(data.value, data.bands);
                }
            } catch (err) {
                handleError("Server connection error.");
            }
        });
    }

    function handleError(message) {
        if (!valueLabel) return;
        valueLabel.textContent = message;
        valueLabel.className = 'value-display error';
        drawResistorBands([]); 
        if(errorSound) errorSound.play().catch(e => {});
    }

    function handleSuccess(value, bands) {
        if (!valueLabel) return;
        const formattedValue = formatResistanceValue(value);
        valueLabel.textContent = `Value: ${formattedValue}Ω | Tolerance: ${getTolerance(bands[bands.length - 1])}`;
        valueLabel.className = 'value-display success';
        drawResistorBands(bands);
        if(successSound) successSound.play().catch(e => {});
    }

    function drawResistorBands(colors) {
        if (!bandsContainer) return; // Exit if not on the right page
        bandsContainer.innerHTML = ""; 
        if (!colors || colors.length === 0) {
            bandsContainer.innerHTML = '<span class="no-bands-placeholder" style="opacity: 0.5;">...</span>';
            return;
        }
        
        colors.forEach((color, index) => {
            const band = document.createElement("div");
            band.className = "resistor-band";
            
            if (index === colors.length - 1) {
                band.classList.add("tolerance");
            }
            
            band.style.backgroundColor = color;
            bandsContainer.appendChild(band);
            
            setTimeout(() => {
                band.style.transform = 'scaleY(1)';
                band.style.opacity = '1';
            }, index * 100); 
        });
    }

    // --- 2. INVERSE CALCULATOR ---
    
    function populateSelect(selectEl, optionsData) {
        if (!selectEl) return;
        selectEl.innerHTML = '';
        optionsData.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            option.style.backgroundColor = opt.color;
            if (['black', 'brown', 'red', 'orange', 'purple', 'blue', 'grey'].includes(opt.color)) {
                option.style.color = 'white';
            }
            if (opt.color === 'white') option.style.color = 'black';
            if (opt.color === 'transparent') option.style.backgroundColor = '#eee';
            selectEl.appendChild(option);
        });
    }
    
    function initializeInverseCalculator() {
        if (!invBand1) return; // Exit if not on page
        
        populateSelect(invBand1, BANDS_DATA.digits.slice(1));
        populateSelect(invBand2, BANDS_DATA.digits);
        populateSelect(invBand3, BANDS_DATA.digits);
        populateSelect(invMultiplier, BANDS_DATA.multipliers);
        populateSelect(invTolerance, BANDS_DATA.tolerances);

        allInverseSelects.forEach(sel => {
            sel.addEventListener('change', calculateFromColors);
            sel.addEventListener('change', updateSelectBackgrounds);
        });
        
        updateSelectBackgrounds();
    }
    
    function updateSelectBackgrounds() {
        allInverseSelects.forEach(sel => {
             if (!sel) return;
             const selectedOption = sel.options[sel.selectedIndex];
             const color = selectedOption.style.backgroundColor;
             sel.style.backgroundColor = color;
             
             if (['black', 'brown', 'red', 'orange', 'purple', 'blue', 'grey'].includes(color)) {
                sel.style.color = 'white';
             } else {
                sel.style.color = 'black';
             }
             if (color === 'transparent') sel.style.backgroundColor = '#eee';
        });
    }

    function calculateFromColors() {
        if (!inverseValueLabel) return;
        
        const is4Band = bandSelect.value === '4';
        
        try {
            let digit1 = parseFloat(invBand1.value);
            let digit2 = parseFloat(invBand2.value);
            let multiplier = parseFloat(invMultiplier.value);
            let tolerance = invTolerance.value;
            
            let baseValue;
            if (is4Band) {
                baseValue = (digit1 * 10) + digit2;
            } else {
                let digit3 = parseFloat(invBand3.value);
                baseValue = (digit1 * 100) + (digit2 * 10) + digit3;
            }
            
            let finalValue = baseValue * multiplier;
            
            inverseValueLabel.textContent = `Value: ${formatResistanceValue(finalValue)}Ω ${tolerance}`;
            inverseValueLabel.className = 'value-display success';

        } catch (e) {
            inverseValueLabel.textContent = 'Error during calculation.';
            inverseValueLabel.className = 'value-display error';
        }
    }
    
    function toggleInverseCalculatorBands() {
        if (!invBand3Wrapper) return;
        const is4Band = bandSelect.value === '4';
        
        invBand3Wrapper.style.display = is4Band ? 'none' : 'flex';
        invBand3.disabled = is4Band;
        
        calculateFromColors();
    }

    // --- 3. OHM'S LAW CALCULATOR ---
    
    if (ohmCalculateBtn) {
        ohmCalculateBtn.addEventListener('click', calculateOhmsLaw);
    }
    if (ohmClearBtn) {
        ohmClearBtn.addEventListener('click', clearOhmsLaw);
    }
    ohmInputs.forEach(input => {
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === "Enter") calculateOhmsLaw();
            });
        }
    });

    function calculateOhmsLaw() {
        ohmInputs.forEach(input => input.classList.remove('calculated'));
    
        try {
            const v = parseOhmValue(ohmVoltage.value);
            const i = parseOhmValue(ohmCurrent.value);
            const r = parseOhmValue(ohmResistance.value);
    
            const filledCount = [v, i, r].filter(val => val !== null).length;
    
            if (filledCount !== 2) {
                throw new Error("Please enter exactly two values.");
            }
    
            let resultMessage = "";
    
            if (v === null) {
                const result = i * r;
                ohmVoltage.value = formatGenericValue(result, 'V').replace(' V', ''); // Remove unit for input
                ohmVoltage.classList.add('calculated');
                resultMessage = `Voltage (V) = ${formatGenericValue(i, 'A')} * ${formatGenericValue(r, 'Ω')} = ${formatGenericValue(result, 'V')}`;
            } else if (i === null) {
                if (r === 0) throw new Error("Resistance cannot be zero (short circuit).");
                const result = v / r;
                ohmCurrent.value = formatGenericValue(result, 'A').replace(' A', '');
                ohmCurrent.classList.add('calculated');
                resultMessage = `Current (I) = ${formatGenericValue(v, 'V')} / ${formatGenericValue(r, 'Ω')} = ${formatGenericValue(result, 'A')}`;
            } else {
                if (i === 0) throw new Error("Current cannot be zero (open circuit).");
                const result = v / i;
                ohmResistance.value = formatGenericValue(result, 'Ω').replace(' Ω', '');
                ohmResistance.classList.add('calculated');
                resultMessage = `Resistance (R) = ${formatGenericValue(v, 'V')} / ${formatGenericValue(i, 'A')} = ${formatGenericValue(result, 'Ω')}`;
            }
    
            ohmResultLabel.textContent = resultMessage;
            ohmResultLabel.className = 'value-display success';
            if(successSound) successSound.play().catch(e => {});
    
        } catch (err) {
            ohmResultLabel.textContent = `Error: ${err.message}`;
            ohmResultLabel.className = 'value-display error';
            if(errorSound) errorSound.play().catch(e => {});
        }
    }
    
    function clearOhmsLaw() {
        ohmInputs.forEach(input => {
            if (input) {
                input.value = '';
                input.classList.remove('calculated');
            }
        });
        if (ohmResultLabel) {
            ohmResultLabel.textContent = 'Enter two values to calculate.';
            ohmResultLabel.className = 'value-display';
        }
    }

    // --- 4. BUILDER (Drag & Drop) ---
    // (Logic to be implemented)
    if (calculateCustomBtn) {
        // ... (placeholder for D&D logic) ...
    }


    // --- 5. SERIES & PARALLEL CALCULATOR ---
    if (addResistorBtn) {
        addResistorBtn.addEventListener("click", () => {
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Ex: 10k";
            input.className = "resistor-input-item"; 
            resistorList.appendChild(input);
        });
    }

    if (calcTotalBtn) {
        calcTotalBtn.addEventListener("click", () => {
            const inputs = resistorList.querySelectorAll("input");
            let total = 0;
            let values = [];

            try {
                inputs.forEach(input => {
                    if (input.value) {
                        const val = parseOhmValue(input.value);
                        if (val === null) {
                            throw new Error(`Invalid value: "${input.value}"`);
                        }
                        values.push(val);
                    }
                });

                if (values.length === 0) {
                    throw new Error("Please add at least one resistor.");
                }

                if (connectionType.value === "series") {
                    total = values.reduce((a, b) => a + b, 0);
                } else { // parallel
                    total = 1 / values.reduce((a, b) => a + (1 / b), 0);
                }

                totalResistanceLabel.textContent = `Total: ${formatResistanceValue(total)} Ω`;
                totalResistanceLabel.className = 'value-display success';
                if(successSound) successSound.play().catch(e => {});
                
                // Click the main simulator link to show the result
                const simLink = document.querySelector('.sidebar-link[data-page="page-simulator"]');
                if (simLink) simLink.click();
                
                // Wait for page transition
                setTimeout(() => {
                    resistanceInput.value = formatResistanceValue(total);
                    calculateAndShow(); // Update main simulator
                }, 50); // 50ms delay

            } catch (err) {
                totalResistanceLabel.textContent = `Error: ${err.message}`;
                totalResistanceLabel.className = 'value-display error';
                if(errorSound) errorSound.play().catch(e => {});
            }
        });
    }

    // --- 6. HISTORY (NOW WITH localStorage) ---
    
    // NEW: Add listener for the clear button
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            // We use the custom modal instead of confirm()
            window.showModal(
                "Clear History", 
                "Are you sure you want to delete all saved calculations? This cannot be undone.", 
                "confirm", // This 'type' isn't fully implemented in ui.js, but we can fake it
                () => { // This is the 'OK' callback
                    history = [];
                    localStorage.removeItem('resistorHistory');
                    updateHistoryPanel();
                }
            );
            // Since our modal doesn't *really* support "confirm" yet, we'll just ask.
            // For a simpler implementation, we can skip the confirm.
            
            // --- SIMPLER IMPLEMENTATION (No confirm) ---
            // history = [];
            // localStorage.removeItem('resistorHistory');
            // updateHistoryPanel();
            // window.showModal("History Cleared", "Your calculation history has been deleted.", "success");
        });
    }

    function addToHistory(value, bands) {
        const entry = { value, bands };
        history.unshift(entry); 
        if (history.length > 20) history.pop(); 
        
        // NEW: Save to localStorage
        localStorage.setItem('resistorHistory', JSON.stringify(history));
        
        updateHistoryPanel();
    }

    function updateHistoryPanel() {
        if (!historyPanel) return; 
        if (history.length === 0) {
            historyPanel.innerHTML = "<p>No calculations yet.</p>";
            return;
        }
        historyPanel.innerHTML = "";
        history.forEach(entry => {
            const div = document.createElement("div");
            div.className = "history-item";
            
            const val = document.createElement("span");
            val.className = "history-value";
            val.textContent = `${formatResistanceValue(entry.value)}Ω`;
            
            const bandColors = document.createElement("div");
            bandColors.className = "history-bands";
            entry.bands.forEach(color => {
                const c = document.createElement("div");
                c.className = "history-band-color";
                c.style.backgroundColor = color;
                if(color === 'white') c.style.borderColor = '#ccc';
                bandColors.appendChild(c);
            });
            
            div.appendChild(val);
            div.appendChild(bandColors);
            historyPanel.appendChild(div);
        });
    }

    if(exportHistoryBtn) {
        exportHistoryBtn.addEventListener("click", () => {
            if (history.length === 0) {
                window.showModal("Export", "History is empty.", "error");
                return;
            }
            let csvContent = "data:text/csv;charset=utf-8,Value (Ohm),Bands\n";
            history.forEach(h => {
                csvContent += `${h.value},"${h.bands.join(", ")}"\n`;
            });
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "resistor_history.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // --- 7. LED CALCULATOR ---
    if (ledCalculateBtn) {
        ledCalculateBtn.addEventListener('click', calculateLedResistor);
    }
    if (ledShowResistorBtn) {
        ledShowResistorBtn.addEventListener('click', showLedResistor);
    }

    function calculateLedResistor() {
        try {
            const vSupply = parseOhmValue(ledSupplyVoltage.value);
            const vLed = parseOhmValue(ledForwardVoltage.value);
            const iLed = parseOhmValue(ledForwardCurrent.value + 'm'); // '20' -> '20m' -> 0.02
            
            if (vSupply === null || vLed === null || iLed === null) {
                throw new Error("Please fill all fields with valid numbers.");
            }
            if (vLed >= vSupply) {
                throw new Error("Supply Voltage must be greater than LED Voltage.");
            }
            if (iLed <= 0) {
                throw new Error("Forward Current must be positive.");
            }

            const resistorValue = (vSupply - vLed) / iLed;
            const resistorPower = (vSupply - vLed) * iLed;

            lastLedResistorValue = resistorValue; 
            const nearestResistor = findNearestStandardResistor(resistorValue);

            let resultHTML = `
                Required Resistor: <strong class="highlight">${formatResistanceValue(nearestResistor)}</strong><br>
                (Exact: ${resistorValue.toFixed(2)} Ω)<br>
                Power Dissipation: <strong class="highlight">${formatGenericValue(resistorPower, 'W')}</strong>
            `;

            ledResultLabel.innerHTML = resultHTML;
            ledResultLabel.className = 'value-display success';
            ledShowResistorBtn.style.display = 'inline-flex'; 
            if(successSound) successSound.play().catch(e => {});

        } catch (err) {
            ledResultLabel.textContent = `Error: ${err.message}`;
            ledResultLabel.className = 'value-display error';
            ledShowResistorBtn.style.display = 'none'; 
            if(errorSound) errorSound.play().catch(e => {});
        }
    }
    
    function showLedResistor() {
        if (lastLedResistorValue === null) return;
        
        const simLink = document.querySelector('.sidebar-link[data-page="page-simulator"]');
        if (simLink) {
            simLink.click(); 
            
            setTimeout(() => {
                resistanceInput.value = lastLedResistorValue.toFixed(2); 
                calculateAndShow(); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 50);
        }
    }
    
    function findNearestStandardResistor(value) {
        const e12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
        if (value <= 0) return 0;

        let magnitude = Math.pow(10, Math.floor(Math.log10(value)));
        let normalized = value / magnitude;

        let bestFit = e12[0];
        let minDiff = Infinity;

        e12.forEach(val => {
            let diff = Math.abs(normalized - val);
            if (diff < minDiff) {
                minDiff = diff;
                bestFit = val;
            }
        });
        
        let diff = Math.abs(normalized - 100);
        if (diff < minDiff) {
            bestFit = 100;
        }

        return bestFit * magnitude;
    }


    // --- 8. UTILITY FUNCTIONS ---
    
    function parseOhmValue(str) {
        if (!str) return null;
        str = String(str).toLowerCase().trim().replace('r', '.').replace('ω', '').replace('v', '').replace('a', '');
        
        let multiplier = 1;
        const lastChar = str.slice(-1);
        
        if (lastChar === 'm') {
             multiplier = 1e-3; // milli
             str = str.slice(0, -1);
        } else if (str.slice(-1).toUpperCase() === 'M') { // Check for Mega
             multiplier = 1e6; // Mega
             str = str.slice(0, -1);
        } else if (lastChar === 'k') {
            multiplier = 1e3;
            str = str.slice(0, -1);
        } else if (lastChar === 'g') {
            multiplier = 1e9;
            str = str.slice(0, -1);
        } else if (lastChar === 'u' || lastChar === 'µ') { // micro
            multiplier = 1e-6;
            str = str.slice(0, -1);
        } else if (lastChar === 'n') { // nano
            multiplier = 1e-9;
            str = str.slice(0, -1);
        }

        const value = parseFloat(str.replace(',', '.'));
        if (isNaN(value)) return null;
        
        return value * multiplier;
    }

    function formatGenericValue(value, unit) {
        if (value === 0) return `0 ${unit}`;
        
        const absValue = Math.abs(value);
        let prefix = '';

        if (absValue >= 1e9) { value /= 1e9; prefix = ` G${unit}`; }
        else if (absValue >= 1e6) { value /= 1e6; prefix = ` M${unit}`; }
        else if (absValue >= 1e3) { value /= 1e3; prefix = ` k${unit}`; }
        else if (absValue < 1e-6) { value /= 1e-9; prefix = ` n${unit}`; }
        else if (absValue < 1e-3) { value /= 1e-6; prefix = ` µ${unit}`; }
        else if (absValue < 1) { value /= 1e-3; prefix = ` m${unit}`; }
        else { prefix = ` ${unit}`; }
        
        let numStr = value.toPrecision(3);
        if (numStr.includes('.')) {
            numStr = numStr.replace(/\.0+$/, ''); // 1.00 -> 1
            numStr = numStr.replace(/0+$/, ''); // 1.200 -> 1.2
            numStr = numStr.replace(/\.$/, ''); // 1. -> 1
        }

        return numStr + prefix;
    }

    function formatResistanceValue(value) {
        return formatGenericValue(value, 'Ω').replace(' ', '');
    }

    function getTolerance(color) {
        const tolerances = {
            'brown': '±1%', 'red': '±2%', 'green': '±0.5%', 'blue': '±0.25%',
            'purple': '±0.1%', 'grey': '±0.05%', 'gold': '±5%', 'silver': '±10%'
        };
        return tolerances[color] || '±20%'; 
    }
    
    // --- 9. PAGE INITIALIZATION ---
    
    if (bandSelect) {
        bandSelect.addEventListener('change', toggleInverseCalculatorBands);
    }
    
    initializeInverseCalculator();
    toggleInverseCalculatorBands(); 
    calculateFromColors(); 
    
    clearOhmsLaw(); 
    
    // NEW: Load history from localStorage on startup
    updateHistoryPanel();
});
