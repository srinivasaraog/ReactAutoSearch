import React from 'react';
import './SearchResult.css';

const SearchResults = (props:any) => {
  const options = props.results.map((result:any,index:any) => (    
    <div className="myInputautocomplete-list" key={index} tabIndex={0}>
      <hr/>
      <div className="row">
       <div> <img className="avatar" alt=''  src={result.user ? result.user.avatar_url :''} /></div>    
        <div>{result.title}</div> 
      </div>
     
    </div>
  ))
  return <div >{options}</div>
}

export default SearchResults
