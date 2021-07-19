import React from 'react'
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap"
import "./SearchResult.css";

const SearchResult = props => {
   return (
      <section className="SearchResult">
         <div>
         <h1>Serch Result</h1>
         <section className="ResultArtists">
            {props.serchResult.map((artist, i) =>
               <div className="artistContainer" key={i}>
                  <img className="artistImage" src={`/image/${artist.profileImageUrl}`} alt={artist.fullName} />
                  <section>
                     <Link to={{ pathname: `/artist/${artist.fullName}`, artist: { artist: artist } }}><h5>{artist.fullName}</h5></Link>
                     Assets: <span>{artist.assets.length}</span>
                  </section>
               </div>
            )}
         </section>
         </div>
      </section>
   );
}

export default SearchResult