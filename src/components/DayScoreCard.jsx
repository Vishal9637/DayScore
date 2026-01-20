import { useEffect, useRef, useState } from "react";

const getStatus = (s) =>
  s < 40 ? ["Poor 😞","text-red-400","stroke-red-400"] :
  s < 60 ? ["Normal 😐","text-yellow-400","stroke-yellow-400"] :
  s < 80 ? ["Good 🙂","text-sky-400","stroke-sky-400"] :
           ["Excellent 🚀","text-emerald-400","stroke-emerald-400"];

const DayScoreCard = ({ score = 0 }) => {
  const [display, setDisplay] = useState(score);
  const prev = useRef(score);

  const [label, color, ring] = getStatus(score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (display / 100) * circumference;

  useEffect(() => {
    let s = prev.current;
    const i = setInterval(() => {
      s += s < score ? 1 : -1;
      setDisplay(s);
      if (s === score) {
        prev.current = score;
        clearInterval(i);
      }
    }, 15);
    return () => clearInterval(i);
  }, [score]);

  return (
    <div className="glass-card text-center">
      <h3 className="text-xl mb-4">Your DayScore</h3>

      <div className="relative w-40 h-40 mx-auto">
        <svg className="w-full h-full -rotate-90">
          <circle cx="80" cy="80" r={radius} strokeWidth="10" fill="none" className="stroke-white/10" />
          <circle cx="80" cy="80" r={radius} strokeWidth="10" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${ring} transition-all duration-700`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
          <span className={color}>{display}</span>
        </div>
      </div>

      <p className={`mt-2 font-semibold ${color}`}>{label}</p>
    </div>
  );
};

export default DayScoreCard;
