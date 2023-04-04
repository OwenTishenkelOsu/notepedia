import { useEffect, useState } from "react";
import { Form, Input, Select, Button, Slider } from "antd";
import { useRouter } from "next/router";
const { Option } = Select;
import styles from "../styles/searchPage.module.css";
import ResultCards from "../components/ResultCards";
import SearchTermCard from "../components/SearchTermCard";
import Header from "../components/Header";
import Link from "next/link";

const SearchPage = () => {
  const [file, setFile] = useState(null);

  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [sortValue, setSortValue] = useState("matchPct");
  const [searchSuggestions, setSearchSuggestions] = useState(null);
  const [updatingSuggestions, setUpdatingSuggestions] = useState(false);
  const [updatingFileType, setUpdatingFileType] = useState(false);

  const [searchTermObject, setSearchTermObject] = useState({
    searchTerm: "",
    editDistance: "AUTO",
    exclude: false,
  });

  // const fileUploadHandler = (e) => {
  //     e.preventDefault();
  //     if (e.target.files.length != 0) {
  //         console.log("fileUploadHandler called");
  //         console.log(e.target.files[0]);
  //         //Parse file to get extension

  //         setFile(e.target.files[0]);
  //         console.log(e.target.files.length);
  //         var fileContents;
  //         const reader = new FileReader();
  //         for (var i = 0; i < e.target.files.length; i++) {
  //             //Check if file is .docx
  //             let name = e.target.files[i].name
  //             if (name.includes(".docx")) {
  //                 var selectedFile = e.target.files[i];
  //                 docxParser(selectedFile)
  //                     .then(function (output) {
  //                         console.log("the output is ", output);
  //                         postNotes(output);
  //                     });
  //             } else {
  //                 const reader = new FileReader();
  //                 setFile(e.target.files[i]);
  //                 const selectedFile = e.target.files[i];
  //                 reader.readAsText(selectedFile); // read the file as text
  //                 reader.onload = (event) => {
  //                     fileContents = event.target.result;
  //                     postNotes(fileContents);
  //                     // do something with the file contents, such as sending them to the server for further processing
  //                 }
  //             }
  //         }

  //     }
  // }

  //TODO: WANT TO CHANGE FILETYPE TO EITHER GENRE OR ARTIST
  const baseFileTypes = [
    { fileType: "pdf", included: true },
    { fileType: "docx", included: true },
    { fileType: "txt", included: true },
    { fileType: "ppt", included: true },
    { fileType: "xls", included: true },
  ];
  useEffect(() => {
    if (searchTermObject.searchTerm != "") {
      reconstructSearchTerm();
    }
  }, [searchTermObject]);

  function reconstructSearchTerm() {
    let newSearchTerm = "";
    searchTermObject.forEach((term) => {
      if (term.exclude == true) {
        newSearchTerm += "-" + term.searchTerm + ", ";
      } else {
        if (term.editDistance == "AUTO") {
          newSearchTerm += term.searchTerm + ", ";
        } else {
          console.log("term.editDistance: ", term.editDistance);
          let dist = term.editDistance;
          if (term.editDistance !== 0) {
            dist = dist - 1;
            newSearchTerm += "+" + dist + term.searchTerm + ", ";
          } else {
            newSearchTerm += term.searchTerm + ", ";
          }
        }
      }
    });

    // remove the last comma and space
    newSearchTerm = newSearchTerm.slice(0, -2);

    console.log("newSearchTerm: ", newSearchTerm);

    callSearchApi(newSearchTerm);
  }

  const handleSearch = () => {
    setLoading(true);
    if (firstSearch) {
      setFirstSearch(false);
    }

    // need to decompose the search term into individual words
    const searchTerms = searchTerm.split(",");
    // strip whitespace from each search term
    
      const cleanSearchTerms = searchTerms.map((term) => term.trim());
    
    // make a new array of objects with the search term and edit distance
    // then set the state of searchTermObject to this new array
    const newSearchTermObject = cleanSearchTerms.map((term) => {
      return {
        searchTerm: term,
        editDistance: "AUTO",
        exclude: false,
      };
    });
    setSearchTermObject(newSearchTermObject);
  };

  function callSearchApi(searchTerm) {
    // make a fetch request to the API
    fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchString: searchTerm,
        fileType: fileType,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          data.suggest &&
          data.suggest["my-suggest-1"] &&
          data.suggest["my-suggest-1"][0]
        ) {
          setSearchSuggestions(data.suggest["my-suggest-1"][0].options);
        } else {
          setSearchSuggestions([]);
        }
        if (data.hits != null && data.hits.hits.length > 0) {
          console.log(typeof data.hits.hits);
          const unclean = data.hits.hits;
          const clean = unclean.filter((hit) => hit._score > 1);
          setSearchResults(clean);
        } else {
          setSearchResults([]);
        }
      });
  }

  const resetSearchHandler = (e) => {
    e.preventDefault();
    setSearchTerm("");
    setFileType([]);
    setFirstSearch(true);
  };

  useEffect(() => {
    if (updatingSuggestions) {
      handleSearch();
      setUpdatingSuggestions(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (fileType && fileType.length > 0 && !firstSearch) {
      handleSearch();
    }
  }, [fileType]);

  useEffect(() => {
    if (firstSearch) {
      setSortValue("matchPct");
    }

    if (searchResults && searchSuggestions) {
      console.log("searchSuggestions: ", searchSuggestions);
      setLoading(false);
    }
  }, [searchResults]);

  return (
    <div className={styles["search-page"]}>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          // make them centered
          margin: "auto",
          // make the items stacked
          flexDirection: "column",
        }}
      >
        <div
          style={{
            // make the items next to each other
            display: "flex",

            // add padding
            padding: "20px",

            // make the items centered
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              // push the title to the left
              marginRight: "20px",
            }}
          >
            How it works
          </h2>
          <p>
            Enter comma seperated song terms (or phrases) to query your
            knowledge base for the most related songs. After submitting
            your terms of interest, you will be able to apply more advanced
            search parameters. Try it out!{" "}
          </p>
        </div>
      </div>
      <br />
      <Form
        layout="horizontal"
        style={{
          // make the items next to each other
          display: "flex",

          // add padding
          padding: "10px",
          // add spacing between the items
          gap: "10px",
        }}
      >
        <Form.Item
          style={{
            // make this not take up the whole width
            width: "70%",
          }}
        >
          <Input
            required={true}
            placeholder="Search terms"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          style={{
            // make this have minimum width
            minWidth: "100px",
          }}
        >
          
        </Form.Item>
        {/* FIXME: suggestions */}
        {/* {searchSuggestions && searchSuggestions.length > 0 && (
          <div>
            <p>Try instead: </p>
            {searchSuggestions.map((suggestion, index) => (
              <div
                key={index}
                style={{
                  // make these appear on the same line
                  display: "inline-block",
                  marginRight: "10px",
                  // add a little space between the suggestions
                  marginBottom: "10px",
                }}
              >
                <Button
                  onClick={() => {
                    setUpdatingSuggestions(true);
                    setSearchTerm(suggestion.text);
                  }}
                  style={{
                    // make the buttons appear like links
                    padding: 0,
                    border: "none",
                    background: "none",
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {suggestion.text}
                </Button>
              </div>
            ))}
          </div>
        )} */}
        <div
          style={{
            // make these appear on the same line
            display: "flex",
            alignItems: "center",
          }}
        >
          <Form.Item
            style={{
              // add padding to the right of the search button
              marginRight: "10px",
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                if (searchTerm !== "") {
                  handleSearch();
                } else {
                  alert("Please enter a search term.");
                }
              }}
            >
              Search
            </Button>
            {/* <input
              type="file"
              onChange={fileUploadHandler}
              id="input"
              multiple
            /> */}
          </Form.Item>
          {/* reset filters button if not on first search */}
          {!firstSearch && (
            <Form.Item>
              <Button
                onClick={(e) => {
                  resetSearchHandler(e);
                }}
              >
                Reset Search
              </Button>
            </Form.Item>
          )}
        </div>
        <div>
          {/* results count if not on first search */}
          {!firstSearch && (
            <p>
              {searchResults.length} results found for "{searchTerm}".
            </p>
          )}
        </div>
      </Form>
      {firstSearch ? (
        <p>Enter search terms or phrases to begin searching.</p>
      ) : (
        <div className="styles.search-results">
          <div className={styles["search-term-cards"]}>
            {/* {searchTermObject.map((object, index) => (
              <SearchTermCard
                key={index}
                termObject={object}
                setSearchTermObject={setSearchTermObject}
              />
            ))} */}
            <SearchTermCard
              searchTermObject={searchTermObject}
              setSearchTermObject={setSearchTermObject}
            />
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              <ResultCards
                searchResults={searchResults}
                setSortValue={setSortValue}
                sortValue={sortValue}
                setSearchResults={setSearchResults}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
