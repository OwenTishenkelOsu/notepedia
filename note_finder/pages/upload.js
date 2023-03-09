import React, { useState } from "react";
import { useRouter } from "next/router";

// collect a file upload from the user's computer

function Upload() {
  const [file, setFile] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const fileUploadHandler = (e) => {
    e.preventDefault();
    console.log("fileUploadHandler called");
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

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
  }

  async function docxParser(file) {
    await sendFile(file);
    //GET request
    const output = await fetch("http://localhost:8000/get", {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((output) => {
        console.log("GET Response:", output);
        return output;
      });

    return output;
  }

  function clearFiles() {
    document.getElementById("input").value = "";
  }

  async function postNotes(textBody) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic ZWxhc3RpYzpwYXNzd29yZA==");
    // allow from localhost
    myHeaders.append("Content-Type", "application/json");

    fetch("http://localhost:9200/notes/_doc", {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
      body: textBody,
    })
      .then((response) => {
        if (response.ok) {
          alert(JSON.parse(textBody)["title"] + " Uploaded Successfully");
        } else {
          alert(JSON.parse(textBody)["title"] + " Uploaded Failed");
        }
        clearFiles();
      })
      .then((response) => console.log(JSON.stringify(response)));
  }

  const fileSubmission = (e) => {
    e.preventDefault();
    console.log(e.target.files);
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
        let name = e.target.files[i].name;
        if (name.includes(".docx")) {
          var selectedFile = e.target.files[i];
          docxParser(selectedFile).then(function (output) {
            console.log("the output is ", output);
            postNotes(output);
          });
        } else {
          const reader = new FileReader();
          setFile(e.target.files[i]);
          const selectedFile = e.target.files[i];
          reader.readAsText(selectedFile); // read the file as text
          reader.onload = (event) => {
            fileContents = event.target.result;
            postNotes(fileContents);
            // do something with the file contents, such as sending them to the server for further processing
          };
        }
      }
    }
  };

  // if submitted is true, show a page that says "File uploaded successfully: [file name]"
  // if submitted is false, show the upload form

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
      }}
    >
      {submitted ? (
        <div>
          <h1>File uploaded successfully: {file.name}</h1>
          {/* prompt the use to return to the search page or upload another file */}
          <div>
            <button
              style={{
                backgroundColor: "white",
                border: "1px solid black",
                borderRadius: "5px",
                padding: "10px",
                margin: "10px",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                router.push("/");
              }}
            >
              Return to search
            </button>
            <button
              style={{
                backgroundColor: "blue",
                border: "1px solid black",
                borderRadius: "5px",
                padding: "10px",
                margin: "10px",
                color: "white",
              }}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              Upload another file
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Upload a file</h1>
          <form
            onSubmit={fileSubmission}
            style={{
              // add some styling to the form (not copying the styles from the parent div)
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              // add some padding to the form
              padding: "20px",
              // add a border to the form
              border: "1px solid black",
              // add a border radius to the form
              borderRadius: "10px",
            }}
          >
            <input type="file" onChange={fileUploadHandler} />
            <button type="submit">Upload</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Upload;
