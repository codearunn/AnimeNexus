const STATUSES = [
  "watching",
  "completed",
  "plan-to-watch",
  "on-hold",
  "dropped",
];

function StatusTab({userAnime, activeTab, setActiveTab}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-6 ml-[300px]">
      {STATUSES.map(status =>{
        const count = userAnime.filter(anime => anime.status === status).length;

        const isActive = activeTab === status;

        return (
          <button
           key={status}
           onClick={() => setActiveTab(status)}
           className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold
            transition-all
            ${
                isActive
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }
            `}
          >
             {status.replace("-", " ").toUpperCase()} ({count})
          </button>
        )
      })}

    </div>
  )
}

export default StatusTab;