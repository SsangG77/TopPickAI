import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Paper, Typography } from '@mui/material';
import PromptGenerator from './components/PromptGenerator';
import WordRanking from './components/WordRanking';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [selectedWords, setSelectedWords] = React.useState([]);
  const [generatedImage, setGeneratedImage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleWordSelect = (word) => {
    setSelectedWords(prev => [...prev, word]);
  };

  const handleWordRemove = (word) => {
    setSelectedWords(prev => prev.filter(w => w !== word));
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      const prompt = selectedWords.join(', ');
      const response = await axios.post(`${API_URL}/api/generate-image`, {
        prompt
      });

      if (response.data.success) {
        setGeneratedImage(`data:image/png;base64,${response.data.image}`);
      } else {
        console.error('이미지 생성 실패:', response.data.error);
      }
    } catch (error) {
      console.error('이미지 생성 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 4, bgcolor: '#FFC278', width: '100%', maxWidth: '100% !important', px: 0 }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ width: '20%' }}>
            <WordRanking onWordSelect={handleWordSelect} />
          </div>
          <div style={{ width: '75%' }}>
            {/* <Paper sx={{ p: 3, borderRadius: 7, height: '100vh' }} elevation={0}> */}
              <PromptGenerator 
                selectedWords={selectedWords}
                onWordRemove={handleWordRemove}
                onGenerate={handleGenerate}
                onWordSelect={handleWordSelect}
                image={generatedImage}
                isLoading={isLoading}
              />
            {/* </Paper> */}
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;