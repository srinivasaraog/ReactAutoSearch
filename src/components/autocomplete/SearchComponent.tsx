import React, { Component } from 'react'
import axios from 'axios'
import './SearchComponent.css';
import '../../App.css';
import SearchResults from '../searchresults/SearchResults';
const API_URL = 'https://api.github.com/repos/facebook/react/issues?state=open'


class SearchComponent extends Component {
  state = {
    query: '',
    results: [],
    filteredResults: [],
    activeSuggestion: 0,
    filteredSuggestions: [],
    showSuggestions: false,
    userInput: '',
  }
  constructor(props: any) {
    super(props);
    this.state = {
      query: '',
      results: [],
      filteredResults: [],
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: '',
    }
    this.filtersuggessions = this.filtersuggessions.bind(this);

  }

  //React Life Cycle used to make the api call before the component loads
  componentDidMount() {
    axios.get(API_URL)
      .then(({ data }: { data: any }) => {
        this.setState({
          results: data,
          filteredResults: data,
        })
      })
  }

  // Event fired when the input value is changed
  onChange = (e: any) => {
    this.setState({
      query: e.target.value
    }, () => {
      if (this.state.query && this.state.query.length < 1) {
        this.setState({ filteredResults: this.state.results });
        this.filtersuggessions();
      } else {
        this.filtersuggessions();
      }
    })


  };

  // Event fired when the user clicks on a suggestion
  onClick = (e: any) => {
    if (this.state.query && this.state.query.length > 1) {
      // Update the user input and reset the rest of the state
      this.setState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: e.currentTarget.innerText
      }, this.getInfo);
    } else {
      this.setState({ filteredResults: this.state.results });
    }


  };



  // Event fired when the user presses a key down
  onKeyDown = (e: any) => {  

    if (e.keyCode === 13) {
      //call back after userselection 
      this.setState({
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        userInput: e.currentTarget.innerText
      }, this.getInfo);

    }

  };

  getInfo = () => {
    let filteredObject = this.state.results.filter((arr: any) =>
      arr.title.includes(this.state.userInput)
    )
    this.setState({ filteredResults: filteredObject });
  }


  filtersuggessions = ()=> {
    const userInput = this.state.query;
    let inputdataNew = this.state.results && this.state.results.map((a: any) => a.title);
    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = inputdataNew.filter(
      (suggestion: any) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: this.state.query
    });
  }


  render() {
    const {
      onClick,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;
              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li tabIndex={0}
                  className={className}
                  key={suggestion}
                  onClick={onClick}
                  onKeyDown={this.onKeyDown}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>There are no open issues with the given input</em>
          </div>
        );
      }
    }
    return (
      <form>
        <h1 className="title">Find the react open issues here</h1>
        <div className="autosearch">
          <input className="userinput"
          type="text"
          onChange={this.onChange}
          value={this.state.userInput}
          onClick={this.onClick}
        />
        
        
        </div>
        
        {suggestionsListComponent}
        <SearchResults results={this.state.userInput ? this.state.filteredResults : this.state.results} />
      </form>
    )
  }
}

export default SearchComponent;