⚡️ ResistorSim — The Ultimate Electronics Toolbox

A sleek, interactive, and fully responsive web app for modern electronics enthusiasts.
Calculate, visualize, and learn everything about resistors, LEDs, and Ohm’s Law — all in one elegant interface.

🌐 Live Demo

🎥 Preview

✨ Overview

ResistorSim started as a simple resistor color code calculator and evolved into a full dashboard-style electronics companion.
Built with a Flask backend and a pure HTML/CSS/JS frontend, it delivers both precision and style.

Whether you’re an engineering student, a hardware tinkerer, or just someone who enjoys flashing LEDs at 2 AM, this toolbox is your new best friend.

⚙️ Features
🧮 Core Tools

Resistor Color Code Calculator

🔁 Value → Color: Enter a value (e.g. 4.7k, 330, 1.5M) and see its 4 or 5-band color code visualized.

🎨 Color → Value: Pick band colors to instantly get resistance and tolerance.

LED Resistor Calculator:
Compute the ideal resistor and power rating for your LEDs — no smoke, just glow.

Ohm’s Law Solver:
Solve for V, I, or R with automatic unit parsing (k, M, m, µ supported).

Series & Parallel Calculators:
Combine resistors and get instant equivalent resistance results.

Challenge Mode 🎯
A playful quiz that tests your knowledge of resistor color codes — because learning should be fun.

🧠 Smart & Interactive

⚡ Dynamic “Show Colors” Integration: Calculations sync seamlessly between tools.

💾 Local History: Stores the last 20 calculations in your browser.

🌓 Dark Mode: Sleek and persistent — your eyes will thank you.

🔊 Audio Feedback: Toggleable sounds for correct/incorrect interactions.

💅 Custom Modals: No more ugly alert() boxes — only smooth UI transitions.

💻 Modern Design

Sidebar Navigation: Switch between tools fluidly.

Fully Responsive: Works beautifully on desktop, tablet, and mobile.

Lucide Icons: Clean SVG icons for a professional look.

CSS Variables: Global theming made simple.

🛠️ Tech Stack
Layer	Technologies
Backend	Python 3 · Flask · Gunicorn
Frontend	HTML5 · CSS3 · Vanilla JavaScript (ES6+)
UI/UX	Lucide Icons · Custom Modals · CSS Variables
Storage	LocalStorage (for history & theme)

🗂️ Project Structure
resistorsim/
│
├── app.py               # Flask entry point
├── utils.py             # Core resistor logic
│
├── static/
│   ├── css/
│   │   ├── style.css
│   │   ├── navbar.css
│   │   └── footer.css
│   ├── js/
│   │   ├── main.js
│   │   ├── ui.js
│   │   └── challenge.js
│   ├── img/
│   └── audio/
│
└── templates/
    ├── index.html
    ├── challenge.html
    └── components/
        ├── navbar.html
        └── footer.html

🚀 Getting Started
Prerequisites

🐍 Python 3.7+

📦 pip (Python package manager)
# 1️⃣ Clone the repository
git clone https://github.com/YOUR_USERNAME/resistorsim.git
cd resistorsim

# 2️⃣ Create a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 3️⃣ Install dependencies
pip install -r requirements.txt

# 4️⃣ Run the application
python app.py
Open your browser at → http://127.0.0.1:5000

🧰 requirements.tx
Flask
gunicorn

☁️ Deployment

You can host everything on one site (Flask + Frontend) using Render
.

🪄 Render Deployment Steps

Push your project to GitHub.

Create a new Web Service on Render.

Connect your repo and set:

Build Command: pip install -r requirements.txt

Start Command: gunicorn app:app

Deploy 🎉
→ You’ll get a public URL like https://resistorsim.onrender.com

🖼️ Future Enhancements

✅ Save/load custom resistor sets

✅ Add capacitor/inductor calculators

✅ Add color-blind accessibility mode

✅ Internationalization (EN / FR support)

Pull requests are welcome!
If you have new calculator ideas, UI tweaks, or bug fixes:

Fork the repo

Create a feature branch (git checkout -b feature/new-tool)

Commit, push, and open a PR 🎯

🧑‍💻 Author

Ahmed Laminou Amadou
📬 Passionate about physics, coding, and making the invisible visible.

📜 License

This project is open-source under the MIT License — see the LICENSE
 file for details.

 
