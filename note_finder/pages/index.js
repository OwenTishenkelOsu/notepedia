import { useEffect, useState } from "react";
import { Form, Input, Select, Button } from "antd";
import { useRouter } from "next/router";
const { Option } = Select;
import styles from "../styles/searchPage.module.css";
import ResultCards from "../components/ResultCards";
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

  //

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

  const baseFileTypes = [
    { fileType: "pdf", included: true },
    { fileType: "docx", included: true },
    { fileType: "txt", included: true },
    { fileType: "ppt", included: true },
    { fileType: "xls", included: true },
  ];

  const handleSearch = () => {
    setLoading(true);
    if (firstSearch) {
      setFirstSearch(false);
    }
    // // create loading state and show loading indicator for a short time to simulate a search
    // setTimeout(() => {
    //   // remove loading state and show search results
    //   if (firstSearch) {
    //     setFirstSearch(false);
    //     setSortValue("matchPct");
    //   }
    //   setLoading(false);
    // }, 2000);

    // make a fetch request to the API
    fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchString: searchTerm,
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
  };

  const resetSearchHandler = (e) => {
    e.preventDefault();
    setSearchTerm("");
    setFileType(baseFileTypes);
    setFirstSearch(true);
  };

  useEffect(() => {
    if (updatingSuggestions) {
      handleSearch();
      setUpdatingSuggestions(false);
    }
  }, [searchTerm]);

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
      <h1>Search</h1>

      <br></br>
      <Form layout="horizontal">
        <Form.Item>
          <Input
            required={true}
            placeholder="Search terms"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Select
            mode="multiple"
            placeholder="File type"
            // value is where the "included" property of the fileType object is true
            value={fileType
              .filter((fileType) => fileType.included)
              .map((fileType) => fileType.fileType)}
            onChange={(value) => {
              console.log("value: ", value);
              console.log("fileType: ", fileType);
              var tempFileType = baseFileTypes;
              tempFileType.forEach((fileType) => {
                if (value.includes(fileType.fileType)) {
                  fileType.included = true;
                } else {
                  fileType.included = false;
                }
              });
              console.log("tempFileType: ", tempFileType);
              setFileType(tempFileType);
            }}
          >
            <Option value="pdf">PDF</Option>
            <Option value="docx">DOCX</Option>
            <Option value="ppt">PPT</Option>
            <Option value="xls">XLS</Option>
            <Option value="txt">TXT</Option>
          </Select>
        </Form.Item>
        {searchSuggestions && searchSuggestions.length > 0 && (
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
        )}
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
        <p>Enter a search term and file type to begin searching.</p>
      ) : (
        <div className="styles.search-results">
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
