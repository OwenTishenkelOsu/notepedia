import { useState, useEffect } from "react";

// import router
import { useRouter } from "next/router";

// React functional component for the search page, to be used to display the search results
// take as input an array of objects, each object representing a search result
// each object will have the following properties:
//   title: the title of the document
//   fileType: the file type of the document
//   fullText: the full text of the document
//   matchedPortion: the portion of the document that matched the search term
//   matchPct: the percentage of the document that matched the search term
function ResultCards({ searchResults, setSortValue, sortValue }) {
  const [loading, setLoading] = useState(true);

  // use router to redirect to the open page
  const router = useRouter();

  useEffect(() => {
    if (searchResults !== null) {
      setLoading(false);
    }
  }, [searchResults]);

  // style for the card
  const cardStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  };

  // cardContentStyle
  const cardContentStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  };

  // style for the title
  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  // style for the file type.
  const fileTypeStyle = {
    fontSize: "16px",
    marginBottom: "10px",
  };

  // style for the full text
  const fullTextStyle = {
    fontSize: "16px",
    marginBottom: "10px",
  };

  // style for the matched portion. highlight the matched portion in yellow
  const matchedPortionStyle = {
    fontSize: "16px",
    marginBottom: "10px",
  };

  // style for the match percentage. push to the right and display in red
  const matchPctStyle = {
    fontSize: "16px",
    marginBottom: "10px",
  };

  // style for the buttons (open and download) push to the right
  const buttonStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  };

  // style for the open button
  const openButtonStyle = {
    backgroundColor: "white",
    border: "1px solid #0070f3",
    borderRadius: "5px",
    color: "#0070f3",
    padding: "10px",
    marginRight: "10px",
  };

  // style for the download button
  const downloadButtonStyle = {
    backgroundColor: "#0070f3",
    border: "1px solid #0070f3",
    borderRadius: "5px",
    color: "white",
    padding: "10px",
  };

  // style for the pdf, ppt, doc preview
  const previewStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  };

  async function openDocumentHandler(document_id) {
    // the route is note/[note_id]
    // the note_id is the document_id
    // open a new tab when the user clicks on the open button
    router.push({
      pathname: "/note/[note_id]",
      query: { note_id: document_id },
    });
  }

  // return loading if the search results are still loading
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {/* create a dropdown that will sort results based on one of the following: match percentage, alphabetical. Also create a filter results area that can filter out certain file types in the response, or matches below a certain percentage */}
          <div
            style={{
              // move the dropdown to the right of the page
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              // add bottom margin
              marginBottom: "20px",
            }}
          >
            <div>
              <div
                style={{
                  marginBottom: "5px",
                }}
              >
                Sort by:
              </div>
              {/* on select of dropdown, call function */}
              <select
                value={sortValue}
                onChange={(e) => {
                  e.preventDefault();
                  setSortValue(e.target.value);
                }}
                style={{
                  width: "100%",
                  height: "30px",
                  borderRadius: "5px",
                  border: "1px solid #0070f3",
                  padding: "5px",
                }}
              >
                <option value="matchPct">Match Percentage (High - Low)</option>
                <option value="matchPctInverted">
                  Match Percentage (Low - High)
                </option>
                <option value="alphabetical">Alphabetical (A - Z)</option>
                <option value="alphabeticalInverted">
                  Alphabetical (Z - A)
                </option>
              </select>
            </div>
          </div>

          <div>
            {searchResults.map((result) => (
              <div style={cardStyle} key={result._id}>
                <div style={cardContentStyle}>
                  {/* stylize the output data on cards to make visually appealing */}
                  <div style={titleStyle}>
                    {" "}
                    <strong>Fragment Title:</strong> {result._source.title}
                  </div>
                  <div style={fileTypeStyle}>
                    <strong>File Type:</strong> {result._source.doctype}
                  </div>
                  <div style={fullTextStyle}>
                    {/* cut text snippet off at 500 characters */}
                    <strong>Full Text:</strong>{" "}
                    {result._source.text?.substring(0, Math.min(result._source.text.length, 500)) + "..."}
                  </div>
                  <div
                    style={{
                      //   push to the right
                      marginLeft: "auto",
                      //   space above
                      marginTop: "10px",
                      borderRadius: "5px",
                      padding: "5px",
                    }}
                  >
                    <strong>Match Score:</strong> {result._score}
                  </div>
                </div>
                <div style={buttonStyle}>
                  <button
                    style={openButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      // open the document in a new tab at route /notes/[note_id]
                      window.open(`/notes/notePage?id=${result._id}`);
                    }}
                  >
                    Open in Preview
                  </button>
                  <button
                    style={downloadButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(result._source);
                      var data = result._source;
                      var filename = result._source.title;
                      // Creating a blob object from non-blob data using the Blob constructor
                      const blob = new Blob([JSON.stringify(data)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      // Create a new anchor element
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = filename || "download";
                      a.click();
                      a.remove();
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ResultCards;
