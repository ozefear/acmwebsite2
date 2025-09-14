import React, { useState, useEffect, useRef } from 'react';
import { Department } from '../types';

interface SearchableSelectProps {
    options: Department[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder = "Select an option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);
    
    useEffect(() => {
        if (selectedOption) {
            setSearchTerm(selectedOption.label);
        } else {
            setSearchTerm('');
        }
    }, [value, selectedOption]);


    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: Department) => {
        onChange(option.value);
        setSearchTerm(option.label);
        setIsOpen(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if(!isOpen) setIsOpen(true);
        if(e.target.value === '') {
             onChange('');
        }
    }

    return (
        <div className="relative font-mono" ref={wrapperRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
             <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className="px-3 py-2 cursor-pointer text-slate-300 hover:bg-purple-500/20"
                            >
                                {option.label}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-slate-500">Bulunamadı</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableSelect;