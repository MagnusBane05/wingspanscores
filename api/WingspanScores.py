import matplotlib.pyplot as plt
import numpy as np

STARTING_ELO = 1500
k = 32
d = 400
CATEGORIES = {
    'Birds': 'Birds',
    'Bonus_Cards': 'Bonus Cards',
    'EndofRound_Goals': 'End of Round Goals',
    'Eggs': 'Eggs',
    'Food_on_Cards': 'Food on Cards',
    'Tucked_Cards': 'Tucked Cards',
    'Total': 'Total Score',
    'Elo': 'Elo',
    'Win_Streak': 'Win Streak',
    'Wins': 'Wins',
    'Elo_Gain': 'Single Game Elo Gain'
}

BEST_TITLES = {
    'Birds': 'Most Bird Points',
    'Bonus_Cards': 'Most Bonus Card Points',
    'EndofRound_Goals': 'Most End of Round Goal Points',
    'Eggs': 'Most Eggs',
    'Food_on_Cards': 'Most Food on Cards',
    'Tucked_Cards': 'Most Tucked Cards',
    'Total': 'Highest Total Score',
    'Elo': 'Highest Elo',
    'Win_Streak': 'Longest Win Streak',
    'Wins': 'Number of Wins',
    'Elo_Gain': 'Most Elo Gained in Single Game'
}

def loadScores(): 
    filename = './WingspanScores.csv'
    field_types = '<U21, int, int, int, int, int, int, int, int, int, <U21, int'
    data = np.genfromtxt(filename, dtype=field_types, names=True, delimiter=',')
    return data

def generatePairs(data):
    pairs = []
    gameIds = data['Game_ID']
    names = data['Name']
    places = data['Place']
    for i in range(data.shape[0]):
        gameId = gameIds[i]
        name = names[i]
        j = i+1
        while j < data.shape[0] and gameIds[j] == gameId:
            result = 0.5 if places[i] == places[j] else int(places[i] < places[j])
            pairs.append((name, names[j], result))
            j += 1
    return np.array(pairs, dtype=[('Player 1', '<U21'), ('Player 2', '<U21'), ('Result', 'int')])

def updateElo(elos, game, k, d):
    player1 = game[0]
    player2 = game[1]
    result = game[2]
    player1_old_elo = elos[player1]
    player2_old_elo = elos[player2]

    player1_expected_result = 1./(1+10**((player2_old_elo-player1_old_elo)/d))
    player2_expected_result = 1./(1+10**((player1_old_elo-player2_old_elo)/d))

    # if player1 == 'Keith' or player2 == 'Keith':
    #     print(f'{player1} vs {player2}: expected result is {player1_expected_result}')

    player1_elo_change = (result - player1_expected_result)*k
    player2_elo_change = ((1-result) - player2_expected_result)*k

    player1_new_elo = player1_old_elo + player1_elo_change
    player2_new_elo = player2_old_elo + player2_elo_change

    return player1_new_elo, player2_new_elo

def updateEloHistoryEntry(pairings, player_names, elo_history, i):
    elos = np.rec.fromarrays(elo_history[i-1], names=','.join(player_names))
    player1_new_elo, player2_new_elo = updateElo(elos, pairings[i-1], k, d)
    for player in player_names:
        new_elo = elo_history[player][i-1]
        if player == pairings[i-1][0]:
            new_elo = player1_new_elo
        elif player == pairings[i-1][1]:
            new_elo = player2_new_elo
        elo_history[player][i] = new_elo
    return elo_history

def generateEloHistoryOfGame(data, previous_elos):
    pairings = generatePairs(data)
    player_names = np.unique(data["Name"])
    elo_history = np.rec.fromarrays([[0]*(pairings.shape[0]+1)]*len(player_names), names=','.join(player_names))
    for player_name in player_names:
        elo_history[player_name][0] = previous_elos[player_name]
    for i in range(1, elo_history.shape[0]):
        elo_history = updateEloHistoryEntry(pairings, player_names, elo_history, i)
    return elo_history

def generateEloHistoryByGameId(data):
    gameIds = np.unique(data["Game_ID"])
    player_names = np.unique(data["Name"])
    elo_history = np.rec.fromarrays([[STARTING_ELO]*(gameIds.shape[0]+1)]*len(player_names), names=','.join(player_names))

    for game_id in gameIds:
        game_data = data[data["Game_ID"] == game_id]
        previous_elos = elo_history[game_id-1]
        game_elo_history = generateEloHistoryOfGame(game_data, previous_elos)
        for player in player_names:
            if player in np.unique(game_data["Name"]):
                elo_history[player][game_id] = game_elo_history[player][game_elo_history.shape[0]-1]
            else:
                elo_history[player][game_id] = elo_history[player][game_id-1]
    return elo_history

def displayEloHistoryChart(elo_history, names=[]):
    _, ax = plt.subplots()
    
    if len(names) == 0:
        names = elo_history.dtype.names
    for name in names:
        ax.plot(elo_history[name], label=name)

    for line, name in zip(ax.lines, names):
        y = line.get_ydata()[-1]
        ax.annotate(f'{name} ({y})', xy=(1,y), xytext=(6,0), color=line.get_color(), 
                    xycoords = ax.get_yaxis_transform(), textcoords="offset points",
                    size=9, va="center")

    plt.xticks(np.arange(0, elo_history.shape[0], 2))
    plt.xlabel('Game Number')
    plt.ylabel('Elo Rating')
    plt.title('Elo Rating History')
    plt.show()

def getPlayerBest(data, elo_history, player, category):
    def nameEqualsString(x):
        return x['Name'] == player
    
    best_score = -1
    game_id = -1
    if category == 'Elo':
        game_id = np.argmax(elo_history[player])
        best_score = elo_history[player][game_id]
    elif category == 'Win_Streak':
        places = data[nameEqualsString(data)]['Place']
        longest_streak = 0
        current_streak = 0
        for place in places:
            if place == 1:
                current_streak += 1
            else:
                current_streak = 0
            if current_streak > longest_streak:
                longest_streak = current_streak
        best_score = longest_streak
    elif category == 'Wins':
        places = data[nameEqualsString(data)]['Place']
        unique, counts = np.unique(places, return_counts=True)
        places_counts = dict(zip(unique, counts))
        wins = places_counts[1] if 1 in places_counts.keys() else 0
        best_score = wins
    elif category == 'Elo_Gain':
        elos = elo_history[player]
        elo_changes = [x-elos[i] for i,x in enumerate(elos[1:])]
        game_id = np.argmax(elo_changes)+1
        best_score = elo_changes[game_id-1]
    else:
        values = data[nameEqualsString(data)][category]
        max_index = np.argmax(values)
        best_score = values[max_index]
        game_id = data[nameEqualsString(data)]['Game_ID'][max_index]
    return best_score, game_id

def getCategoryRankings(data, categories, elo_history):
    rankings = []

    players = np.unique(data['Name'])
    for category in categories:
        highest_in_category = []
        for player in players:
            player_best, _ = getPlayerBest(data, elo_history, player, category)
            highest_in_category.append((player, player_best))
        sorted_high_scores = sorted(highest_in_category, key=lambda tup: tup[1], reverse=True)
        rankings.append([x[0] for x in sorted_high_scores])


    return np.rec.fromarrays(rankings, names=','.join(categories))

def getPlayerRank(player, category, category_ranking, data, elo_history):
    player_ranking = np.where(category_ranking==player)[0][0]
    player_best, game_id = getPlayerBest(data, elo_history, player, category)
    while player_ranking > 0 and player_best == getPlayerBest(data, elo_history, category_ranking[player_ranking-1], category)[0]:
        player_ranking -= 1
    return player_ranking + 1, player_best, game_id


def getPlayerAchievements(player, n=3):
    data = loadScores()
    elo_history = generateEloHistoryByGameId(data)

    categories = CATEGORIES.keys()
    category_rankings = getCategoryRankings(data, categories, elo_history)

    player_rankings = []
    for category in categories:
        player_ranking = np.where(category_rankings[category]==player)[0][0]
        player_rankings.append((category, player_ranking+1))
    
    sorted_player_rankings = sorted(player_rankings, key=lambda tup: tup[1])

    achievements = []
    for i in range(n):
        category = sorted_player_rankings[i][0]
        best_score, game_id = getPlayerBest(data, elo_history, player, category)
        achievements.append({
            "category": category, 
            "best": best_score,
            "rank": sorted_player_rankings[i][1],
            "game_id": game_id,
            "best_title": BEST_TITLES[category]})

    return achievements


if __name__ == '__main__':
    pass
    # displayPlayerCard('Bassam')
    # elo_history = generateEloHistoryByGameId()
    # displayEloHistoryChart(elo_history)#, names=["Marlee", "Evan", "Angela", "Keith"])