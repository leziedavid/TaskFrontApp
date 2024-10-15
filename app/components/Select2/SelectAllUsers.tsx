import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';
import { Users } from '../../interfaces/Users';
import { getAllUsersService } from '../../services/UsersService';
import { getAllUsersByMultipleDepartment } from '../../services/ProjectService';
import { BaseResponse } from '../../interfaces/ApiResponse';

interface SelectAllUsersProps {
  setUsers: React.Dispatch<React.SetStateAction<number[]>>;
  departementId: number |  undefined;
}

const SelectAllUsers: React.FC<SelectAllUsersProps> = ({ setUsers,departementId }) => {

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<BaseResponse<Users[]> | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    console.log(departementId);
    const fetchUsers = async () => {
      try {

        if(departementId){
          const apiResponse = await getAllUsersByMultipleDepartment(departementId);
          setResponse(apiResponse);
        }else{
          const apiResponse = await getAllUsersService();
          setResponse(apiResponse);

        }

        
      } catch (error) {
        console.error('Error fetching Users:', error);
        toast.error('Failed to fetch Users');
      }
    };

    fetchUsers();
  }, [departementId]);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && selectRef.current) {
      const input = selectRef.current.querySelector<HTMLInputElement>('input');
      if (input) {
        input.focus();
      }
    }
  };

  const toggleUserSelection = (userId: number) => {
    const isSelected = selectedOptions.includes(userId);
    let updatedSelection: number[];

  
    if (!isSelected) {
      updatedSelection = [...selectedOptions, userId];
    } else {
      updatedSelection = selectedOptions.filter(id => id !== userId);
    }

    console.log(updatedSelection);
  
    setSelectedOptions(updatedSelection);
    setUsers(updatedSelection);
    setIsDropdownOpen(false); // Fermer le menu déroulant après sélection
  };

  const filteredUsers = response?.data?.filter(
    user => user.firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div ref={selectRef} className="relative z-0 bg-white dark:bg-form-input">
        <div
          onClick={handleToggleDropdown} className="w-full rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark cursor-pointer">
          <div className="relative">
            <div className="flex items-center justify-between">

              <span className="truncate flex gap-2">
                  <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <path d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                      fill="" />
                    <path d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                      fill="" />
                  </svg>

                {selectedOptions.length > 0
                  ? selectedOptions.map(userId => {
                      const user = filteredUsers?.find(u => u.userId === userId);
                      return (
                        <div key={userId} onClick={() => toggleUserSelection(userId)} className={`flex items-center ${user ? 'bg-[#dcdcdc] text-black text-[13px] px-3 py-1 rounded-full' : 'rotate-0'}`}>
                          {user ? `${user.firstname} ${user.lastname}` : ''}
                          <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path d="M19.5 6.91L18.09 5.5L12.5 11.09L6.91 5.5L5.5 6.91L11.09 12.5L5.5 18.09L6.91 19.5L12.5 13.91L18.09 19.5L19.5 18.09L13.91 12.5L19.5 6.91Z" fill="black" fillOpacity="0.6"/>
                          </svg>
                        </div>
                      );
                    })
                  : 'Sélectionnez un compte'}
                  
              </span>

              <svg className={`ml-2 h-4 w-4 transition transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDropdownOpen ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'}/>
              </svg>

            </div>
          </div>
        </div>
        {isDropdownOpen && (
          <div className="mt-1 absolute z-10 w-full bg-white dark:bg-form-input shadow-lg rounded border border-stroke">
            <input type="text" placeholder="Rechercher un utilisateur..." className="w-full rounded-t border-b border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-strokedark dark:bg-form-input"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            <div className="max-h-60 overflow-y-auto">
              {filteredUsers?.length ? (
                filteredUsers.map(user => (
                  <div key={user.userId} onClick={() => toggleUserSelection(user.userId)} className={`cursor-pointer py-2 px-5 hover:bg-gray-100 dark:hover:bg-form-input-dark flex items-center space-x-2 ${
                      selectedOptions.includes(user.userId) ? 'bg-gray-200 dark:bg-form-input-dark' : ''
                    }`}
                  >
                    <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                    <span>{user.firstname} {user.lastname}</span>
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

export default SelectAllUsers;
