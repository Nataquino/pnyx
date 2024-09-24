import React, { useState } from "react";
import Sentiment from "sentiment";

const SentimentComponent = () => {
  const [text, setText] = useState(""); // For user input text
  const [analysis, setAnalysis] = useState(null); // To store sentiment analysis result
  const sentiment = new Sentiment(); // Create instance of Sentiment

  const analyzeSentiment = () => {
    const result = sentiment.analyze(text); // Perform sentiment analysis
    setAnalysis(result); // Store the result in the state
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sentiment Analysis</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)} // Update text as user types
        placeholder="Enter text for sentiment analysis"
        rows={4}
        cols={50}
        style={{ marginBottom: "10px", padding: "10px", fontSize: "16px" }}
      />
      <br />
      <button
        onClick={analyzeSentiment} // Trigger analysis on button click
        style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
      >
        Analyze
      </button>

      {/* Display analysis results when available */}
      {analysis && (
        <div style={{ marginTop: "20px" }}>
          <h2>Analysis Results:</h2>
          <p>Sentiment Score: {analysis.score}</p>
          <p>Comparative Score: {analysis.comparative}</p>
          <h3>Word Analysis:</h3>
          <ul>
            {analysis.words.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SentimentComponent;
