from flask import Blueprint, request, jsonify
from utils import resistor_to_colors, random_resistor

bp = Blueprint("routes", __name__)

@bp.route("/calculate", methods=["POST"])
def calculate():
    """ Calcule les bandes de couleur à partir d'une valeur. """
    value = request.json.get("value")
    bands = request.json.get("bands", 4)
    try:
        value = float(value)
        bands = int(bands)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid input. Please enter a number."}), 400

    colors = resistor_to_colors(value, bands)
    if not colors:
        return jsonify({"error": "Value out of range (1.0 Ohm to 999 Giga-Ohm)"}), 400
    return jsonify({"value": value, "bands": colors})

@bp.route("/random")
def random_value():
    """ Génère une valeur de résistance aléatoire et ses couleurs. """
    bands = request.args.get("bands", 4)
    try:
        bands = int(bands)
    except (ValueError, TypeError):
        bands = 4
        
    value = random_resistor(bands)
    colors = resistor_to_colors(value, bands)
    
    if not colors:
        # Si la valeur aléatoire est hors limites (ne devrait pas arriver), recommencer.
        value = random_resistor(bands)
        colors = resistor_to_colors(value, bands)

    return jsonify({"value": value, "bands": colors})
