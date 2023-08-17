import React, { useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest/dist/Autosuggest'

// Todo replace this whole thing with Downshift
export default function Suggestions(props) {

  // Stuff for AutoSuggestions

  const words = props.dataList.map(map => map.title)

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    var suggestions = inputLength === 0 ? [] : words.filter(title =>
      title.toLowerCase().slice(0, inputLength) === inputValue
    );
    return [...new Set(suggestions)];
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = suggestion => (
    <span>
      {suggestion}
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

  const onSubmit = (e) => {
    setState(oldState => {
      return {...oldState, value: state.value}
    })
    props.onClick(e, state.value)
  }

  return (
    <>
    <div className='col-3'>
    <Autosuggest 
      suggestions={state.suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}/>
    </div>
    <div className='col-1'>
      <button className={"btn btn-primary"} onClick={onSubmit}>
          Submit
      </button>
    </div>
    </>
  )
}
