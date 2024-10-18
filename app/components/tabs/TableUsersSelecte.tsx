"use client";

import React, { useState } from 'react';
import { Bell as BellIcon, User as UserIcon, Menu as MenuIcon } from 'lucide-react';
import { Users } from '@/app/interfaces/Users';

interface TableUsersSelecteProps {
  Tablegenerate: Users[];
  setTablegenerate: React.Dispatch<React.SetStateAction<Users[]>>;
  // setDataGenerated: React.Dispatch<React.SetStateAction<UserState>>;

  // setDataGenerated: React.Dispatch<React.SetStateAction<{ userId: number[]; leaderId: number; }>>;
  setDataGenerated: React.Dispatch<React.SetStateAction<{ usersId: number[]; leaderId: number; }>>;

}



const TableUsersSelecte: React.FC<TableUsersSelecteProps> = ({ Tablegenerate, setTablegenerate,setDataGenerated}) => {

  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(-1);


  const handleDeleteUser = (userId: number) => {
    // Filtrer et mettre à jour Tablegenerate
    const updatedTable = Tablegenerate.filter(user => user.userId !== userId);
    setTablegenerate(updatedTable);
    // Mettre à jour setDataGenerated en fonction des utilisateurs restants
    const remainingUserIds = updatedTable.map(user => user.userId);
    const newLeaderId = selectedUserIndex !== -1 ? updatedTable[selectedUserIndex].userId : 0;
    setDataGenerated({
      usersId: remainingUserIds,
      leaderId: newLeaderId
    });
    // setSelectedUserIndex(-1);
  };

  const handleCheckboxChange = (index: number, userId: number) => {
    if (selectedUserIndex === index) {
      setSelectedUserIndex(-1); // Décocher si déjà sélectionné
      setDataGenerated({
        usersId: Tablegenerate.map(user => user.userId).filter((_, i) => i !== index), // Mettre à jour usersId
        leaderId: 0 // Réinitialiser le leaderId
      });
    } else {
      setSelectedUserIndex(index); // Sélectionner cet utilisateur
      const newUserIds = Tablegenerate.map(user => user.userId); // Obtenir tous les userId
      setDataGenerated({
        usersId: newUserIds,
        leaderId: userId // Mettre à jour le leaderId avec l'userId sélectionné
      });
    }
  };
  

  const handleCheckboxChangeX = (index: number, userId: number) => {

    if (selectedUserIndex === index) {
      
      setSelectedUserIndex(-1); // Décocher si déjà sélectionné
      setDataGenerated(prevData => ({
        ...prevData,
          ...prevData.usersId,
          leaderId:0, // Réinitialiser le leaderId à -1 lorsqu'aucun utilisateur n'est sélectionné
        
      }));
    } else {

      setSelectedUserIndex(index); // Sélectionner cet utilisateur
      setDataGenerated(prevData => ({
        ...prevData,
        
        ...prevData.usersId,
        leaderId: userId, // Mettre à jour le leaderId avec l'userId sélectionné
        
      }));
    }

  };
  

  return (

    <>
      <div className="mb-5">
        {Tablegenerate.length > 0 && (
          <section className="container px-8 mx-auto bg-white">
            <div className=" bg-white p-0">
              
              <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="shadow-lg min-w-full divide-y ">

                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-x-3">
                                <span>Utilisateur</span>
                              </div>
                            </th>
                            <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-x-3">
                                <span>Email</span>
                              </div>
                            </th>

                            <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-x-3">
                                <span>Fonctions</span>
                              </div>
                            </th>

                            <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              <div className="flex items-center gap-x-3">
                                <span> Responsable du groupe</span>
                              </div>
                            </th>

                            <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Actions</th>
                          </tr>
                          
                        </thead>

                        <tbody className="bg-white divide-gray-10 dark:divide-gray-700 dark:bg-gray-900">
                            {Tablegenerate.map((user, index) => (
                                <tr key={index}>

                                <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                  {/* <div className="inline-flex items-center gap-x-3"> */}
                                  <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10">
                                        <UserIcon className="h-8 w-8 rounded-full border-2 text-gray-500" />
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{`${user.firstname} ${user.lastname}`}</div>
                                      </div>
                                    </div>

                                  {/* </div> */}
                                </td>
                                <td className={`px-12 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                  <div className="inline-flex items-center gap-x-3">{user.email} </div>
                                </td>
                                <td className={`px-12 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                  <div className="inline-flex items-center gap-x-3">{user.fonction} </div>
                                </td>
                                <td className={`px-12 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                  <div className="inline-flex items-center gap-x-3">

                                    <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                                      <input
                                        type='checkbox'
                                        name='autoSaver'
                                        className='sr-only'
                                        checked={selectedUserIndex === index}
                                        onChange={() => handleCheckboxChange(index,user.userId)}
                                      />
                                      <span className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${selectedUserIndex === index ? 'bg-[#012340]' : 'bg-[#CCCCCE]'}`}>
                                        <span className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${selectedUserIndex === index ? 'translate-x-6' : ''}`}></span>
                                      </span>
                                    </label>

                                  </div>
                                </td>
                                
                                <td className={`px-4 py-4 text-sm font-medium ${index % 2 === 0 ? 'bg-[#EBF1FA]' : 'bg-white'} text-gray-700 whitespace-nowrap`}>
                                  <div className="inline-flex items-center gap-x-3">
                                    <button type='button' onClick={() => handleDeleteUser(user.userId)} className="text-red-600 hover:text-red-900">
                                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.5 6.91L18.09 5.5L12.5 11.09L6.91 5.5L5.5 6.91L11.09 12.5L5.5 18.09L6.91 19.5L12.5 13.91L18.09 19.5L19.5 18.09L13.91 12.5L19.5 6.91Z" fill="black" fillOpacity="0.6"/>
                                      </svg>
                                    </button>
                                    </div>
                                </td>
                                
                              </tr>
                            ))}
                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

      </div>

    </>
  );

};

export default TableUsersSelecte;
