import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const WeeklyChart = ({ uid }) => {
  const [labels, setLabels] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    setLoading(true);

    const q = query(
      collection(db, "dailyData"),
      where("uid", "==", uid),
      orderBy("date", "desc"),
      limit(7)
    );

    // 🔥 REAL-TIME LISTENER
    const unsub = onSnapshot(q, (snap) => {
      const l = [];
      const s = [];

      snap.docs
        .slice()
        .reverse()
        .forEach((doc) => {
          const d = doc.data();
          l.push(d.date.slice(5));
          s.push(d.dayScore);
        });

      setLabels(l);
      setScores(s);
      setLoading(false);
    });

    return () => unsub();
  }, [uid]);

  if (loading) {
    return (
      <p className="text-center text-slate-400 mt-16">
        Loading weekly trends...
      </p>
    );
  }

  if (!scores.length) {
    return (
      <p className="text-center text-slate-400 mt-16">
        No weekly data yet
      </p>
    );
  }

  return (
    <div className="weekly-chart">
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "DayScore",
              data: scores,
              fill: true,
              tension: 0.45,
              borderWidth: 3,
              borderColor: "#38bdf8",
              backgroundColor: "rgba(56,189,248,0.18)",
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#38bdf8",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: "index",
          },
          scales: {
            x: {
              ticks: {
                color: "#94a3b8",
                font: { size: 12 },
              },
              grid: {
                display: false,
              },
            },
            y: {
              min: 0,
              max: 100,
              ticks: {
                stepSize: 20,
                color: "#94a3b8",
                font: { size: 12 },
              },
              grid: {
                color: "rgba(148,163,184,0.1)",
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "#020617",
              titleColor: "#e5e7eb",
              bodyColor: "#e5e7eb",
              padding: 10,
              cornerRadius: 8,
              displayColors: false,
              callbacks: {
                label: (ctx) => `DayScore: ${ctx.raw}`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default WeeklyChart;
