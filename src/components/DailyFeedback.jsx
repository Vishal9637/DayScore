const DailyFeedback = ({ feedback }) => {
  if (!feedback?.length) return null;

  return (
    <div className="ai-feedback">
      <h3 className="ai-feedback-title">
        🤖 AI Insights
      </h3>

      <ul className="ai-feedback-list">
        {feedback.map((f, i) => (
          <li key={i} className="ai-feedback-item">
            <span className="ai-dot" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyFeedback;
