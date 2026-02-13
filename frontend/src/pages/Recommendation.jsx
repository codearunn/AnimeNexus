import React from 'react'
import AIchat from '../components/AI/AIchat'

function Recommendation() {
  return (
    <div className='min-h-screen bg-black text-white p-6'>
      <h1 className='text-5xl font-bold text-red-600 mb-8 font-horror text-center'>Recommended For You</h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>

        <div className='w-[200px] h-[200px] border border-red-500'></div>
        <div className='w-[200px] h-[200px] border border-red-500'></div>
        <div className='w-[200px] h-[200px] border border-red-500'></div>
        <div className='w-[200px] h-[200px] border border-red-500'></div>
        <div className='w-[200px] h-[200px] border border-red-500'></div>
      </div>

      <AIchat/>
    </div>
  )
}

export default Recommendation