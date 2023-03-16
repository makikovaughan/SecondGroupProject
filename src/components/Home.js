import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import fetchFromSpotify, { request } from "../services/api";
import Button from "./Button";
import Input from "./Input";
import StyledHome from "./StyledHome";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const Home = () => {
  const [genres, setGenres] = useState([]);
  const [authLoading, setAuthLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [token, setToken] = useState("");
  const [dataToLocalStorage, setDataToLocalStorage] = useState({
    numSongs: 1,
    numArtist: 2,
    genre: "",
  });
  const [error, setError] = useState(false);
  const history = useHistory();

  const checkLocalStorage = () => {
    const retrieveLocalStorage = JSON.parse(localStorage.getItem("userInput"));
    if (retrieveLocalStorage) {
      setDataToLocalStorage({
        numSongs: retrieveLocalStorage.numSongs,
        numArtist: retrieveLocalStorage.numArtist,
        genre: retrieveLocalStorage.genre,
      });
    } else {
      setDataToLocalStorage(dataToLocalStorage);
    }
  };

  const handleClick = () => {
    if (
      !dataToLocalStorage.genre ||
      !dataToLocalStorage.numArtist ||
      !dataToLocalStorage.numSongs
    ) {
      setError(true);
      return;
    }
    setError(false);
    localStorage.setItem("userInput", JSON.stringify(dataToLocalStorage));
    history.push("/game");
  };
  const loadGenres = async (t) => {
    setConfigLoading(true);
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    setGenres(response.genres);
    setConfigLoading(false);
  };

  useEffect(() => {
    checkLocalStorage();
    setAuthLoading(true);

    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        setAuthLoading(false);
        setToken(storedToken.value);
        loadGenres(storedToken.value);

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
      setAuthLoading(false);
      setToken(newToken.value);
      loadGenres(newToken.value);
      test(newToken.value);
    });
  }, []);

  if (authLoading || configLoading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledHome>
      <h1>Genre:</h1>
      <select
        value={dataToLocalStorage.genre}
        className="genre"
        name="genre"
        onChange={(event) =>
          setDataToLocalStorage({
            ...dataToLocalStorage,
            genre: event.target.value,
          })
        }
      >
        <option width="30px" value="" />
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
      <h1>Number of Songs</h1>
      <select value={dataToLocalStorage.numSongs} onChange={(event) =>
        setDataToLocalStorage({
          ...dataToLocalStorage,
          numSongs: Number(event.target.value)
        })
      }>
        <option width='30px'>1</option>
        <option width='30px'>2</option>
        <option width='30px'>3</option>
      </select>
      <h1>Number of Artists</h1>
      <select value={dataToLocalStorage.numArtist} onChange={(event) =>{
        setDataToLocalStorage({
          ...dataToLocalStorage,
          numArtist: Number(event.target.value)
        })
      }}>
        <option width='30px'>2</option>
        <option width='30px'>3</option>
        <option width='30px'>4</option>
      </select>
     
      <Button w="20%" h="4rem" mg="2rem" onClick={handleClick}>
        Play
      </Button>
      {error && <p>Please enter all the values</p>}
    </StyledHome>
  );
};

export default Home;
