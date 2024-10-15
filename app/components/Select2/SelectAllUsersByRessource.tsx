import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';
import { BaseResponse } from '../../interfaces/ApiResponse';
import { Users } from '../../interfaces/Users';
import { getAllUsersService } from '../../services/UsersService';
import { getAllUsersByMultipleDepartment } from '../../services/ProjectService';

interface SelectAllUsersByRessourceProps {
  setUser: React.Dispatch<React.SetStateAction<number | null>>;
  setNomUser: React.Dispatch<React.SetStateAction<string>>;
  departementId: number | undefined;
}

const SelectAllUsersByRessource: React.FC<SelectAllUsersByRessourceProps> = ({ setUser, departementId,setNomUser }) => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<BaseResponse<Users[]> | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (departementId) {
          const apiResponse = await getAllUsersByMultipleDepartment(departementId);
          setResponse(apiResponse);
        } else {
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

  const handleUserSelection = (userId: number,nom:string,prenon:string) => {
    let nomcomplet = nom + " " + prenon; // Utilise + pour concaténer les chaînes
    setNomUser(nomcomplet);
    setSelectedUser(userId);
    setUser(userId); // Met à jour l'utilisateur sélectionné dans le parent
    setIsDropdownOpen(false); // Ferme le menu déroulant après sélection
  };

  const filteredUsers = response?.data?.filter(
    user => user.firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div ref={selectRef} className="relative z-0 bg-white dark:bg-form-input ">
        <div onClick={handleToggleDropdown} className="w-full rounded border border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-form-strokedark cursor-pointer">
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="truncate flex gap-2">
                {selectedUser ? (
                  filteredUsers?.find(u => u.userId === selectedUser)?.firstname + ' ' + filteredUsers?.find(u => u.userId === selectedUser)?.lastname
                ) : 'Sélectionnez'}
              </span>
              <svg className={`ml-2 h-4 w-4 transition transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDropdownOpen ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'} />
              </svg>
            </div>
          </div>
        </div>
        {isDropdownOpen && (
          <div className="mt-1 absolute z-0 w-full bg-white dark:bg-form-input shadow-lg rounded border border-stroke">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full rounded-t border-b border-stroke bg-transparent py-2 px-5 outline-none transition focus:border-[#03233F] active:border-[#03233F] dark:border-strokedark dark:bg-form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto">
              {filteredUsers?.length ? (
                filteredUsers.map(user => (
                  <div
                    key={user.userId}
                    onClick={() => handleUserSelection(user.userId,user.firstname,user.lastname)}
                    className={`cursor-pointer py-2 px-5 hover:bg-gray-100 dark:hover:bg-form-input-dark flex items-center space-x-2 ${selectedUser === user.userId ? 'bg-gray-200 dark:bg-form-input-dark' : ''}`}
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

export default SelectAllUsersByRessource;
