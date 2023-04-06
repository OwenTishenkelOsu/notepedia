import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../../components/Header";
import styles from "../../styles/searchPage.module.css";

export default function songIndex() {
  const [loading, setLoading] = useState(false);
  const [songs, setsongs] = useState([]); 
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic ZWxhc3RpYzpwYXNzd29yZA==");
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        size: "1000",
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: raw,
      };
      
      fetch("http://www.localhost:9200/songs/_search", requestOptions)
        .then((response) => response.text()) 
        .then((result) => {
          setsongs(JSON.parse(result).hits.hits);
        });
    }
  }, [router.isReady]);

  useEffect(() => {
    if (songs.length > 0) {
      console.log(songs);
      setLoading(false);
    }
  }, [songs]);

  // style for the open button
  const openButtonStyle = {
    backgroundColor: "white",
    border: "1px solid #0070f3",
    borderRadius: "5px",
    color: "#0070f3",
    padding: "10px",
    marginRight: "10px",
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles["search-page"]}>
          <Header />
          <div>
            <h1>Songs</h1>
            <p>
              Here you can view all of your songs. You search for all your songs
              by clicking{" "}
              <Link
                href="/"
                style={{
                  // make it look like a link in text
                  color: "#0070f3",
                  textDecoration: "underline",
                }}
              >
                here
              </Link>
            </p>
          </div>
          <div>
            {songs.map((song, index) => {
              return (
                // FIXME: make this component not look stupid
                <div
                  key={index}
                  style={{
                    padding: "5px",
                    margin: "5px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      // make this look like a card with background shadow
                      backgroundColor: "white",
                      borderRadius: "5px",
                      boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                      padding: "10px",
                    }}
                  >
                    {/* display the title, first 150 characters of the text, and the source (if present, if not source is "personal" */}
                    <div
                      style={{
                        // make it only half the width of the card
                        width: "75%",
                        // add spacing between the div elements
                        marginBottom: "10px",
                      }}
                    >
                      <h4>
                        <strong
                          style={{
                            // make the title larger
                            fontSize: "1.2rem",
                          }}
                        >
                          Title:{" "}
                        </strong>
                        {song._source.title}
                      </h4>
                      <p>
                        {" "}
                        <strong
                          style={{
                            // make the title larger
                            fontSize: "1rem",
                          }}
                        >
                          Artist:{" "}
                        </strong>
                        {song._source.artist}
                      </p>
                      <p>
                        {" "}
                        <strong
                          style={{
                            // make the title larger
                            fontSize: "1rem",
                          }}
                        >
                          Matched Lyrics:{" "}
                        </strong>
                        {song._source.lyrics?.substring(0, 250) + "..."}
                      </p>
                      
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Link
                        href={`/songs/songPage?id=${song._id}`}
                        style={{
                          // make it look like a button
                          backgroundColor: "white",
                          border: "1px solid #0070f3",
                          borderRadius: "5px",
                          color: "#0070f3",
                          padding: "10px",
                          marginRight: "10px",
                          // push the button to the right
                          marginLeft: "auto",
                        }}
                      >
                        {"Open song"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
