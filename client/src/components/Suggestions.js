import React, { useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest/dist/Autosuggest'

export default function Suggestions(props) {

  
  // Stuff for AutoSuggestions

  const words = props.dataList

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : words.filter(lang =>
      lang.title.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const getSuggestionValue = suggestion => suggestion.title;

  const renderSuggestion = suggestion => (
    <span>
      {suggestion.title}
    </span>
  );

  const [state, setState] = useState({value:'', suggestions:[]})
  const onChange = (e, { newValue }) => {
    setState(oldState => {
      return {...oldState, value: newValue}
    })
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    setState(oldState => {
      return {...oldState, suggestions: getSuggestions(value)}
    });
  };

  const onSuggestionsClearRequested = () => {
    setState(oldState => {
      return {...oldState, suggestions: []}
    });
  };

  const inputProps = {
    placeholder: 'Type something...',
    value: state.value,
    onChange: onChange,
    className: "form-control"
  }

  const onSubmit = () => {
    setState(oldState => {
      return {...oldState, value: ''}
    })
    props.onClick()
  }

  return (
    <>

    <Autosuggest 
      suggestions={state.suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}/>
      <button className={"btn btn-primary"} onClick={onSubmit}>
          Submit
      </button>
    </>
  )
}
