import Header from "../../components/Header";
import Link from "next/link";
import styles from "../../styles/searchPage.module.css";

function Explore() {
  // build a list of note packages
  //   FIXME: refactor to use th correct format for uploading to ElasticSearch
  const packages = [
    {
      id: 1,
      name: "Package 1",
      description: "This is a description of package 1",
      price: 0.99,
      notes: [
        {
          id: 1,
          title: "Note 1",
          description: "This is a description of note 1",
        },
        {
          id: 2,
          title: "Note 2",
          description: "This is a description of note 2",
        },
      ],
    },
    {
      id: 2,
      name: "Package 2",
      description: "This is a description of package 2",
      price: 1.99,
      notes: [
        {
          id: 3,
          title: "Note 3",
          description: "This is a description of note 3",
        },
        {
          id: 4,
          title: "Note 4",
          description: "This is a description of note 4",
        },
      ],
    },
  ];

  // FIXME: open a preview modal
  function openPreview(packageListing) {
    console.log("open preview", packageListing);
  }

  //   FIXME: open a purchase modal
  function openPurchase(packageListing) {
    console.log("open purchase", packageListing);
  }

  // add the style in at each div as needed
  return (
    <div className={styles["search-page"]}>
      <Header />
      <div>
        <div>
          <div
            style={{
              //   align on the left
              textAlign: "left",
              //   add padding to top and bottom
              padding: "1rem 1rem",
            }}
          >
            <h1>Data Package Store</h1>
            <p>
              Explore and preview data packages that are available for download.
              These documents are sourced from only the most reknowned
              institutions.
            </p>
          </div>

          <div>
            {packages.map((packageListing) => (
              <div
                key={packageListing.id}
                style={{
                  // add padding to top and bottom
                  padding: "1rem 1rem",
                  // add a border
                  border: "1px solid #ccc",
                  // add a border radius
                  borderRadius: "4px",
                  // add a background color
                  backgroundColor: "#fff",
                  // add a box shadow
                  boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
                  // add a margin
                  margin: "1rem 0",
                }}
              >
                <div>
                  <h2>{packageListing.name}</h2>
                  <p>{packageListing.description}</p>
                </div>
                <div
                  style={{
                    // add a padding
                    padding: "1rem 1rem",
                  }}
                >
                  {packageListing.notes.map((note) => (
                    <div key={note.id}>
                      <h3>{note.title}</h3>
                      <p>{note.description}</p>
                      <br />
                    </div>
                  ))}
                  <div
                    style={{
                      // make the buttons inline
                      display: "flex",
                      // align the buttons to the right
                      justifyContent: "flex-end",
                    }}
                  >
                    <p
                      style={{
                        // make the price above the buttons
                        marginBottom: "0",
                        // add a margin to the right of the price
                        marginRight: "1rem",
                      }}
                    >
                      Price: ${packageListing.price}
                    </p>
                  </div>
                  <div
                    style={{
                      // make the buttons inline
                      display: "flex",
                      // align the buttons to the right
                      justifyContent: "flex-end",

                      // add a margin to the top of the buttons
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      style={{
                        // add a margin to the right of the buttons
                        marginRight: "1rem",

                        // make it look like a button
                        backgroundColor: "#0070f3",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        openPreview(packageListing);
                      }}
                    >
                      Preview
                    </button>
                    <button
                      style={{
                        // add a margin to the right of the buttons
                        marginRight: "1rem",

                        // make it look like a button
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        openPurchase(packageListing);
                      }}
                    >
                      Purchase
                    </button>
                  </div>
                </div>

                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
