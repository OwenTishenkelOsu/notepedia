import { useState, useEffect } from "react";

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
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "20px",
            }}
          >
            <div>
              <div
                style={{
                  marginBottom: "10px",
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
            {searchResults.map((result, index) => (
              <div style={cardStyle} key={index}>
                <div style={cardContentStyle}>
                  {/* stylize the output data on cards to make visually appealing */}
                  <div style={titleStyle}>
                    {" "}
                    <strong>Fragment Title:</strong> {result.title}
                  </div>
                  <div style={fileTypeStyle}>
                    <strong>File Type:</strong> {result.fileType}
                  </div>
                  <div style={fullTextStyle}>
                    <strong>Text Snippet:</strong> {result.fullText}
                  </div>
                  <div style={matchedPortionStyle}>
                    <strong>Matched Portion:</strong> {result.matchedPortion}
                  </div>
                  <div
                    style={{
                      ...matchPctStyle,
                      //   color code the match percentage based on the percentage. only red green or normal
                      color:
                        result.matchPct > 75
                          ? "green"
                          : result.matchPct < 50
                          ? "red"
                          : "black",

                      //   push to the right
                      marginLeft: "auto",
                      //   space above
                      marginTop: "10px",
                      //   border: "1px solid black",
                      // border color is  same as the color of the text
                      border:
                        result.matchPct > 75
                          ? "1px solid green"
                          : result.matchPct < 50
                          ? "1px solid red"
                          : "1px solid black",

                      borderRadius: "5px",
                      padding: "5px",
                    }}
                  >
                    <strong>Match Percentage:</strong> {result.matchPct}
                  </div>
                </div>
                <div style={buttonStyle}>
                  <button style={openButtonStyle}>Open</button>
                  <button style={downloadButtonStyle}>Download</button>
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
