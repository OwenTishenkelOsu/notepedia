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
                    display: "flex",
                    flexDirection: "column",

                    padding: "10px",
                  }}
                  key={index}
                >
                  <h1>{obj.searchTerm}</h1>
                  <div>
                    {/* add a on/off toggle for the "included" value on obj */}
                    <div
                      style={{
                        // make this a flexbox
                        display: "flex",
                        flexDirection: "row",
                        // move to the same line as the slider
                        justifyContent: "space-between",
                      }}
                    >
                      <label htmlFor="exclude">Exclude Term</label>
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
                    <div>
                      {obj.exclude === false && (
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
                      )}
                    </div>
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
