"use client";

import React, { useEffect, useState } from 'react';
interface SelectGenreProps {
  setGenre: React.Dispatch<React.SetStateAction<string>>;
  genres: string;
}

  const SelectGenre: React.FC<SelectGenreProps> = ({ setGenre,genres }) => {

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = ( ) => {
    setIsOptionSelected(true);
  };

  const changeGenre = (value: string) => {

    setSelectedOption(value);
    setIsOptionSelected(true);
    setGenre(value);
  };

  useEffect(() => {
    setSelectedOption(genres);
  }, [genres]);

  return (

      <div className="relative bg-white dark:bg-form-input">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2"> {/* Positionnement centré */}
          <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 24.5019V19.0019H11V18.7519L11.072 18.6019C12.6709 15.2438 13.5004 11.5712 13.5 7.85191V7.52391C14.4608 7.17209 15.4768 6.99496 16.5 7.00091C17.788 7.00091 18.811 7.26691 19.5 7.52391V7.85191C19.5 11.5719 20.33 15.2429 21.928 18.6009L22 18.7509V19.0009H18.5V24.5019M6.5 24.5019V18.0019C6.5 17.4715 6.71071 16.9628 7.08579 16.5877C7.46086 16.2126 7.96957 16.0019 8.5 16.0019V8.00191C8.5 8.00191 7 7.00191 4.5 7.00191C2 7.00191 0.5 8.00191 0.5 8.00191V16.0019C1.03043 16.0019 1.53914 16.2126 1.91421 16.5877C2.28929 16.9628 2.5 17.4715 2.5 18.0019V24.5019M16.35 5.00191C16.35 5.00191 14.75 4.00191 14.75 2.75191C14.75 2.28831 14.9342 1.8437 15.262 1.51588C15.5898 1.18807 16.0344 1.00391 16.498 1.00391C16.9616 1.00391 17.4062 1.18807 17.734 1.51588C18.0618 1.8437 18.246 2.28831 18.246 2.75191C18.246 4.00191 16.65 5.00191 16.65 5.00191H16.35ZM4.35 5.00191C4.35 5.00191 2.75 4.00191 2.75 2.75191C2.75 2.52236 2.79521 2.29505 2.88306 2.08298C2.9709 1.8709 3.09966 1.6782 3.26198 1.51588C3.42429 1.35357 3.61699 1.22481 3.82907 1.13696C4.04115 1.04912 4.26845 1.00391 4.498 1.00391C4.72755 1.00391 4.95485 1.04912 5.16693 1.13696C5.37901 1.22481 5.57171 1.35357 5.73402 1.51588C5.89634 1.6782 6.0251 1.8709 6.11294 2.08298C6.20079 2.29505 6.246 2.52236 6.246 2.75191C6.246 4.00191 4.65 5.00191 4.65 5.00191H4.35Z" fill="black" fillOpacity="0.6" />
          </svg>
        </span>

        <select
          value={selectedOption}
          onChange={(e) => { changeGenre(e.target.value); changeTextColor(); }}
          className={`relative z-20 w-full appearance-none rounded-sm border border-stroke bg-transparent py-2 pl-10 pr-10 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark dark:bg-form-input ${isOptionSelected ? 'text-black dark:text-white' : ''}`}>
          <option value="" disabled className="text-body dark:text-bodydark">Genre</option>
          <option value="HOMME" className="text-body dark:text-bodydark">HOMME</option>
          <option value="FEMME" className="text-body dark:text-bodydark">FEMME</option>
        </select>

        <span className="absolute top-1/2 right-4 -translate-y-1/2"> {/* Positionnement centré */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.8">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill="#637381" />
            </g>
          </svg>
        </span>
      </div>

  )

};

export default SelectGenre;
