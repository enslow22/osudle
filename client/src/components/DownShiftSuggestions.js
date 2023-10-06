import React, { useEffect, useState } from 'react'
import {useCombobox} from 'downshift';


export default function DownshiftSuggestions(props) {

    // Contains all the maps in the db for auto suggestions
    const [listOfMaps, setListOfMaps] = useState([])
    const [items, setItems] = useState([])

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

    
    // Initialize the list from props
    useEffect(() => {
        const listOfMaps = props.dataList.map(map => ({title: map.title, diff: map.diff_name}))
        listOfMaps.sort((a, b) => {
            var m1 = a.title.toLowerCase();
            var m2 = b.title.toLowerCase();
            return (m1 < m2) ? -1 : (m1 > m2) ? 1 : 0
        })
        setListOfMaps(listOfMaps)
        // eslint-disable-next-line
    }, [])
    

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
                <input  placeholder='Start Typing...' {...getInputProps({})}/>
                <button className={"btn btn-primary btn-lg"} onClick={(e) => {onClickHandler(e, selectedItem)}}>Submit</button>
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