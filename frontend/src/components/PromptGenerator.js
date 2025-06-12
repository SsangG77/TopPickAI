import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Chip, 
  Paper,
  Typography
} from '@mui/material';

const PromptGenerator = ({ selectedWords, onWordRemove, onGenerate, onWordSelect }) => {
  const [inputWord, setInputWord] = React.useState('');

  const handleAddWord = () => {
    if (inputWord.trim()) {
      onWordSelect(inputWord.trim());
      setInputWord('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddWord();
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }} elevation={0}>
      {/* <Typography variant="h5" gutterBottom>
        이미지 프롬프트 생성기
      </Typography> */}
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="단어 입력"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="단어를 입력하고 Enter를 누르세요"
        />
        <Button 
          variant="contained" 
          onClick={handleAddWord}
          sx={{ minWidth: '100px' }}
        >
          추가
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {selectedWords.map((word, index) => (
          <Chip
            key={index}
            label={word}
            onDelete={() => onWordRemove(word)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={onGenerate}
        disabled={selectedWords.length === 0}
      >
        이미지 생성하기
      </Button>
    </Paper>
  );
};

export default PromptGenerator; 