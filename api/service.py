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
            'topScore': int(game_data[game_data["Place"] == 1]["Total"][0]),
            'expansions': WingspanScores.EXPANSIONS[str(game_data['Expansion'][0])]
        })
    return games

def getGameById(game_id):
    data = WingspanScores.loadScores()
    game_data = data[data["Game_ID"] == game_id]
    game_info = {
        'id': game_id,
        'numPlayers': int(game_data["Players_in_game"][0]),
        'winner': str(game_data[game_data["Place"] == 1]["Name"][0]),
        'topScore': int(game_data[game_data["Place"] == 1]["Total"][0]),
        'expansions': WingspanScores.EXPANSIONS[str(game_data['Expansion'][0])],
        'playerInfo': [],
        'columns': []
    }
    elo_history = WingspanScores.generateEloHistoryByGameId(data)
    for player_data in game_data:
        player_info = {
            'playerName': str(player_data['Name']),
            'place': int(player_data['Place']),
            'total': int(player_data['Total']),
            'birds': int(player_data['Birds']),
            'bonusCards': int(player_data['Bonus_Cards']),
            'endOfRoundGoals': int(player_data['EndofRound_Goals']),
            'eggs': int(player_data['Eggs']),
            'foodOnCards': int(player_data['Food_on_Cards']),
            'tuckedCards': int(player_data['Tucked_Cards']),
            'nectar': int(player_data['Nectar']),
            'eloBefore': elo_history[game_id-1][player_data['Name']],
            'eloAfter': elo_history[game_id][player_data['Name']],
            'eloChange': elo_history[game_id][player_data['Name']] - elo_history[game_id-1][player_data['Name']]
        }
        game_info['playerInfo'].append(player_info)
    game_info['columns'] = [
        {
            'key': 'playerName',
            'title': 'Player name',
            'order': 1
        }, 
        {
            'key': 'place',
            'title': 'Place',
            'order': 2
        }, 
        {
            'key': 'total',
            'title': 'Total score',
            'order': 3
        }, 
        {
            'key': 'birds',
            'title': 'Birds points',
            'order': 4
        }, 
        {
            'key': 'bonusCards',
            'title': 'Bonus card points',
            'order': 5
        }, 
        {
            'key': 'endOfRoundGoals',
            'title': 'End of round goal points',
            'order': 6
        }, 
        {
            'key': 'eggs',
            'title': 'Eggs',
            'order': 7
        }, 
        {
            'key': 'foodOnCards',
            'title': 'Food on cards',
            'order': 8
        }, 
        {
            'key': 'tuckedCards',
            'title': 'Tucked cards',
            'order': 9
        }, 
        {
            'key': 'eloBefore',
            'title': 'Elo before',
            'order': 11
        }, 
        {
            'key': 'eloAfter',
            'title': 'Elo after',
            'order': 12
        }, 
        {
            'key': 'eloChange',
            'title': 'Elo won/lost',
            'order': 13
        }
    ]
    if game_info['playerInfo'][0]['nectar'] != -1:
        game_info['columns'].append(
            {
                'key': 'nectar',
                'title': 'Nectar points',
                'order': 10
            })
    return game_info



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