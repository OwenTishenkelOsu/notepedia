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
    }

    const uploadSubmitHandler = (e) => {
        e.preventDefault();
        setSubmitted(true);
    }

    // if submitted is true, show a page that says "File uploaded successfully: [file name]"
    // if submitted is false, show the upload form

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            backgroundColor: "#f5f5f5"

        }}>
            {submitted ? (
                <div>
                    <h1>File uploaded successfully: {file.name}</h1>
                    {/* prompt the use to return to the search page or upload another file */}
                    <div>
                        <button style={{
                            backgroundColor: "white",
                            border: "1px solid black",
                            borderRadius: "5px",
                            padding: "10px",
                            margin: "10px"

                        }} onSubmit={(e) => {
                            e.preventDefault();
                            router.push("/");
                        } } >Return to search</button>
                        <button style={{
                            backgroundColor: "blue",
                            border: "1px solid black",
                            borderRadius: "5px",
                            padding: "10px",
                            margin: "10px",
                            color: "white"
                        }} onSubmit={(e) => {
                            e.preventDefault();
                        }}>Upload another file</button>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Upload a file</h1>
                    <form onSubmit={uploadSubmitHandler} style={{
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
                    }}>
                        <input type="file" onChange={fileUploadHandler} />
                        <button type="submit">Upload</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Upload;