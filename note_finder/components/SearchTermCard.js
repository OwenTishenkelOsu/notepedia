// // components/SearchTermCard.js
import React from "react";
import { Slider } from "antd";
import styles from "../styles/SearchTermCard.module.css";
import { useState, useEffect } from "react";

const SearchTermCard = ({ searchTermObject, setSearchTermObject }) => {
  const [loading, setLoading] = useState(true);
  //   const [searchTerm, setSearchTerm] = useState(searchTermObject);

  useEffect(() => {
    if (searchTermObject) {
      setLoading(true);
      console.log("searchTermObject????????????: ", searchTermObject);
      setLoading(false);
    }
  }, [searchTermObject]);

  return (
    <div>
      {loading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          {searchTermObject &&
            searchTermObject.map((obj, index) => {
              return (
                <div
                  style={{
                    // add a border
                    border: "1px solid black",
                    // add a border radius
                    borderRadius: "5px",
                    // add a padding
                    padding: "10px",
                    // add a card shadow
                    boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.5)",
                    // add a padding
                    margin: "10px",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      // make items next to each other
                      display: "flex",
                      // center items
                    }}
                  >
                    {/* add a on/off toggle for the "included" value on obj */}
                    <div
                      style={{
                        // center vertically
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <h2
                        style={{
                          // add a margin
                          marginRight: "10px",
                        }}
                      >
                        Term: {obj.searchTerm}
                      </h2>
                      <div
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        <label htmlFor="exclude">
                          Looking for documents without this term?
                        </label>
                        <input
                          type="checkbox"
                          name="exclude"
                          id="exclude"
                          checked={obj.exclude}
                          onChange={(e) => {
                            setSearchTermObject([
                              ...searchTermObject.slice(0, index),
                              {
                                ...searchTermObject[index],
                                exclude: e.target.checked,
                              },
                              ...searchTermObject.slice(index + 1),
                            ]);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                  <div
                    style={{
                      // make this 80% width
                      width: "100%",
                      // add padding
                    }}
                  >
                    {obj.exclude === false && (
                      <div
                        style={{
                          // add top padding
                          padding: "10px",
                        }}
                      >
                        <h3>Edit Distance</h3>
                        <div
                          style={{
                            width: "50%",
                          }}
                        >
                          <Slider
                            marks={{
                              0: "Auto",
                              1: "0",
                              2: "1",
                              3: "2",
                            }}
                            min={0}
                            max={3}
                            step={null}
                            defaultValue={obj.editDistance}
                            onChange={(value) =>
                              setSearchTermObject([
                                ...searchTermObject.slice(0, index),
                                {
                                  ...searchTermObject[index],
                                  editDistance: value,
                                },
                                ...searchTermObject.slice(index + 1),
                              ])
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
    // <div className={styles["search-term-card"]}>
    //   <Slider
    //     marks={{
    //       0: "Auto",
    //       1: "0",
    //       2: "1",
    //       3: "2",
    //     }}
    //     min={0}
    //     max={3}
    //     step={null}
    //     defaultValue={0}
    //     onChange={(value) =>
    //       props.setSearchtermObject({
    //         ...props.searchtermObject,
    //       })
    //     }
    //   />
    // </div>
  );
};

export default SearchTermCard;
