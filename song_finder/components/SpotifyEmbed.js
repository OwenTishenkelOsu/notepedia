import { useEffect, useState } from "react";

function SpotifyPlayer({trackId}) {

  return (
    <div>
      {trackId && (
        <iframe
          src={`https://open.spotify.com/embed/track/${trackId}`}
          width="300"
          height="380"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
        />
      )}
    </div>
  );
}

export default SpotifyPlayer;
