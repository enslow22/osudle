import React, { useState } from 'react'
import {useCombobox} from 'downshift';


export default function DownshiftSuggestions(props) {

    // Stuff for AutoSuggestions
    // Dictionary of maps
    const listOfMaps = props.dataList.map(map => ({title: map.title, diff: map.diff_name, background: map.background}))
    const [items, setItems] = useState(listOfMaps)
    const {
        isOpen,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
        selectedItem
        } = useCombobox({
        onInputValueChange({inputValue}) {
            setItems(listOfMaps.filter(getMapsFilter(inputValue)))
        },
        items,
        itemToString(item) {
            return item ? item.title : ''
        }
        })

    function getMapsFilter(inputValue) {
        const lower = inputValue.toLowerCase()

        return function MapsFilter(map) {
            return (!inputValue || map.title.toLowerCase().includes(lower) || map.diff.toLowerCase().includes(lower))
        }
    }

    function onClickHandler(e, selectedItem) {

    
        // Make sure selected item is not null
        if (selectedItem === null) {
            return
        }
        props.onClick(e, selectedItem)
    }

    return (
        <>
            <div className='grid d-flex justify-content-center gap-1'> 
                <input  placeholder='Start Typing...' {...getInputProps()}/>
                <button className={"btn btn-primary"} onClick={(e) => {onClickHandler(e, selectedItem)}}>Submit</button>
            </div>
            <div className='row position-relative'>
                <div className='col'>
                    <ul className="list-group d-inline-block position-absolute top-50 start-50 translate-middle-x overflow-auto vh-100" style={{maxHeight:'300px', width:'50%'}} {...getMenuProps()}>
                            {isOpen && items.map((item, index) => (
                                <li className={"list-group-item ".concat(highlightedIndex === index ? 'bg-body-tertiary' : '')} key={`${item.value}${index}`}
                                {...getItemProps({item, index})}>
                                    <span>{item.title}</span>
                                    <span> - [{item.diff}]</span>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </>
    )
}