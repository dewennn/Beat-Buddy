# ------------------------------- Process Data ------------------------------- #

import numpy as np
import pandas as pd

df = pd.read_csv('./songs.csv')

# Remove unused features (All features that are neither the track details (song name, artist, ID, track popularity) nor features that explain how the track sounds.)
x = ['track_album_id', 'track_album_name', 'track_album_release_date', 'playlist_name', 'playlist_id', 'playlist_genre', 'playlist_subgenre', 'duration_ms', 'mode', 'liveness']

for col in x:
    df.pop(col)

# Remove duplicate data
df = df.sort_values('track_popularity', ascending=False)
df = df.drop_duplicates(subset=['track_name', 'track_artist'])
df = df.dropna()
df = df.sort_index().reset_index()
df.pop('index')

# Create a formatted version of the song name (will be use for searching purposes)
df['formatted_track_name'] = df['track_name'].str.lower().str.replace(r'\s+', '', regex=True)

# Seperate the song details from the features
track_details = pd.DataFrame()
track_details['track_id'] = df.pop('track_id')
track_details['track_name'] = df.pop('track_name')
track_details['track_artist'] = df.pop('track_artist')
track_details['formatted_track_name'] = df.pop('formatted_track_name')
track_details['track_popularity'] = df.pop('track_popularity')

import pickle

# Load Scaler
with open('scaler.pkl', 'rb') as file:
    scaler = pickle.load(file)

# Process dataset
col = df.columns
df = pd.DataFrame(scaler.transform(df), columns=col)

# Create a seperate feature only df (will be use to find coorelation/similar songs)
df_compare = df.copy()

# Put the details back into our main dataframe
df[['track_id', 'track_name', 'track_artist', 'formatted_track_name', 'track_popularity']] = track_details

df_compare['track_id'] = df['track_id']


# ----------------------------------- Model ---------------------------------- #
# Load Model
with open('model.pkl', 'rb') as file:
    model = pickle.load(file)

import re
from sklearn.metrics.pairwise import cosine_similarity

def find_song(song_id: str):
    global df_compare
    return(df_compare[df_compare['track_id'] == song_id])

def find_similar_song(song_id=None, song_features=None, limit=5, listened_idx = []):
    if limit > 100: limit = 100

    song = song_features if song_features is not None else find_song(song_id).drop(columns = ['track_id'])

    similarity = pd.DataFrame(cosine_similarity(song, df_compare.drop(columns=['track_id']))).T

    similarity = pd.concat([df.copy(), similarity], axis=1)
    similarity = similarity.rename(columns={0:"similarity"})

    similarity = similarity[~similarity['track_id'].isin(listened_idx)]
    similarity = similarity.sort_values(by="similarity", ascending=False)

    similarity = similarity.head(limit + 1).reset_index().drop(index=0) if song_id is not None else similarity.head(limit).reset_index()
    similarity.pop('similarity')

    return(similarity)

def find_song_client(song_name: str, no_song_id= None):
    song_name = re.sub(r'\s+', '', song_name.lower())

    temp = df.copy()
    if no_song_id is not None: temp = temp[~temp['track_id'].isin(no_song_id)]
    temp = temp[temp['formatted_track_name'].str.match(song_name)].sort_values('track_popularity', ascending=False).head(5)

    buttons = []

    for i in range(temp.__len__()):
        buttons.append((temp.iloc[i].values.tolist()[10], temp.iloc[i].values.tolist()[11], temp.iloc[i].values.tolist()[9]))

    return buttons

def find_similar_song_client(song_id: str, limit=10):
    if(song_id.__len__() <= 0): return
    temp = find_similar_song(song_id=song_id, limit=limit)
    temp = temp.drop(columns=['track_popularity', 'danceability', 'energy', 'key', 'loudness', 'speechiness', 'acousticness', 'instrumentalness','valence', 'tempo', 'track_id', 'formatted_track_name'])
    
    songs = []

    for i in range(temp.__len__()):
        songs.append([temp.iloc[i].values.tolist()[1], temp.iloc[i].values.tolist()[2]])

    return(songs)

def id_to_df(id_list):
    global df
    temp = df.copy()
    temp = temp[temp['track_id'].isin(id_list)]
    return temp

def recommend_songs(user: pd.DataFrame, ammount):
    global df, scaler

    listened_idx = user['track_id']

    user = user.drop(columns=['track_id', 'track_name', 'track_artist', 'formatted_track_name', 'track_popularity'])

    user['cluster'] = model.predict(user)

    df_taste = pd.DataFrame(columns=user.columns)
    df_taste["freq"] = 0

    for c in user["cluster"].unique():
        cluster_data = user[user["cluster"] == c].drop(columns=["cluster"])
        cluster_mean = cluster_data.mean()
        cluster_freq = len(cluster_data)

        cluster_taste = cluster_mean.to_frame().T
        cluster_taste["cluster"] = c
        cluster_taste["freq"] = cluster_freq
        df_taste = pd.concat([df_taste, cluster_taste], ignore_index=True)

    df_taste = df_taste.sort_values(by="freq", ascending=False, ignore_index=True)
    df_taste.pop("cluster")

    ctr = ammount
    recommended = pd.DataFrame(columns=df.columns)
    for _, row in df_taste.iterrows():
        freq = row.pop("freq")

        x = pd.DataFrame([row])

        lim = int(np.ceil(ammount * freq/len(user)))

        recommended = pd.concat([recommended, find_similar_song(song_id=None, song_features=x, limit=lim, listened_idx=listened_idx)])

        ctr -= lim
        if ctr <= 0: break

    return recommended

def recommend_songs_client(id_list):
    temp = id_to_df(id_list)
    temp = recommend_songs(temp, 10)
    temp = temp[['track_name', 'track_artist']]

    recommendations = []

    for i in range(temp.__len__()):
        recommendations.append((temp.iloc[i].values.tolist()[0], temp.iloc[i].values.tolist()[1]))

    return recommendations