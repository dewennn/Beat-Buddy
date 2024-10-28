from flask import Flask, request, jsonify
from flask_cors import CORS
import modelHandler

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/search-songs", methods=['POST'])
def process_search_request():
    data = request.get_json()
    print(f"Received data: {data}")

    if len(data['profile']) > 0:
        return jsonify({"message": "Data received", "data": modelHandler.find_song_client(data['songName'], [song[2] for song in data['profile']])})
    else:
        return jsonify({"message": "Data received", "data": modelHandler.find_song_client(data['songName'])})


@app.route("/similar-songs", methods=['POST'])
def process_similar_request():
    data = request.get_json()
    print(f"Received data: {data}")

    return jsonify({"message": "Data received", "data": modelHandler.find_similar_song_client(data['songID'])})

@app.route("/generate-playlist", methods=['POST'])
def process_generate_playlist():
    data = request.get_json()
    print(f"Received data: {data}")

    return jsonify({"message": "Data received", "data": modelHandler.recommend_songs_client([song[2] for song in data['profile']])})

if __name__ == "__main__":
    app.run(debug=True)