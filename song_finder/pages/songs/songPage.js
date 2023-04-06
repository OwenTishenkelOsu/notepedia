import { useEffect, useState } from "react";
import { getElasticsongById } from "../../helpers/elastic-util";

// import router
import { useRouter } from "next/router";

export default function songPage({ params }) {
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
          });
      })();
    }
  }, [router]);

  useEffect(() => {
    if (song !== {}) {
      setLoading(false);
    }
  }, [song]);

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
                <div></div>
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
