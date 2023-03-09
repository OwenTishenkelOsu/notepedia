import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function NoteIndex() {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic ZWxhc3RpYzpwYXNzd29yZA==");
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({});

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("http://www.localhost:9200/notes/_search", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setNotes(JSON.parse(result).hits.hits);
        });
    }
  }, [router.isReady]);

  useEffect(() => {
    if (notes.length > 0) {
      setLoading(false);
    }
  }, [notes]);

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
        <div>
          {notes.map((note) => {
            return (
              // return pretty cards with the note title and a link to the note
              <div
                style={{
                  padding: "10px",
                  margin: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <button
                  style={openButtonStyle}
                  onClick={(e) => {
                    e.preventDefault();
                    // open the document in a new tab at route /notes/[note_id]
                    window.open(`/notes/notePage?id=${note._id}`);
                  }}
                >
                  <div>
                    <h2>{note._source.title}</h2>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
