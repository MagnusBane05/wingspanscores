import time
from flask import Flask
from flask.json.provider import DefaultJSONProvider
from WingspanScores import getPlayerCard
import numpy as np


class NumpyArrayEncoder(DefaultJSONProvider):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        else:
            return super().default(obj)


class CustomizedFlask(Flask):
    json_provider_class = NumpyArrayEncoder

app = CustomizedFlask(__name__)

@app.route('/time')
def get_current_time():
    return { 'time': time.time() }

@app.route('/playerCard/<string:player>')
def get_player_card(player="Evan"):
    return getPlayerCard(player)