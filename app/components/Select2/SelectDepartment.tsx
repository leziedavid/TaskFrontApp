import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { Department } from '../../interfaces/Department';
import { getAllDepartments } from '../../services/ProjectService';

interface SelectDepartmentProps {
  setDepartment: React.Dispatch<React.SetStateAction<string>>;
  departments: Department[] | null;
}

const SelectDepartment: React.FC<SelectDepartmentProps> = ({ setDepartment, departments }) => {
  
  const [selectedOption, setSelectedOption] = useState<Department | null>(null);
  const [response, setResponse] = useState<BaseResponse<Department[]> | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

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

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && selectRef.current) {
      const input = selectRef.current.querySelector<HTMLInputElement>('input');
      if (input) input.focus();
    }
  };

  const changeDepartment = (value: Department) => {
    console.log('Selected department:', value.departmentId); // Ajoute un log ici
    setSelectedOption(value);
    setDepartment(value.departmentId); // Assure-toi que value.departmentId est bien défini
    setIsDropdownOpen(false);
  };

  const filteredDepartments = response?.data?.filter(department =>
    department.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {

    if (departments && departments.length > 0) {
      console.log('Departments:', departments);
      const firstDepartment = departments[0];

      if (typeof firstDepartment.departmentName === 'string') {
        
        setSelectedOption(firstDepartment);
        setDepartment(firstDepartment.departmentId);

      } else {
        console.log('departmentName is not a string or is missing');
      }
    } else {
      console.log('Departments is null or empty');
    }
  }, [departments, setDepartment]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div ref={selectRef} className="relative z-10 bg-white dark:bg-form-input">
        <div onClick={handleToggleDropdown} className="w-full rounded-sm border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark cursor-pointer">
          <div className="flex items-center justify-between">
            <span className={`truncate ${selectedOption ? 'text-black dark:text-white' : ''}`}>
              {selectedOption ? selectedOption.departmentName : 'Sélectionnez un departement'}
            </span>
            <svg className={`ml-2 h-4 w-4 transition transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDropdownOpen ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'} />
            </svg>
          </div>
        </div>
        {isDropdownOpen && (
          <div className="mt-1 z-50 absolute w-full bg-white dark:bg-form-input shadow-lg rounded border border-stroke">
            <input type="text" placeholder="Rechercher un département..." className="w-full rounded-t border-b border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark dark:bg-form-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="max-h-60 overflow-y-auto">
              {filteredDepartments?.length ? (
                filteredDepartments.map((department) => (
                  <div key={department.departmentId} onClick={() => changeDepartment(department)} className={`cursor-pointer py-2 px-5 hover:bg-gray-100 dark:hover:bg-form-input-dark ${selectedOption?.departmentId === department.departmentId ? 'bg-gray-200 dark:bg-form-input-dark' : ''}`}>
                    {department.departmentName}
                  </div>
                ))
              ) : (
                <div className="py-2 px-5">Aucun département trouvé</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SelectDepartment;
