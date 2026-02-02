import React from 'react'

function StatsDashboard({stats}) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
      <div className='bg-gray-900 rounded-xl p-4 border border-red-900/30'>
        <label className='text-gray-400 text-sm uppercase'> Total Animes </label>
          <div className='text-3xl font-bold text-white'>
            {stats.totalAnime}
          </div>
      </div>
    </div>
  )
}

export default StatsDashboard