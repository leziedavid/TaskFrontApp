"use client";

import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { Department } from '../../interfaces/Department';
import { getAllDepartments } from '../../services/ProjectService';

interface SelectDepartmentProps {
  setDepartment: React.Dispatch<React.SetStateAction<string[]>>;
  departments: Department[];
}

const SelectDepartment: React.FC<SelectDepartmentProps> = ({ setDepartment, departments }) => {
  const [selectedOptions, setSelectedOptions] = useState<Department[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<BaseResponse<Department[]> | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const apiResponse = await getAllDepartments();
        setResponse(apiResponse);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to fetch departments');
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };


  }, []);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    
    if (!isDropdownOpen && inputRef.current) {

      inputRef.current.focus();
    }
  };

  const toggleDepartmentSelection = (department: Department) => {
    setSelectedOptions(prevState => {
      const isSelected = prevState.some(d => d.departmentId === department.departmentId);
      if (isSelected) {
        
        // Remove department from selection
        return prevState.filter(d => d.departmentId !== department.departmentId);

      } else {
        // Add department to selection
        return [...prevState, department];
      }
    });
  };

  const removeDepartment = (departmentId: string) => {
    setSelectedOptions(prevState => prevState.filter(d => d.departmentId !== departmentId));
  };

  useEffect(() => {
    setDepartment(selectedOptions.map(d => d.departmentId));
  }, [selectedOptions, setDepartment]);

  const filteredDepartments = response?.data?.filter(
    department =>
      department.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedOptions.some(opt => opt.departmentId === department.departmentId)
  ) || [];

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div ref={selectRef} className="relative z-20 bg-white dark:bg-form-input">
        
        <div onClick={handleToggleDropdown}
          className="w-full rounded-lg border border-stroke bg-transparent py-2 px-2 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark cursor-pointer" >
          
          <div className="relative">
            
            <div className="flex items-center justify-between ">

              <span className={`truncate ${selectedOptions.length ? 'text-black border-stroke dark:text-white' : ''} flex gap-2`}>

                {selectedOptions.length > 0
                  ? selectedOptions.map(option => (

                      <div key={option.departmentId} className="flex items-center gap-2 bg-[#dcdcdc] rounded-lg py-0 px-1">
                        <span>{option.departmentName}</span>
                        <svg
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent closing the dropdown when clicking on the remove icon
                            removeDepartment(option.departmentId);
                          }}
                          width="20"
                          height="20"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="cursor-pointer"
                        >
                          <path
                            d="M19.5 6.91L18.09 5.5L12.5 11.09L6.91 5.5L5.5 6.91L11.09 12.5L5.5 18.09L6.91 19.5L12.5 13.91L18.09 19.5L19.5 18.09L13.91 12.5L19.5 6.91Z"
                            fill="black"
                            fillOpacity="0.6"
                          />
                        </svg>
                      </div>

                    ))

                  : 'Sélectionnez'}
              </span>

              <svg
                className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isDropdownOpen ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}
                />
              </svg>

            </div>

          </div>

        </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-30 mt-2 w-full bg-white dark:bg-form-input border border-stroke rounded-lg shadow-lg">

                <input ref={inputRef}
                  type="text"
                    className="mb-3 w-full rounded-t border-b border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark dark:bg-form-input"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="max-h-60 overflow-y-auto">

                {filteredDepartments.length ? (

                  filteredDepartments.map(department => (
                    <div
                      key={department.departmentId}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-hover ${selectedOptions.some(opt => opt.departmentId === department.departmentId) ? 'bg-gray-200 dark:bg-dark-hover' : ''}`}
                      onClick={() => toggleDepartmentSelection(department)}
                    >
                      {department.departmentName}
                    </div>
                  ))

                ) : (
                  <div className="py-2 px-5">Aucun utilisateur trouvé</div>
                )}


                </div>

              </div>
            )}

      </div>
    </>
  );
};

export default SelectDepartment;
