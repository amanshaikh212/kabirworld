import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query,setQuery] = useState('');
  const submitHandler = (e)=>{
    e.preventDefault();
    navigate(query?`/search/?query=${query}`:'/search');
  }
  return (
    <div className="flex">
        <form className="flex" onSubmit={submitHandler}>
            <input type="text" name="q" id="q" onChange={(e)=>setQuery(e.target.value)} placeholder="search products..." aria-label="Search Products" aria-describedby="button-search" className="p-2 placeholder-gray-800 placeholder:font-bold focus:outline-none"/>
            <button type="submit" id="button-search" className="bg-gray-600 w-[50px]">
                <i className="fa fa-search text-white"></i>
            </button>
        </form>
    </div>
  )
}
