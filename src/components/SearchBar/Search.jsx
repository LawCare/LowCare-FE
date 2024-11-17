import React from 'react';
import Image from 'next/image';
import logo from '../../assets/icons/logo.png';
import search from '../../assets/icons/search.png';
import globals from '../../assets/icons/globals.png';

const Search = () => {
  return (
    <div className="flex items-center justify-between bg-custom-light-blue h-16 px-4">
      {/* 로고 */}
      <div className="flex-shrink-0 ml-4">
        <Image src={logo} alt="LAWCARE Logo" width={140} height={20} />
      </div>

      <div className="flex-grow flex justify-center ">
        <div className="flex items-center bg-white rounded-full w-[500px] py-2 shadow-md -translate-x-20">
          <input type="text" className="bg-transparent w-full outline-none text-gray- pl-4" />
          <button className="mr-4">
            <Image src={search} alt="Search Icon" width={20} height={20} />
          </button>
        </div>

        <div className="flex-shrink-0 flex items-center translate-x-[550px]">
          <button>
            <Image src={globals} alt="globals" width={25} height={25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
