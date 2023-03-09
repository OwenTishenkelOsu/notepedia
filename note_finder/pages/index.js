import { useEffect, useState } from "react";
import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

import styles from "../styles/searchPage.module.css";
import ResultCards from "../components/ResultCards";

// import next link
import Link from "next/link";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [sortValue, setSortValue] = useState("matchPct");
  const [searchSuggestions, setSearchSuggestions] = useState(null);
  const [updatingSuggestions, setUpdatingSuggestions] = useState(false);

  // useEffect(() => {
  //   console.log(`Sort value changed to ${sortValue}`);
  //   let temp = [...searchData];
  //   // if search term is neuroscience, neuro, neuron, etc, include the neuroExamples
  //   if (searchTerm.toLowerCase().includes("neur")) {
  //     temp = [...temp, ...neuroExamples];
  //   }

  //   // if search term is computer science, comp sci, etc, include the compScienceExamples
  //   if (
  //     searchTerm.toLowerCase().includes("comp") ||
  //     searchTerm.toLowerCase().includes("sci")
  //   ) {
  //     temp = [...temp, ...compScienceExamples];
  //   }

  //   if (sortValue === "matchPct") {
  //     temp.sort((a, b) => b.matchPct - a.matchPct);
  //   } else if (sortValue === "matchPctInverted") {
  //     temp.sort((a, b) => a.matchPct - b.matchPct);
  //   } else if (sortValue === "alphabetical") {
  //     temp.sort((a, b) => {
  //       if (a.title < b.title) {
  //         return -1;
  //       }
  //       if (a.title > b.title) {
  //         return 1;
  //       }
  //       return 0;
  //     });
  //   } else if (sortValue === "alphabeticalInverted") {
  //     temp.sort((a, b) => {
  //       if (a.title < b.title) {
  //         return 1;
  //       }
  //       if (a.title > b.title) {
  //         return -1;
  //       }
  //       return 0;
  //     });
  //   }
  //   setSearchResults(temp);
  // }, [sortValue]);

  const baseFileTypes = [
    { fileType: "pdf", included: true },
    { fileType: "doc", included: true },
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
        if (data.hits.hits.length > 0) {
          setSearchResults(data.hits.hits);
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
            <Option value="doc">DOC</Option>
            <Option value="ppt">PPT</Option>
            <Option value="xls">XLS</Option>
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
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
