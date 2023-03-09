import { raw } from "file-loader";

// function to fetch data from ElasticSearch
export async function fetchNotes(searchString) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic ZWxhc3RpYzpwYXNzd29yZA==");
  // allow from localhost
  myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");
  myHeaders.append("Content-Type", "application/json");

  // var fileTypeArray = [];
  // console.log("fileType: ", fileType);

  // // pull out the file types that are included
  // fileType.forEach((fileType) => {
  //   if (fileType.included) {
  //     fileTypeArray.push({
  //       match: {
  //         doctype: fileType.fileType,
  //       },
  //     });
  //   }
  // });

  // var bodyObject = {
  //   query: {
  //     bool: {
  //       must: [
  //         {
  //           fuzzy: {
  //             text: {
  //               value: searchTerm,
  //               fuzziness: "AUTO",
  //             },
  //           },
  //         },
  //       ],
  //       must: {
  //         bool: {
  //           should: fileTypeArray,
  //         },
  //       },
  //     },
  //   },
  //   suggest: {
  //     "my-suggest-1": {
  //       text: searchTerm,
  //       term: {
  //         field: "text",
  //       },
  //     },
  //   },
  // };

  // // User input values
  // var searchQuery = searchString;
  // const fileType = "pdf";

  // // Build the query object
  // const query = {
  //   query: {
  //     bool: {
  //       must: [],
  //     },
  //   },
  // };

  // // Parse the search query
  // const parsedQuery = searchQuery.replace(/"([^"]+)"/g, "$1").match(/\S+/g);
  // let boolQuery;
  // if (parsedQuery.length === 1) {
  //   boolQuery = {
  //     match_phrase: {
  //       text: parsedQuery[0],
  //     },
  //   };
  // } else {
  //   boolQuery = {
  //     bool: [],
  //   };
  //   let currentBoolQuery = boolQuery.bool;
  //   for (let i = 0; i < parsedQuery.length; i++) {
  //     const term = parsedQuery[i];
  //     console.log(parsedQuery);
  //     console.log("term: ", term);
  //     switch (term.toUpperCase()) {
  //       case "AND":
  //         currentBoolQuery.must = [];
  //         currentBoolQuery = currentBoolQuery.must;
  //         break;
  //       case "OR":
  //         currentBoolQuery.should = [];
  //         currentBoolQuery = currentBoolQuery.should;
  //         break;
  //       case "NOT":
  //         currentBoolQuery.must_not = [];
  //         currentBoolQuery = currentBoolQuery.must_not;
  //         break;
  //       case "(":
  //         const subQuery = {
  //           bool: {},
  //         };
  //         let subBoolQuery = subQuery.bool;
  //         let j = i + 1;
  //         let subQueryLength = 0;
  //         while (j < parsedQuery.length) {
  //           const subTerm = parsedQuery[j];
  //           subQueryLength += subTerm.length;
  //           if (subTerm === "(") {
  //             const subSubQuery = {
  //               bool: {},
  //             };
  //             subBoolQuery.push(subSubQuery.bool);
  //             subBoolQuery = subSubQuery.bool;
  //             j++;
  //           } else if (subTerm === ")") {
  //             break;
  //           } else {
  //             subBoolQuery.push({
  //               match_phrase: {
  //                 text: subTerm,
  //               },
  //             });
  //             j++;
  //           }
  //         }
  //         i += subQueryLength + 1;
  //         currentBoolQuery.push(subQuery.bool);
  //         break;
  //       default:
  //         // console.log(typeof currentBoolQuery);
  //         // console.log(currentBoolQuery);
  //         currentBoolQuery.push({
  //           match_phrase: {
  //             text: term,
  //           },
  //         });
  //         break;
  //     }
  //   }
  // }

  // // Add the bool query to the main query object
  // query.query.bool.must.push(boolQuery);

  // // Add the file type query (if specified)
  // if (fileType) {
  //   query.query.bool.must.push({
  //     match: {
  //       doctype: fileType,
  //     },
  //   });
  // }

  // User input values
  var searchQuery = searchString;
  console.log("searchQuery: ", searchQuery);
  const fileType = "pdf";

  // parse the search query which will be a string of comma separated values in quotes ie. ""hello world", "world", "hello""
  // the spaces between the commas will be removed and the string will be split into an array
  const regex = /"[^"]+"|[^\s,]+/g;
  const parsedQueryT = searchQuery
    .match(regex)
    .map((str) => str.replace(/"/g, ""));
  console.log(parsedQueryT); // output: [ 'hello world', 'world', 'hello' ]

  // need to split out the terms in the array into two arrays, one for the terms that are to be searched for and one for the terms that are to be excluded
  // the terms that are to be excluded will be prefixed with a minus sign
  // the terms that are to be searched for will be prefixed with a plus sign and a digit 0-2 and if no prefix is present then the term will be searched for
  // digit 0-2 will be used to determine the fuzziness of the search
  const searchFor = [];
  const exclude = [];
  parsedQueryT.forEach((term) => {
    if (term.startsWith("-")) {
      exclude.push(term.replace("-", ""));
    } else {
      // parse the term to determine the fuzziness (already know it starts with a +)
      // if the term is just a + then the fuzziness will be 0
      // if the term is a + followed by a digit: then the fuzziness will be the digit

      var fuzziness = term.length > 1 ? term[1] : null;
      // if fuzziness is a letter then set it to null
      if (fuzziness >= "a" && fuzziness <= "z") {
        fuzziness = null;
      }

      console.log("fuzziness: ", fuzziness);

      if (fuzziness > 2 || fuzziness < 0 || fuzziness === null) {
        console.log("fuzziness is not valid");
        fuzziness = -1;
      }

      // pull term out of the term string and remove the + and the fuzziness digit and semicolon (if present)
      var termTemp = term.replace("+", "");

      // if first character is an integer then remove it
      if (termTemp[0] >= 0 && termTemp[0] <= 9) {
        termTemp = termTemp.substring(1);
      }

      // if first character is a semicolon then remove it
      if (termTemp[0] === ":") {
        termTemp = termTemp.substring(1);
      }

      // create the term object
      const termObj = {
        term: termTemp,
        fuzziness: fuzziness,
      };

      // add the term to the searchFor array
      searchFor.push(termObj);
    }
  });

  // console.log("searchFor: ", searchFor);
  // console.log("exclude: ", exclude);

  // Build the query object using fuzzy search
  const querytemp = {
    query: {
      bool: {
        must: [],
      },
    },
  };

  // Add the file type query (if specified)
  if (fileType) {
    querytemp.query.bool.must.push({
      match: {
        doctype: fileType,
      },
    });
  }

  // Add the search for terms
  if (searchFor.length > 0) {
    querytemp.query.bool.must.push({
      bool: {
        should: searchFor.map(({ term, fuzziness }) => ({
          match: {
            text: {
              query: term,
              // if no fuzziness is specified then the default is "AUTO"
              fuzziness: fuzziness === -1 ? "AUTO" : fuzziness,
            },
          },
        })),
      },
    });
  }

  // Add the exclude terms
  if (exclude.length > 0) {
    querytemp.query.bool.must.push({
      bool: {
        must_not: exclude.map((term) => ({
          match: {
            text: {
              query: term,
            },
          },
        })),
      },
    });
  }

  console.log(JSON.stringify(querytemp, null, 2));

  // const queryT = {
  //   query: {
  //     bool: {
  //       should: parsedQueryT.map((term) => ({
  //         match: {
  //           text: {
  //             query: term,
  //           },
  //         },
  //       })),
  //     },
  //   },
  // };

  // // console.log(JSON.stringify(queryT, null, 2));

  // // Build the query object
  // const query = {
  //   query: {
  //     bool: {
  //       must: [],
  //     },
  //   },
  // };

  // // Parse the search query
  // const parsedQuery = searchQuery
  //   .replace(/"([^"]+)"/g, "$1")
  //   .match(/("[^"]+"|\S+)/g);
  // let boolQuery;
  // if (parsedQuery.length === 1) {
  //   boolQuery = {
  //     match_phrase: {
  //       text: parsedQuery[0],
  //     },
  //   };
  // } else {
  //   boolQuery = {
  //     bool: [],
  //   };
  //   let currentBoolQuery = boolQuery.bool;
  //   for (let i = 0; i < parsedQuery.length; i++) {
  //     const term = parsedQuery[i];
  //     switch (term.toUpperCase()) {
  //       case "AND":
  //         currentBoolQuery.must = [];
  //         currentBoolQuery = currentBoolQuery.must;
  //         break;
  //       case "OR":
  //         currentBoolQuery.should = [];
  //         currentBoolQuery = currentBoolQuery.should;
  //         break;
  //       case "NOT":
  //         currentBoolQuery.must_not = [];
  //         currentBoolQuery = currentBoolQuery.must_not;
  //         break;
  //       case "(":
  //         const subQuery = {
  //           bool: {},
  //         };
  //         let subBoolQuery = subQuery.bool;
  //         let j = i + 1;
  //         let subQueryLength = 0;
  //         while (j < parsedQuery.length) {
  //           const subTerm = parsedQuery[j];
  //           subQueryLength += subTerm.length;
  //           if (subTerm === "(") {
  //             const subSubQuery = {
  //               bool: {},
  //             };
  //             subBoolQuery.push(subSubQuery.bool);
  //             subBoolQuery = subSubQuery.bool;
  //             j++;
  //           } else if (subTerm === ")") {
  //             break;
  //           } else {
  //             subBoolQuery.push({
  //               match_phrase: {
  //                 text: subTerm,
  //               },
  //             });
  //             j++;
  //           }
  //         }
  //         i += subQueryLength + 1;
  //         currentBoolQuery.push(subQuery.bool);
  //         break;
  //       default:
  //         currentBoolQuery.push({
  //           match_phrase: {
  //             text: term,
  //           },
  //         });
  //         break;
  //     }
  //   }
  // }

  // // Add the bool query to the main query object
  // query.query.bool.must.push(boolQuery);

  // // Add the file type query (if specified)
  // if (fileType) {
  //   query.query.bool.must.push({
  //     match: {
  //       doctype: fileType,
  //     },
  //   });
  // }

  // Log the final query object
  // console.log(JSON.stringify(query, null, 2));

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify(querytemp),
  };

  // console.log("requestOptions: ", requestOptions);

  const response = await fetch(
    "http://localhost:9200/notes/_search",
    requestOptions
  );
  const result = await response.json();

  return result;
}

export async function deleteNote(note_id) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic ZWxhc3RpYzpwYXNzd29yZA==");
  // allow from localhost
  myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000");
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  var url = "http://localhost:9200/notes/_doc/" + note_id + "?refresh=true";

  const response = await fetch(url, requestOptions);
  const result = await response.json();
  return result;
}

export async function getElasticNoteById(note_id) {
  // var myHeaders = new Headers();
  // myHeaders.append("Authorization", "Basic ZWxhc3RpYzpwYXNzd29yZA==");
  // // allow from localhost
  // myHeaders.append("Access-Control-Allow-Origin", "*");
  // myHeaders.append("Content-Type", "application/json");

  // make a header object from data above
  var myHeaders = {
    Authorization: "Basic ZWxhc3RpYzpwYXNzd29yZA==",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  // make a header object
  var myHeaders = new Headers(myHeaders);

  console.log("myHeaders", myHeaders);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var url = "http://localhost:9200/notes/_doc/" + note_id;

  const response = await fetch(url, requestOptions);
  const result = await response.json();
  return result;
}
