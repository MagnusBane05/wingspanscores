from flask import Flask
from flask.json.provider import DefaultJSONProvider
import service
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

@app.route('/api/playerCard/<string:player>')
def get_player_card(player):
    return service.getPlayerCard(player)

@app.route('/api/eloHistory')
def get_elo_history():
    return service.getJSONEloHistory()

@app.route('/api/playerNames')
def get_players():
    return service.getPlayers()

@app.route('/api/gamesList')
def get_game_list():
    return service.getGames()

@app.route('/api/games/<int:gid>')
def get_game(gid):
    return service.getGameById(gid)

@app.route('/api/leaderboards')
def get_leaderboards():
    return service.getLeaderboards()

@app.route('/api/categories')
def get_categories():
    return service.getCategories()