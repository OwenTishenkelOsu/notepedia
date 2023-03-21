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

    async function sendFile(file) {
        var formData = new FormData();
        formData.append("file", file);

        var xhr = new XMLHttpRequest();
        //send a POST request to the python server
        xhr.open("POST", "http://localhost:8000/send", true);
        xhr.withCredentials = true;
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            }
        };
        xhr.send(formData);
        return xhr.response;

    }

    async function docxParser(file) {
        await sendFile(file);
        //GET request
        const output = await fetch("http://localhost:8000/get", {
            credentials: 'include'
        })
            .then((response) => response.text())
            .then((output) => {
                console.log('GET Response:', output);
                if (output == "success") {
                    alert(file["name"] + " Uploaded Successfully");
                } else {
                    alert(file["name"] + " Uploaded Failed");
                }
            });

        return output;
    }


  function clearFiles(){
    document.getElementById("input").value = "";
  }
  async function postNotes(textBody) {

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic ZWxhc3RpYzpwYXNzd29yZA==");
    // allow from localhost
    myHeaders.append("Content-Type", "application/json");
    
    fetch(
      "http://localhost:9200/notes/_doc",{
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
        body: textBody},
  ).then(response => {if(response.ok){alert(JSON.parse(textBody)["title"] + " Uploaded Successfully");}else{
    alert(JSON.parse(textBody)["title"] + " Uploaded Failed");
  }
  clearFiles();})
  .then(response => console.log(JSON.stringify(response))
    );
  }

const fileUploadHandler = (e) => {
    e.preventDefault();
    if (e.target.files.length != 0) {
        console.log("fileUploadHandler called");
        console.log(e.target.files[0]);
        //Parse file to get extension

        setFile(e.target.files[0]);
        console.log(e.target.files.length);
        var fileContents;
        const reader = new FileReader();
        for (var i = 0; i < e.target.files.length; i++) {
            //Check if file is .docx
            let name = e.target.files[i].name
            if (name.includes(".docx")) {
                var selectedFile = e.target.files[i];
                docxParser(selectedFile);
                    //.then(function (output) {
                        //console.log("the output is ", output);
                        //postNotes(output);
                    //});
            } else {
                setFile(e.target.files[i]);
                const selectedFile = e.target.files[i];
                reader.readAsText(selectedFile); // read the file as text
                reader.onload = (event) => {
                    fileContents = event.target.result;
                    postNotes(fileContents);
                    // do something with the file contents, such as sending them to the server for further processing
                }
            }
        }

    }
}

  const baseFileTypes= [
    { "fileType": "pdf", "included": true },
    { "fileType": "doc", "included": true },
    { "fileType": "ppt", "included": true },
    { "fileType": "xls", "included": true },
  ]

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
        searchTerm: searchTerm,
        fileType: fileType,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.suggest["my-suggest-1"][0]){
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
    if (updatingSuggestions){
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
            value={fileType.filter((fileType) => fileType.included).map((fileType) => fileType.fileType)}
            onChange={
              (value) => {
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
                <div key={index} style={{
                  // make these appear on the same line
                  display: "inline-block",
                  marginRight: "10px",
                  // add a little space between the suggestions
                  marginBottom: "10px",
                }}>
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
        <div style={{
          // make these appear on the same line
          display: "flex",
          alignItems: "center",
        }}>
          <Form.Item style={{
            // add padding to the right of the search button
            marginRight: "10px",
          }}>
            <Button type="primary" onClick={() => {
              if (searchTerm !== "") {
                handleSearch();
              } else {
                alert("Please enter a search term.");
              }
            }}>
              Search
            </Button>
            <input type="file" onChange = {fileUploadHandler}id="input" multiple />
            
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
