import { useEffect, useState } from "react";
import { getElasticsongById } from "../../helpers/elastic-util";
import SpotifyPlayer from "../../components/SpotifyEmbed";

// import router
import { useRouter } from "next/router";

export default function songPage() {
  const [accessToken, setAccessToken] = useState(null);
  const [trackId, setTrackId] = useState(null);
  const [songSearchObj, setSongSearchObj] = useState({
    title: "",
    artist: "",
  });
  const [song, setsong] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      console.log("router", router);
      const { id } = router.query;
      console.log("id", id);
      (async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic ZWxhc3RpYzpwYXNzd29yZA==");

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch("http://localhost:9200/songs/_doc/" + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("result", result);
            setsong(result._source);
            setSongSearchObj({
              title: result._source.title,
              artist: result._source.artist,
          });
          })
      })();
    }
  }, [router]);

  useEffect(() => {
    (async () => {
      const accessTokenObj = await getAccessToken().then((data) => {
        if (data !== undefined && data !== null)
          setAccessToken(data.access_token);
      });
    })();
  }, []);

  useEffect(() => {
    if (accessToken !== undefined && accessToken !== null) {
      (async () => {
        const trackId = await getTrackIdByTitleAndArtist(
          accessToken,
          songSearchObj.title,
          songSearchObj.artist
        );
          if (trackId !== null){
            setTrackId(trackId);
          } else {
            setLoading(false);
          }
      })();
    }
  }, [accessToken, songSearchObj]);

  useEffect(() => {
    if (trackId !== undefined && trackId !== null) {
      setLoading(false);
    }
  }, [trackId]);

  async function getAccessToken() {
    const res = fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "4044b8fd17944a5d87e6acdc4ebd2a48",
        client_secret: "6ae39170d790483da1dd01b8b04f8f69",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => console.error(error));

    return res;
  }

  async function getTrackIdByTitleAndArtist(accessToken, title, artist) {

    // help me build the query
    const query = `artist:${encodeURIComponent(
      artist
    )} track:${encodeURIComponent(title)}`;

    // build the url
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });


    const data = await response.json();
    const tracks = data.tracks.items;
    console.log("tracks", tracks);

    if (tracks.length > 0) {
      return tracks[0].id;
    } else {
      return null;
    }
  }


  // return a pretty page with the doctype, title, text, and upload date of the song
  return (
    <div>
      {loading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",

              // make this a card
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <h1>Song Title: {song.title}</h1>
              <div
                style={{
                  // add a little padding to the text
                  padding: "10px",
                }}
              >
                <p>
                  {" "}
                  <strong>Artist:</strong> {song.artist}
                </p>
                <p>
                  {" "}
                  <strong>Lyrics:</strong> {song.lyrics}
                </p>
                
              </div>
              < br />
              <div>
                {/* if the trackId is not null, then display spotify player. otherwise, display a message */}
                  {trackId !== null ? (
                    <SpotifyPlayer trackId={trackId} />
                  ) : (
                    <p>No Spotify Preview Available</p>
                  )}
                </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",

              // add padding to the text
              padding: "20px",
            }}
          >
            {song.text &&
              song.text.split("\n").map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
