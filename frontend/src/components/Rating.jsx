import {useState} from 'react'

function Rating({currentRating, onChangeRating}) {
  const [hover, setHover] = useState(0);
  // Array.form(souce, mapFunction)
  const stars = Array.from({length:10}, (_,i)=>i+1);

  return (
    <div className={`flex gap-1 justify-center `}>
      {
        stars.map((star) => (
          <span
            key={star}
            onClick={() => onChangeRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`cursor-pointer text-xl transition-transform hover:scale-110
              ${(hover || currentRating) >= star ? "text-red-600":"text-gray-600"}`}
          >
            ★
          </span>
        ))}

    </div>
  )
}

export default Rating