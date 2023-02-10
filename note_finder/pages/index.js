import { useEffect, useState } from "react";
import { Form, Input, Select, Button } from "antd";




const { Option } = Select;
const https = require('https');
import styles from "../styles/searchPage.module.css";
import ResultCards from "../components/ResultCards";

import { neuroExamples, compScienceExamples, searchData } from "../examples";


var xhr = null;
getXmlHttpRequestObject = function () {
    if (!xhr) {
        //create a new XMLHttpRequest object
        xhr = new XMLHttpRequest();
    }
    return xhr;
};

function dataCallback() {
    // Check response is ready or not
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log("User data received!");
        getDate();
        dataDiv = document.getElementById('result-container');
        // Set current data text
        dataDiv.innerHTML = xhr.responseText;
    }
}
function getSearch() {
    console.log("retrieve file")
    xhr = getXmlHttpRequestObject();
    xhr.onreadystatechange = dataCallback;
    // asynchronous requests
    xhr.open("GET", "http://localhost:6969/search", true);
    // Send the request over the network
    xhr.send(null);
}

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [sortValue, setSortValue] = useState("matchPct");

  useEffect(() => {
    console.log(`Sort value changed to ${sortValue}`);
    let temp = [...searchData];
    // if search term is neuroscience, neuro, neuron, etc, include the neuroExamples
    if (searchTerm.toLowerCase().includes("neur")) {
      temp = [...temp, ...neuroExamples];
    }

    // if search term is computer science, comp sci, etc, include the compScienceExamples
    if (
      searchTerm.toLowerCase().includes("comp") ||
      searchTerm.toLowerCase().includes("sci")
    ) {
      temp = [...temp, ...compScienceExamples];
    }

    if (sortValue === "matchPct") {
      temp.sort((a, b) => b.matchPct - a.matchPct);
    } else if (sortValue === "matchPctInverted") {
      temp.sort((a, b) => a.matchPct - b.matchPct);
    } else if (sortValue === "alphabetical") {
      temp.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
    } else if (sortValue === "alphabeticalInverted") {
      temp.sort((a, b) => {
        if (a.title < b.title) {
          return 1;
        }
        if (a.title > b.title) {
          return -1;
        }
        return 0;
      });
    }
    setSearchResults(temp);
  }, [sortValue]);

    const options = {
            
            rejectUnauthorized: false,

            keepAlive: true,
        };
        // we're creating a new Agent that will now use the certs we have configured
    const sslConfiguredAgent = new https.Agent(options);
    // write a function to call an Api to get search results
    // write a function to call an Api to get search results
    const getSearchResults = async () => {
        const response = await fetch('http://localhost:9200/notes/_doc/1', {
            agent: sslConfiguredAgent,
            mode: 'no-cors',
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic ZWxhc3RpYzplNVhKUG1ZRmtVT09tdDl4aUkrKg=="
            },
        });
        const string = await response.text();
        const data  = string === "" ? {} : JSON.parse(string);
        console.log(data);
    };


    const handleSearch = () => {
        setLoading(true);
        console.log(`Searching for ${searchTerm} of type ${fileType}`);
        getSearchResults();
        // create loading state and show loading indicator for a short time to simulate a search
        setTimeout(() => {
            // remove loading state and show search results
            if (firstSearch) {
                setFirstSearch(false);
                setSortValue("matchPct");
            }
            setLoading(false);
        }, 2000);
    };

  const resetSearchHandler = (e) => {
    e.preventDefault();
    setSearchTerm("");
    setFileType([]);
    setFirstSearch(true);
  };

  // useEffect(() => {
  //   if (searchResults.length > 0) {
  //     setLoading(false);
  //   }
  // }, [searchResults]);

  return (
    <div className={styles["search-page"]}>
      <h1>Search</h1>
      {console.log()}
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
            value={fileType}
            onChange={(value) => setFileType(value)}
          >
            <Option value="pdf">PDF</Option>
            <Option value="doc">DOC</Option>
            <Option value="ppt">PPT</Option>
            <Option value="xls">XLS</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        </Form.Item>
        {/* reset filters button */}
        <Form.Item>
          <Button
            onClick={(e) => {
              resetSearchHandler(e);
            }}
          >
            Reset Search
          </Button>
        </Form.Item>
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
