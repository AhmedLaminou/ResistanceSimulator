import random
from math import log10, floor

# Codes couleur standard
COLOR_CODES = {
    'black': 0, 'brown': 1, 'red': 2, 'orange': 3, 'yellow': 4,
    'green': 5, 'blue': 6, 'purple': 7, 'grey': 8, 'white': 9
}
COLOR_NAMES = list(COLOR_CODES.keys())

MULTIPLIERS = {
    'black': 0, 'brown': 1, 'red': 2, 'orange': 3, 'yellow': 4,
    'green': 5, 'blue': 6, 'purple': 7, 'grey': 8, 'white': 9,
    'gold': -1, 'silver': -2
}

TOLERANCE_COLORS = {
    'brown': '±1%', 'red': '±2%', 'green': '±0.5%', 'blue': '±0.25%',
    'purple': '±0.1%', 'grey': '±0.05%', 'gold': '±5%', 'silver': '±10%'
}
TOLERANCE_NAMES = list(TOLERANCE_COLORS.keys())

def resistor_to_colors(value, bands=4):
    """ Calcule les couleurs pour une valeur donnée. """
    if not (1.0 <= value < 1e12): # 1 Ohm à 999 Giga-Ohm
        return None

    s_value = f"{value:.9f}" # Assez de précision
    power = floor(log10(value))
    
    colors = []
    
    if bands == 4:
        # 2 chiffres, 1 multiplicateur, 1 tolérance
        if value < 10:
             # ex: 4.7 Ohm -> "47" * 10^-1 (gold)
             digits = f"{value * 10:.0f}"
             if len(digits) == 1: digits = f"0{digits}" # 1.0 -> 10
             digit1 = int(digits[0])
             digit2 = int(digits[1])
             multiplier_power = -1 # gold
        elif value < 100:
             # ex: 82 Ohm -> "82" * 10^0 (black)
             digits = f"{value:.0f}"
             digit1 = int(digits[0])
             digit2 = int(digits[1])
             multiplier_power = 0 # black
        else:
            # ex: 4700 -> "47" * 10^2 (red)
            digits = str(int(value))[0:2]
            digit1 = int(digits[0])
            digit2 = int(digits[1])
            multiplier_power = power - 1
            
        colors.append(COLOR_NAMES[digit1])
        colors.append(COLOR_NAMES[digit2])
        
        if multiplier_power == -1: colors.append('gold')
        elif multiplier_power == -2: colors.append('silver')
        else: colors.append(COLOR_NAMES[multiplier_power])
        
    elif bands == 5:
        # 3 chiffres, 1 multiplicateur, 1 tolérance
        if value < 100:
            # ex: 4.7 -> "470" * 10^-2 (silver)
            # ex: 82.5 -> "825" * 10^-1 (gold)
            if value < 10: # 4.7
                digits = f"{value * 100:.0f}"[0:3] # "470"
                multiplier_power = -2
            else: # 82.5
                digits = f"{value * 10:.0f}"[0:3] # "825"
                multiplier_power = -1
        else:
            # ex: 4750 -> "475" * 10^1 (brown)
            digits = str(f"{value:.10f}") # "4750.00..."
            non_decimal = digits.split('.')[0]
            digits_str = (non_decimal + digits.split('.')[1])[0:3] # "475"
            digit1 = int(digits_str[0])
            digit2 = int(digits_str[1])
            digit3 = int(digits_str[2])
            
            multiplier_power = power - 2
        
        digit1 = int(digits[0])
        digit2 = int(digits[1])
        digit3 = int(digits[2])
        
        colors.append(COLOR_NAMES[digit1])
        colors.append(COLOR_NAMES[digit2])
        colors.append(COLOR_NAMES[digit3])

        if multiplier_power == -1: colors.append('gold')
        elif multiplier_power == -2: colors.append('silver')
        else: colors.append(COLOR_NAMES[multiplier_power])

    colors.append(random.choice(TOLERANCE_NAMES))
    return colors

def random_resistor(bands=4):
    """ Génère une valeur aléatoire. """
    if bands == 4:
        digit1 = random.randint(1, 9) # 1-9
        digit2 = random.randint(0, 9) # 0-9
        base = (digit1 * 10) + digit2
    else: # 5 bands
        digit1 = random.randint(1, 9) # 1-9
        digit2 = random.randint(0, 9) # 0-9
        digit3 = random.randint(0, 9) # 0-9
        base = (digit1 * 100) + (digit2 * 10) + digit3
    
    # -2 (silver) to 7 (purple)
    multiplier_power = random.randint(-2, 7) 
    value = base * (10 ** multiplier_power)
    return value
