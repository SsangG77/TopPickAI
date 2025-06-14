import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Chip, 
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';

const PromptGenerator = ({ selectedWords, onWordRemove, onGenerate, onWordSelect, image, isLoading }) => {
  const [inputWord, setInputWord] = React.useState('');

  const handleAddWord = () => {
    if (inputWord.trim()) {
      // Check if the word already exists
      if (!selectedWords.includes(inputWord.trim())) {
        onWordSelect(inputWord.trim());
        setInputWord('');
      } else {
        // Optionally, provide feedback to the user that the word already exists
        console.log('단어가 이미 추가되었습니다.');
        // You might want to add a visual feedback here, e.g., a Snackbar or a simple alert
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddWord();
    }
  };

  return (
    <Paper 
      elevation={10} 
      sx={{ 
        p: 3, 
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // Space between flex items
        overflow: 'hidden', // Prevent content from overflowing the Paper
        borderRadius: 8
      }}
    >
      {/* <Typography variant="h5" gutterBottom>
        이미지 프롬프트 생성기
      </Typography> */}

      <Box // This Box will take up the available vertical space for image/loading/placeholder
        sx={{
          flex: 1, // Make this box take up available vertical space
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          mb: 4, // Keep existing margin-bottom
          position: 'relative',
          overflow: 'hidden' // Ensure content within this box also hides overflow
        }}
      >
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%', // Take full height of its parent (flex: 1 Box)
            width: '100%', // Take full width
            gap: 2
          }}>
            <CircularProgress size={60} />
            <Typography color="text.secondary">
              이미지 생성 중...
            </Typography>
          </Box>
        ) : image ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%', // Take full height of its parent (flex: 1 Box)
            width: '100%', // Take full width
            overflow: 'hidden' // Ensure image does not overflow this box
          }}>
            <img 
              src={image} 
              alt="Generated" 
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%', // Ensure image scales within its container
                objectFit: 'contain',
                borderRadius: '12px'
              }} 
            />
          </Box>
        ) : (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'grey.100',
            borderRadius: 1,
            height: '100%', // Take full height of its parent (flex: 1 Box)
            width: '100%' // Take full width
          }}>
            <Typography color="text.secondary">
              이미지를 생성해주세요
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label="단어 입력"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="단어를 입력하고 Enter를 누르세요"
          InputProps={{
            sx: {
              borderRadius: 13
            }
          }}
        />

        <Button 
          variant="contained" 
          onClick={handleAddWord}
          sx={{ 
            minWidth: '100px',
            borderRadius: 13,
            // color: 'white',
            backgroundColor: 'orange',
            '&:hover': {
              backgroundColor: '#AE6000',
            }
           }}
        >
          추가
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {selectedWords.map((word, index) => (
          <Chip
            key={index}
            label={word}
            onClick={() => onWordRemove(word)}
            onDelete={() => onWordRemove(word)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{ borderRadius: 13, width: '50%', backgroundColor: 'orange', '&:hover': { backgroundColor: '#AE6000' } }}
          variant="contained"
          color="secondary"
          onClick={onGenerate}
          disabled={selectedWords.length === 0 || isLoading}
        >
          {isLoading ? '생성 중...' : '이미지 생성하기'}
        </Button>
      </Box>

    </Paper>
  );
};

export default PromptGenerator; 