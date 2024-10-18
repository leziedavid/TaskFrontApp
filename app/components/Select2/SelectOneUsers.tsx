"use client";

import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { Users } from '../../interfaces/Users';
import { getProjectUsers } from '../../services/ProjectService';
import { useParams } from 'react-router-dom';



interface SelectOneUsersProps {
  setUsers: React.Dispatch<React.SetStateAction<string>>;
  codes: string;
  activeUser: string;
}

const SelectOneUsers: React.FC<SelectOneUsersProps> = ({ setUsers,codes,activeUser }) => {

  const { id } = useParams<{ id: string }>();
  
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<BaseResponse<Users[]> | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectRef = useRef<HTMLDivElement>(null);


  const fetchUsers = async (code: string) => {

    try {

      const apiResponse = await getProjectUsers(code);
      setResponse(apiResponse);

        // Trouver l'utilisateur par défaut avec userId

        if (apiResponse.data) {

          const defaultUser = apiResponse.data.find((user: { userId: { toString: () => string | undefined; }; }) => user.userId.toString() === activeUser.toString());

            if(defaultUser){

              setSelectedUser(defaultUser);
              setUsers(defaultUser.userId.toString());

            }
        }

    } catch (error) {
      // toast.error('Failed to fetch Users');
    }
  };
  useEffect(() => {
    
    fetchUsers(codes!);
    }, [codes,activeUser]);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && selectRef.current) {
      const input = selectRef.current.querySelector<HTMLInputElement>('input');
      if (input) {
        input.focus();
      }
    }
  };

  const toggleUserSelection = (user: Users) => {
    setSelectedUser(user);
    setUsers(user.userId.toString()); // Mettre à jour setUsers avec l'ID de l'utilisateur sélectionné
    setIsDropdownOpen(false); // Fermer le dropdown après sélection
  };

  const filteredUsers = response?.data?.filter(
    user =>
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div ref={selectRef} className="relative z-20 bg-white dark:bg-form-input">
        <div
          onClick={handleToggleDropdown}
          className="w-full rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark cursor-pointer"
        >
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="truncate flex gap-2">
                {selectedUser ? (
                  <div className="flex items-center bg-[#dcdcdc] text-black text-[13px] px-3 py-1 rounded-full">
                    {selectedUser.firstname} {selectedUser.lastname}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-2"
                      >
                        <path
                          d="M19.5 6.91L18.09 5.5L12.5 11.09L6.91 5.5L5.5 6.91L11.09 12.5L5.5 18.09L6.91 19.5L12.5 13.91L18.09 19.5L19.5 18.09L13.91 12.5L19.5 6.91Z"
                          fill="black"
                          fillOpacity="0.6"
                        />
                      </svg>
                  </div>
                ) : (
                  'Sélectionnez un membre'
                )}
              </span>

              <svg
                className={`ml-2 h-4 w-4 transition transform ${
                  isDropdownOpen ? 'rotate-180' : 'rotate-0'
                }`}
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
          <div className="mt-1 absolute z-10 w-full bg-white dark:bg-form-input shadow-lg rounded border border-stroke">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full rounded-t border-b border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark dark:bg-form-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto">
              {filteredUsers?.length ? (
                filteredUsers.map(user => (
                  <div
                    key={user.userId}
                    onClick={() => toggleUserSelection(user)}
                    className={`cursor-pointer py-2 px-5 hover:bg-gray-100 dark:hover:bg-form-input-dark flex items-center space-x-2 ${
                      selectedUser && selectedUser.userId === user.userId
                        ? 'bg-gray-200 dark:bg-form-input-dark'
                        : ''
                    }`}
                  >
                    <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                    <span>
                      {user.firstname} {user.lastname}
                    </span>
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

export default SelectOneUsers;
