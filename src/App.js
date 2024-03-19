import React, { useState } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import coolImage from './question.avif';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [keywords, setKeywords] = useState('');
  const [evaluationResult, setEvaluationResult] = useState({ score: null, message: '' });
   
  
  const calculateScore = (answerTokens, keywordTokens) => {
    const totalKeywords = keywordTokens.length;
    let matchedKeywords = 0;
    
    keywordTokens.forEach(keyword => {
      if (answerTokens.includes(keyword)) {
        matchedKeywords += 1;
      }
    });
  
    const x = (matchedKeywords / totalKeywords) * 100;
  
    let score;
    let message;
  
    if (x > 80) {
      score = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
      message = 'Excellent';
    } else if (x > 65 && x <= 80) {
      score = Math.floor(Math.random() * (85 - 60 + 1)) + 60;
      message = 'Good';
    } else if (x > 40 && x <= 65) {
      score = Math.floor(Math.random() * (60 - 40 + 1)) + 40;
      message = 'Average';
    } else {
      score = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
      message = 'Fail';
    }
  
    return { score, message };
  };
  

  async function evaluateAnswerWithML(answer) {
  // Load your trained model
  const model = await tf.loadLayersModel('path_to_your_model/model.json');

  // Tokenize the answer (replace this with your own tokenization logic)
  const answerTokens = answer.toLowerCase().split(/\W+/).filter(token => token.length > 0);

  // Preprocess the input data as needed (e.g., convert tokens to numerical representation)
  // Replace this step with your own preprocessing logic based on how your model was trained

  // Convert input data to tensor format
  const inputTensor = tf.tensor2d([answerTokens]); // Adjust tensor shape as needed

  // Perform inference with the model
  const prediction = model.predict(inputTensor);

  // Post-process the prediction as needed (e.g., convert numerical output to categorical)
  // Replace this step with your own post-processing logic based on your model's output format

  // Return the evaluation result (score, message, etc.)
  return prediction;
}

  const evaluateAnswer = () => {
    const answerTokens = answer.toLowerCase().split(/\W+/).filter(token => token.length > 0); // Tokenize answer
    const keywordTokens = keywords.toLowerCase().split(',').map(keyword => keyword.trim()); // Tokenize keywords
    
    const { score, message } = calculateScore(answerTokens, keywordTokens);
    setEvaluationResult({ score, message });
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

        {evaluationResult.score !== null && ( // Render result section if evaluation result is available
          <div className="result">
            <p>Score: {evaluationResult.score}</p>
            <p>{evaluationResult.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
