import "./JavaLoginStart.css";

function JavaLoginStart() {
  return (
    <div className="start-page">
      <div className="start-container">
        <h2>🚀 Java Login Trial Started</h2>

        <p>
          Complete the authentication system using Java.
          You have 30 minutes to finish the task.
        </p>

        <textarea
          placeholder="Write your Java logic here..."
          className="code-box"
        />

        <button className="submit-btn">
          Submit Trial
        </button>
      </div>
    </div>
  );
}

export default JavaLoginStart;