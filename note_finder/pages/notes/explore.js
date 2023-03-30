import Header from "../../components/Header";
import Link from "next/link";
import styles from "../../styles/searchPage.module.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";

function Explore() {
  const [showModal, setShowModal] = useState(false);

  // build a list of note packages
  //   FIXME: refactor to use th correct format for uploading to ElasticSearch
  const packages = [
    {
      id: 1,
      name: "Poe's 25 Greatest Works",
      description:
        "This package contains the textual basis and insights into all of famed author Edgar Allan Poe's greatest works.",
      price: 0.99,
      notes: [
        {
          id: 1,
          title: "The Raven",
          description:
            "Edgar Allan Poe's 'The Raven' (1845) is a poem centered around an unnamed narrator's journey into madness after realizing he will never forget his lost Lenore. Poe uses symbols such as a talking raven, a bust of Pallas, and the narrator's chamber to share the story while representing his narrator's struggle with grief.",
        },
        {
          id: 2,
          title: "Israfel",
          description:
            "Israfel is angel that sings and charms mortals and celestial beings alike. Poe's narrator--based on a previous poem in the Koran--sings their own song about how beautiful is the music, but then realizes the inherent differences between the world of the divines and the world of the mortals.",
        },
        {
          id: 3,
          title: "The Tell-Tale Heart",
          description:
            "'The Tell-Tale Heart' is a short story by American writer Edgar Allan Poe, first published in 1843. It is related by an unnamed narrator who endeavors to convince the reader of the narrator's sanity while simultaneously describing a murder the narrator committed.",
        },
        {
          id: 4,
          title:
            "'The Cask Of Amontillado (1846)', 'The Masque Of The Red Death' (1850), 'The Fall Of The House of Usher' (1839) and many more...",
          description:
            "Each title includes the full text in multiple languages, along with expert insight from leading professionals in a number of different fields.",
        },
      ],
    },
    {
      id: 2,
      name: "Medieval History",
      description:
        "This package contains a collection of documents that delve into the key historical moments of medieval times, offering a comprehensive understanding of the era.",
      price: 1.99,
      notes: [
        {
          id: 1,
          title: "The Battle of Hastings",
          description:
            "The Battle of Hastings (1066) was a pivotal event in medieval history, where the Normans led by William the Conqueror defeated the Anglo-Saxons led by King Harold Godwinson. This event marked the beginning of the Norman Conquest of England and significantly impacted the development of the English monarchy and society.",
        },
        {
          id: 2,
          title: "The Crusades",
          description:
            "The Crusades (1096-1291) were a series of religious wars initiated by the Christians of Europe against the Islamic world. The primary goal was to reclaim the Holy Land and Jerusalem from Muslim control. These wars had profound and lasting effects on the medieval world, shaping cultural, economic, and political developments.",
        },
        {
          id: 3,
          title: "The Black Death",
          description:
            "The Black Death (1347-1351) was a catastrophic pandemic that swept through Eurasia and North Africa, killing an estimated 75-200 million people. The plague, caused by the bacterium Yersinia pestis, drastically altered the social, economic, and religious fabric of the medieval world, leading to significant societal changes.",
        },
        {
          id: 4,
          title:
            "The Magna Carta, The Hundred Years' War, The Reconquista, and more...",
          description:
            "This package covers a wide range of key medieval events and topics, providing historical context, analysis, and insight from renowned scholars and experts in various fields. Each document is available in multiple languages to cater to a diverse audience.",
        },
      ],
    },
    {
      id: 3,
      name: "Greek Mythology",
      description:
        "This package contains a collection of documents that explore important stories and moments in Greek mythology, offering a comprehensive understanding of the ancient world's rich mythological tradition.",
      price: 0.99,
      notes: [
        {
          id: 1,
          title: "The Twelve Olympians",
          description:
            "The Twelve Olympians were the principal gods of the Greek pantheon, residing on Mount Olympus. The major gods included Zeus, Hera, Poseidon, Demeter, Athena, Apollo, Artemis, Ares, Aphrodite, Hephaestus, Hermes, and either Hestia or Dionysus. Each god and goddess had their own realm of influence, shaping the lives of mortals and the natural world.",
        },
        {
          id: 2,
          title: "The Myth of Perseus",
          description:
            "The myth of Perseus tells the story of a demigod hero who slays the Gorgon Medusa and saves Princess Andromeda from a sea monster. Perseus, the son of Zeus and mortal Danae, overcomes various challenges and obstacles with the help of divine intervention, showcasing the interplay between mortals and gods in Greek mythology.",
        },
        {
          id: 3,
          title: "The Iliad and the Odyssey",
          description:
            "The Iliad and the Odyssey are epic poems attributed to the ancient Greek poet Homer. The Iliad recounts the events of the Trojan War, focusing on the quarrel between the Greek hero Achilles and King Agamemnon. The Odyssey follows the adventures of Odysseus as he tries to return home after the Trojan War. Both epics offer insight into Greek culture, values, and beliefs through their portrayal of heroes, gods, and the natural world.",
        },
        {
          id: 4,
          title:
            "The Labors of Heracles, The Myth of Theseus, The Titanomachy, and more...",
          description:
            "This package covers a wide range of significant Greek myths and stories, providing historical context, analysis, and insight from renowned scholars and experts in various fields. Each document is available in multiple languages to cater to a diverse audience.",
        },
      ],
    },
    {
      id: 4,
      name: "CAD Modeling",
      description:
        "This package contains a collection of documents that cover key techniques and skills in CAD (Computer-Aided Design) modeling, offering a comprehensive understanding of the tools and methods required to create accurate and efficient digital designs.",
      price: 0.99,
      notes: [
        {
          id: 1,
          title: "2D Sketching and Constraints",
          description:
            "2D sketching is the foundation of CAD modeling, allowing designers to create basic shapes and profiles. This document covers essential techniques for creating accurate and precise 2D sketches, including the use of geometric constraints to define relationships between sketch elements and dimensions to control size and position.",
        },
        {
          id: 2,
          title: "3D Modeling and Extrusion",
          description:
            "3D modeling involves the creation of three-dimensional objects using CAD software. This document introduces key concepts in 3D modeling, such as extrusion, which involves extending a 2D sketch into a 3D shape, and teaches various techniques for manipulating and refining 3D models to achieve the desired result.",
        },
        {
          id: 3,
          title: "Assembly and Mates",
          description:
            "Assemblies are used to create complex designs by combining multiple parts into a single CAD model. This document explains how to create and manage assemblies, including the use of mates to define relationships between parts and to ensure proper alignment, fit, and function.",
        },
        {
          id: 4,
          title:
            "Surface Modeling, Parametric Design, Rendering and Visualization, and more...",
          description:
            "This package covers a wide range of advanced CAD modeling techniques and skills, providing practical guidance, tips, and insights from experienced professionals and experts in the field. Each document is available in multiple languages to cater to a diverse audience.",
        },
      ],
    },
    {
      id: 5,
      name: "More Coming Soon...",
      description:
        "Notepedia is constantly expanding its collection of packages. If there is a topic you would like to see, please let us know!",
      price: 0.0,
      notes: [],
    },
  ];

  // FIXME: open a preview modal
  function openPreview(packageListing) {
    console.log("open preview", packageListing);
    // setShowModal(true);
    alert(
      "The preview functionality is not yet implemented. Please check back soon!"
    );
  }

  //   FIXME: open a purchase modal
  function openPurchase(packageListing) {
    console.log("open purchase", packageListing);
    alert(
      "The purchase functionality is not yet implemented. Although I almost added Stripe to this in case you wanted to support Notepedia!"
    );
  }

  const PopupModal = ({ onClose }) => {
    return ReactDOM.createPortal(
      <div className="modal">
        <div className="modal-content">
          <button onClick={onClose}>Close</button>
          <p>Popup Modal Content</p>
        </div>
      </div>,
      document.getElementById("modal-root")
    );
  };

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
            {/* {showModal && <PopupModal onClose={() => setShowModal(false)} />} */}
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
                    {packageListing.notes.length > 0 && (
                      <div>
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
                    )}
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
