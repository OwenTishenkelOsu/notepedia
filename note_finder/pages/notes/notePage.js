import { useEffect, useState } from "react";
import { getElasticNoteById } from "../../helpers/elastic-util";

// import router
import { useRouter } from "next/router";

export default function NotePage({ params }) {
  const [note, setNote] = useState({});
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

        fetch("http://localhost:9200/notes/_doc/" + id, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("result", result);
            setNote(result._source);
          });
      })();
    }
  }, [router]);

  useEffect(() => {
    if (note !== {}) {
      setLoading(false);
    }
  }, [note]);

  // return a pretty page with the doctype, title, text, and upload date of the note
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
              <h1>Note Title: {note.title}</h1>
              <div
                style={{
                  // add a little padding to the text
                  padding: "10px",
                }}
              >
                <p>
                  {" "}
                  <strong>File Type:</strong> {note.doctype}
                </p>
                <p>
                  {" "}
                  <strong>Upload Date:</strong> {note.upload_date}
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
            {note.text &&
              note.text.split("\n").map((item, key) => {
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
