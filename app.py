from flask import Flask, render_template
from routes import bp as routes_bp

app = Flask(__name__)
app.register_blueprint(routes_bp)

@app.route("/")
def index():
    """ Renvoyer la page principale de la boîte à outils. """
    return render_template("index.html")

@app.route("/challenge")
def challenge():
    """ Renvoyer la page du mode défi. """
    return render_template("challenge.html")

if __name__ == "__main__":
    app.run(debug=True)
