from flask import Flask, render_template, url_for, request, jsonify, make_response
import json, os
from time import time
from random import random
from flask import Flask, render_template, make_response

app = Flask(__name__)


# ================================= GET DATA
# graph_data = { # Path Costs from one city to another via road (km) taken from google maps (minimum distance possible)
#     ("Chandigarh", "Zirakpur"): 12.6,
#     ("Zirakpur", "Ambala"): 34.1,
#     ("Ambala", "Shahbad"): 27.7,
#     ("Shahbad", "Kurukshetra"): 24.3,
#     ("Kurukshetra", "Karnal"): 37.1,
    
#     ("Chandigarh", "Rajpura"): 41.7,
#     ("Rajpura", "Patiala"): 28.2,
#     ("Patiala", "Pehowa"): 50.6,
#     ("Pehowa", "Karnal"): 56.2,
# }

# # GET NODE NAMES FOR INITIAL AND FINAL STATE LISTS
# states = sorted(list(set([v for key in graph_data.keys() for v in key])))
# states_list = dict(initial_states = states, goal_states = states)
# # rev_graph_data = {(k[1], k[0]):v for k,v in graph_data.items()}
# # graph_data.update(rev_graph_data)
# print(graph_data)

# network = {
#     "states_data": [{
#         "from": k[0],
#         "to": k[1],
#         "width": 6,
#         "length": graph_data[k],
#         # "color": "red"
#     } for k in graph_data.keys()],
#     # "coordinates": None
# }

# ---------------------------------------------------- ROMAINA
THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
filepath = os.path.join(THIS_FOLDER, "romania_map.json")
with open(filepath) as f: # Get data
    graph_data = json.load(f)
locations = dict(
    Arad=(91, 492), Bucharest=(400, 327), Craiova=(253, 288),
    Drobeta=(165, 299), Eforie=(562, 293), Fagaras=(305, 449),
    Giurgiu=(375, 270), Hirsova=(534, 350), Iasi=(473, 506),
    Lugoj=(165, 379), Mehadia=(168, 339), Neamt=(406, 537),
    Oradea=(131, 571), Pitesti=(320, 368), Rimnicu=(233, 410),
    Sibiu=(207, 457), Timisoara=(94, 410), Urziceni=(456, 350),
    Vaslui=(509, 444), Zerind=(108, 531)
)

states = []
for key in graph_data.keys():
    states.append(key)
    for key2 in graph_data[key].keys():
        states.append(key2)
states_list = dict(
    initial_states = sorted(list(set(states))),
    goal_states = sorted(list(set(states)))
)
network = {
    "states_data": [{
        "from": k,
        "to": vk,
        "width": 8,
        # "length": graph_data[k][vk],
        "color": 'grey',
        "cost": graph_data[k][vk]
    } for k in graph_data.keys() for vk in graph_data[k]],
    "coordinates": locations
}
# Highcharts cannot create bi-directional links. So, we need to do it
reverse_links = [{
        "from": vk,
        "to": k,
        "width": 8,
        # "length": graph_data[k][vk],
        "color": 'grey',
        "cost": graph_data[k][vk]
    } for k in graph_data.keys() for vk in graph_data[k]]
# Add these to data
network["states_data"] += reverse_links

# print((network["states_data"]))

# ------------------------------------------------------------------


# ================================= FLASK METHODS
@app.route('/', methods=["GET", "POST"])
def main():
    return render_template('index.html')


@app.route('/graphdata', methods=["POST"])
def graph_data_func():
    res = make_response(jsonify(states_list), 200)
    return res

@app.route('/networkdata', methods=["POST"])
def network_func():
    res = make_response(jsonify(network), 200)
    return res

# if __name__ == "__main__":
#     app.run(debug=True)