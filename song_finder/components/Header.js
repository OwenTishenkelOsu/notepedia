// This will be the header for the app, which is a navbar
//  there will be a link to the home page, and a link to the explore data packages page, and a link to the all songs page

// use next/link to link to the pages
import Link from "next/link";

function Header() {
  // style the components
  const headerStyle = {
    // make the background a lighter shade of blue (darker than f4f4f4)
    background: "#f4f4f4",
    // make the text white
    color: "#333",
    // make the text centered
    textAlign: "center",
    // add some padding
    padding: "5px",
    // allow links to be on the same vertical line
    display: "flex",
    // but have the links on the right
    justifyContent: "space-between",
    // and at the bottom
    alignItems: "flex-end",
  };

  const headerTextStyle = {
    fontSize: "20px",
    // move the text to the left
    textAlign: "left",
    padding: "10px",
    // make the text be vertically centered
    display: "flex",
    alignItems: "center",
  };

  const linkDivStyle = {
    // make the links look like buttons
    // have the links on the right
    textAlign: "right",
    // add some padding
    padding: "10px",
    // make the div a change color when hovered over
    ":hover": {
      background: "#333",
      color: "#f4f4f4",
    },
  };

  const linkStyle = {
    // add some padding
    padding: "10px",
    // make the links in a box
    border: "1px solid #333",
    // make the links rounded
    borderRadius: "5px",
    // make the links a bit bigger
    fontSize: "20px",
    // spread the links out
    margin: "5px",
  };

  return (
    <header style={headerStyle}>
      <div style={headerTextStyle}>
        <h1>
          <Link href="/">Songpedia</Link>
        </h1>
      </div>
      <div style={linkDivStyle}>
        <Link href="/" style={linkStyle}>
          Search Songs
        </Link>
        <Link href="/songs" style={linkStyle}>
          My Songs
        </Link>
        <Link href="/songs/explore" style={linkStyle}>
          Song Store
        </Link>
      </div>
    </header>
  );
}

export default Header;
