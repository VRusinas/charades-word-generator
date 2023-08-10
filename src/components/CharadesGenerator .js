import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CharadesGenerator.css';

const CharadesGenerator = () => {
  const [word, setWord] = useState('-');
  const [isWordUpdated, setIsWordUpdated] = useState(false);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const generateWord = async () => {
    try {
      const response = await axios.get('https://api.datamuse.com/words?rel_jja=game');
      const suitableWords = response.data.filter(item => item.word.length >= 3 && item.word.length <= 100);
      if (suitableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * suitableWords.length);
        const noun = suitableWords[randomIndex].word;

        const adjectiveResponse = await axios.get(`https://api.datamuse.com/words?rel_jjb=${noun}`);
        const suitableAdjectives = adjectiveResponse.data.filter(item => item.word.length >= 3 && item.word.length <= 100 && (!item.tags || item.tags.includes('adj')));

        if (suitableAdjectives.length > 0) {
          const randomAdjectiveIndex = Math.floor(Math.random() * suitableAdjectives.length);
          const adjective = suitableAdjectives[randomAdjectiveIndex].word;

          const capitalizedAdjective = capitalizeFirstLetter(adjective);
          const capitalizedNoun = capitalizeFirstLetter(noun);

          setWord(`${capitalizedAdjective} ${capitalizedNoun}`);
        } else {
          console.log('No suitable adjectives found for the noun:', noun);
        }
      } else {
        console.log('No suitable nouns found.');
      }
    } catch (error) {
      console.error('Error fetching words:', error);
    }
    setIsWordUpdated(true);
  };

  useEffect(() => {
    if (isWordUpdated) {
      setTimeout(() => {
        setIsWordUpdated(false);
      }, 500); 
    }
  }, [isWordUpdated]);

  return (
    <div className="card-container">
      <div className="card">
        <h2 id='text'>Charades Word Generator</h2>
        <button className="button" onClick={generateWord}>
          Click To Generate
        </button>
        <br />
        <h3 id='text'>You Need To Explain:</h3>
        <h3 className={`words ${isWordUpdated ? 'animated' : ''}`}>{word}</h3>
      </div>
    </div>
  );
};

export default CharadesGenerator;
