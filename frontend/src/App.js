import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Paper, Typography } from '@mui/material';
import PromptGenerator from './components/PromptGenerator';
import WordRanking from './components/WordRanking';
import GeneratedImage from './components/GeneratedImage';

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

  const handleWordSelect = (word) => {
    setSelectedWords(prev => [...prev, word]);
  };

  const handleWordRemove = (word) => {
    setSelectedWords(prev => prev.filter(w => w !== word));
  };

  const handleGenerate = async () => {
    try {
      // TODO: 백엔드 API 호출하여 이미지 생성
      console.log('Generating image with words:', selectedWords);
      // 임시로 더미 이미지 URL 설정
      setGeneratedImage('https://via.placeholder.com/400x400');
    } catch (error) {
      console.error('이미지 생성 중 오류 발생:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 4, bgcolor: '#f5f5f5', width: '100%', maxWidth: '100% !important', px: 0 }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ width: '25%' }}>
            <WordRanking onWordSelect={handleWordSelect} />
          </div>
          <div style={{ width: '75%' }}>
            <Paper sx={{ p: 3 }}>
              <GeneratedImage image={generatedImage} />
              <PromptGenerator 
                selectedWords={selectedWords}
                onWordRemove={handleWordRemove}
                onGenerate={handleGenerate}
                onWordSelect={handleWordSelect}
              />
            </Paper>
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
