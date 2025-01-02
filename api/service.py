import WingspanScores
import json
import numpy as np

def getJSONEloHistory():
    data = WingspanScores.loadScores()
    elo_history = WingspanScores.generateEloHistoryByGameId(data)
    lst = []
    for player in elo_history.dtype.names:
        lst.append({
            'player': player,
            'history': elo_history[player].tolist()
             })
    jsn = json.dumps(lst)
    return jsn
    
def getPlayerCard(player):
    achievements = WingspanScores.getPlayerAchievements(player)
    playerCard = []
    for achievement in achievements:
        category_name = WingspanScores.CATEGORIES[achievement['category']]
        renamed_achievement = achievement
        renamed_achievement['category'] = category_name
        playerCard.append(renamed_achievement)
    return playerCard

def getPlayers():
    data = WingspanScores.loadScores()
    return np.unique(data["Name"]).tolist()

def getGames():
    data = WingspanScores.loadScores()
    games = []
    for game_id in np.unique(data["Game_ID"]):
        game_data = data[data["Game_ID"] == game_id]
        games.append({
            'id': game_id,
            'numPlayers': int(game_data["Players_in_game"][0]),
            'winner': str(game_data[game_data["Place"] == 1]["Name"][0]),
            'topScore': int(game_data[game_data["Place"] == 1]["Total"][0])
        })
    return games

def getLeaderboards():
    data = WingspanScores.loadScores()
    categories = WingspanScores.CATEGORIES
    elo_history = WingspanScores.generateEloHistoryByGameId(data)
    players = elo_history.dtype.names
    category_rankings = WingspanScores.getCategoryRankings(data, categories, elo_history)
    leaderboards = {}
    for category in category_rankings.dtype.names:
        category_leaderboard = []
        for player in players:
            player_category_data = {}
            player_category_data["player"] = player
            rank, score, game_id = WingspanScores.getPlayerRank(player, category, category_rankings[category], data, elo_history)
            player_category_data["rank"] = rank
            player_category_data["score"] = score
            player_category_data["game_id"] = game_id
            category_leaderboard.append(player_category_data)
        leaderboards[category] = category_leaderboard
    return leaderboards

def getCategories():
    return {
        'categories' : WingspanScores.CATEGORIES,
        'best_titles': WingspanScores.BEST_TITLES
    }