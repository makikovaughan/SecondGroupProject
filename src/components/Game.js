import React, { useEffect, useState } from "react";
import fetchFromSpotify, { request } from "../services/api";
import MusicFormCard from "./MusicCard";
import { getShuffledArr } from "../utils";
import { useHistory } from "react-router-dom";
import Button from "./Button";

const Game = () => {
  const AUTH_ENDPOINT =
    "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
  const TOKEN_KEY = "whos-who-access-token";
  const history = useHistory();
  const [token, setToken] = useState("");
  const parsedLocalStorage = JSON.parse(localStorage.getItem("userInput"));
  const [songs, setSongs] = useState([]);
  const [options, setOptions] = useState({
    loaded: false,
    answers: [],
  });

  const getArtist = async (t) => {
    const response = await fetchFromSpotify({
      token: t,
      endpoint: `search?q=genre%3A${parsedLocalStorage.genre}&type=artist`,
    });

    const tempArtist =
      response.artists.items[
        Math.floor(Math.random() * response.artists.items.length)
      ];

    let tempAnswer = {
      artist: tempArtist,
      correct: true,
    };
    setOptions((pre) => ({ ...pre, answers: [...pre.answers, tempAnswer] }));

    const getSongs = await fetchFromSpotify({
      token: t,
      endpoint: `artists/${tempArtist.id}/top-tracks?market=US`,
    });
    let tempSongs = getSongs.tracks.filter((track) => track.preview_url);
    let tempArr = [];

    for (let i = 0; i < parsedLocalStorage.numSongs; i++) {
      let tempSong = tempSongs[Math.floor(Math.random() * tempSongs.length)];
      while (tempArr.includes(tempSong)) {
        tempSong = tempSongs[Math.floor(Math.random() * tempSongs.length)];
      }
      tempArr.push(tempSong);
    }
    setSongs(tempArr);

    const relatedArtist = await fetchFromSpotify({
      token: t,
      endpoint: `artists/${tempArtist.id}/related-artists`,
    });

    let tempAnswers = [
      ...getShuffledArr(relatedArtist.artists).slice(
        0,
        parsedLocalStorage.numArtist - 1
      ),
    ].map((element) => ({
      artist: element,
      correct: false,
    }));

    setOptions((pre) => ({
      ...pre,
      answers: [...pre.answers, ...tempAnswers],
      loaded: true,
    }));
  };

  useEffect(() => {
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        setToken(storedToken.value);
        getArtist(storedToken.value);

        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      setToken(newToken.value);
      getArtist(newToken.value);
    });
  }, []);

  return (
    options.loaded && (
      <div>
        <Button onClick={() => history.push("/")}>Main Page</Button>
        <MusicFormCard
          options={{ ...options, answers: getShuffledArr(options.answers) }}
          songs={songs}
        />
      </div>
    )
  );
};

export default Game;
