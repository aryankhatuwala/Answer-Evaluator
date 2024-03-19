import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js for machine learning
import './App.css';
import coolImage from './question.avif';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [keywords, setKeywords] = useState('');
  const [evaluationResult, setEvaluationResult] = useState('');

  // Function to evaluate the answer
  const evaluateAnswer = () => {
    const answerTokens = answer.toLowerCase().split(/\W+/).filter(token => token.length > 0); // Tokenize answer
    const keywordTokens = keywords.toLowerCase().split(',').map(keyword => keyword.trim()); // Tokenize keywords
    
    // Calculate cosine similarity between answer and keywords
    const similarity = calculateCosineSimilarity(answerTokens, keywordTokens);
    const score = Math.max(40, Math.round(similarity * 100)); // Map similarity to score between 40 to 100
    setEvaluationResult(score); // Set evaluation result
  };

  // Function to calculate cosine similarity
  const calculateCosineSimilarity = (vectorA, vectorB) => {
    const dotProduct = vectorA.reduce((acc, tokenA) => {
      if (vectorB.includes(tokenA)) {
        acc += 1; // Increment dot product if token from answer also present in keywords
      }
      return acc;
    }, 0);

    const magnitudeA = Math.sqrt(vectorA.length);
    const magnitudeB = Math.sqrt(vectorB.length);

    return dotProduct / (magnitudeA * magnitudeB); // Return cosine similarity
  };

  // Function to get the result message based on the evaluation result
  const getResultMessage = () => {
    if (evaluationResult >= 90) {
      return 'Excellent!';
    } else if (evaluationResult >= 70) {
      return 'Good!';
    } else if (evaluationResult >= 50) {
      return 'Average';
    } else {
      return 'Fail';
    }
  };

  return (
    <div className="App">
      <h1>Answer Evaluator</h1>
      <img src={coolImage} alt="Cool" className="cool-image" />
      <div className="form">
        <label htmlFor="question">Question:</label>
        <input type="text" id="question" value={question} onChange={(e) => setQuestion(e.target.value)} />

        <label htmlFor="answer">Answer:</label>
        <textarea id="answer" rows="4" cols="50" value={answer} onChange={(e) => setAnswer(e.target.value)} />

        <label htmlFor="keywords">Keywords (comma-separated):</label>
        <input type="text" id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} />

        <button onClick={evaluateAnswer}>Evaluate</button>

        {evaluationResult !== '' && ( // Render result section if evaluation result is available
          <div className="result">
            <p>Score: {evaluationResult}</p>
            <p>{getResultMessage()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
