export const analyzeDay = (d) => {
  let score = 0;
  let feedback = [];

  /* ======================
     SLEEP ANALYSIS
  ====================== */
  if (d.sleep >= 7) {
    score += 25;
    feedback.push("Great sleep duration — this strongly boosts focus and recovery.");
  } else if (d.sleep >= 6) {
    score += 18;
    feedback.push("Sleep is slightly low. Aim for 7–8 hours for optimal performance.");
  } else {
    score += 8;
    feedback.push("Low sleep detected — burnout risk is increased.");
  }

  /* ======================
     STUDY ANALYSIS
  ====================== */
  if (d.study >= 4 && d.study <= 6) {
    score += 25;
    feedback.push("Balanced study hours — excellent for long-term productivity.");
  } else if (d.study > 8) {
    score += 15;
    feedback.push("Overstudying detected. Recovery time is important to avoid burnout.");
  } else if (d.study >= 2) {
    score += 18;
    feedback.push("Moderate study effort — consistency will improve results.");
  } else {
    score += 10;
    feedback.push("Low study time today. Small daily progress matters.");
  }

  /* ======================
     PHYSICAL ACTIVITY
  ====================== */
  if (d.activity >= 30) {
    score += 15;
    feedback.push("Good physical activity — helps mental clarity and energy.");
  } else if (d.activity >= 15) {
    score += 10;
    feedback.push("Some activity is good. Try reaching 30 minutes tomorrow.");
  } else {
    score += 5;
    feedback.push("Very low activity — movement helps reduce stress and fatigue.");
  }

  /* ======================
     SCREEN TIME
  ====================== */
  if (d.screen <= 4) {
    score += 15;
    feedback.push("Healthy screen time — great for eye strain and focus.");
  } else if (d.screen <= 6) {
    score += 8;
    feedback.push("Screen time is moderate. Take regular breaks to stay fresh.");
  } else {
    score += 3;
    feedback.push("High screen time may reduce productivity and sleep quality.");
  }

  /* ======================
     STRESS LEVEL
  ====================== */
  if (d.stress === 1) {
    score += 20;
    feedback.push("Low stress levels — excellent emotional balance today.");
  } else if (d.stress === 2) {
    score += 12;
    feedback.push("Moderate stress detected. Short breaks can help.");
  } else {
    score += 5;
    feedback.push("High stress detected — consider relaxation or mindfulness.");
  }

  /* ======================
     FINAL SCORE CLAMP
  ====================== */
  score = Math.max(0, Math.min(100, score));

  /* ======================
     OVERALL DAY SUMMARY
  ====================== */
  if (score >= 80) {
    feedback.unshift("🌟 Excellent day overall! Keep maintaining this balance.");
  } else if (score >= 60) {
    feedback.unshift("👍 Good day with room for small improvements.");
  } else if (score >= 40) {
    feedback.unshift("⚠️ Average day — improving sleep or activity can help.");
  } else {
    feedback.unshift("🚨 High burnout risk. Prioritize rest and recovery.");
  }

  return { score, feedback };
};
