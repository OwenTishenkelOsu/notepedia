import { raw } from "file-loader";

var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic ZWxhc3RpYzpwYXNzd29yZA==");
// allow from localhost
myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");
myHeaders.append("Content-Type", "application/json");


// function to fetch data from ElasticSearch
export async function fetchNotes(searchTerm, fileType) {
  
  var fileTypeArray = [];

  // pull out the file types that are included
  fileType.forEach((fileType) => {
    if (fileType.included) {
      fileTypeArray.push({
        "match": {
          "doctype": fileType.fileType
        }
      })
    }
  })

  var bodyObject = {
    "query": {
        "bool": {
          "should": [
            {
                "fuzzy": {
                  "text": {
                    "value": searchTerm,
                    "fuzziness": "AUTO"
                  }
              },
            }
          ],
          "must": {
            "bool": {
              "should": fileTypeArray
            }
          }
        }
    },
    "suggest": {
      "my-suggest-1": {
          "text": searchTerm,
          "term": {
              "field": "text"
          }
      }
  }
}


  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify(bodyObject)
  };

  const response = await fetch("http://localhost:9200/notes/_search", requestOptions);
  const result = await response.json();
  return result;
}

export async function deleteNote(note_id){

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow',
  };

  var url = "http://localhost:9200/notes/_doc/" + note_id  + "?refresh=true";

  const response = await fetch(url, requestOptions);
  const result = await response.json();
  return result;
}

export async function getElasticNoteById(note_id){

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  var url = "http://localhost:9200/notes/_doc/" + note_id;

  const response = await fetch(url, requestOptions);
  const result = await response.json();
  return result;
}

export async function getAllNotes(){
  
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
  
    var url = "http://localhost:9200/notes/_search";
  
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
}