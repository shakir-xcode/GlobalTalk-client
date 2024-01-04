import React, { useState, useEffect } from 'react'
import { COUNTRY_LIST } from '../../config';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';



const DropDown = ({ setLanguage }) => {
    const [countries, setCountries] = useState([]);
    const [show, setShow] = useState(false)
    const [term, setTerm] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState("choose language");

    console.log('DROP DOWN RENDERED------------------------------')
    // console.log('SELECTED LANGUAGE: ', selectedLanguage);

    const trimISO = code => code.split(" ")[0];

    useEffect(() => {
        setCountries(COUNTRY_LIST);
    }, [])

    const filterFunc = (term) => {
        let filteredList = [];
        if (term === "") return setCountries([...COUNTRY_LIST]);

        COUNTRY_LIST.forEach(item => {
            if (item.country?.toLowerCase().indexOf(term) > -1) {
                // console.log(item.country)
                filteredList.push(item);
            }
        })
        setCountries([...filteredList]);
    }

    return (
        <div className="relative inline-block">
            <div id="myDropdown" className={` absolute bottom-16  z-1 overflow-auto bg-bg-secondary ${show ? 'block' : 'hidden'}`}>
                <input
                    className=' w-full box-border font-semibold px-2 py-3 border text-text-secondary bg-bg-tertary border-b-1'
                    type="text"
                    placeholder="Search.."
                    id="myInput"
                    value={term}
                    onChange={e => { setTerm(e.target.value); filterFunc(e.target.value) }}
                />
                <div className=' h-52 overflow-scroll scroll-smooth'
                    onClick={e => {
                        setSelectedLanguage(e.target.textContent)
                        setLanguage(prev => {
                            return { ...prev, userLanguage: { name: e.target.textContent, ISOCode: trimISO(e.target.dataset.isocode) } }
                        }
                        );
                        setShow(pre => !pre);
                    }}
                >
                    {countries.map(country => <p key={country.ISOCode} className='font-semibold text-text-secondary px-2 py-2.5 hover:bg-bg-tertary' data-isocode={country.ISOCode}>{country.country}</p>)}
                </div>
            </div>

            <div onClick={() => { setShow(pre => !pre) }}
                className="flex justify-between items-center text-bg-primary rounded-md bg-bg-secondary px-2 py-3 font-bold border-none cursor-pointer hover:bg-bg-tertary"
            > <div tabIndex={1} onBlur={() => { setShow(pre => !pre) }}>
                    {selectedLanguage}
                </div>
                <div>{<KeyboardArrowDownIcon style={{ marginTop: '5px', rotate: show ? '0deg' : '180deg' }} />}</div>
            </div>
        </div>
    )
}

export default DropDown