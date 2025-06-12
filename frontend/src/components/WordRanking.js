import React from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  Box
} from '@mui/material';

const WordRanking = ({ onWordSelect }) => {
  // TODO: 실제 데이터로 교체
  const [rankedWords] = React.useState([
    { word: 'beautiful', count: 150 },
    { word: 'landscape', count: 120 },
    { word: 'sunset', count: 100 },
    { word: 'nature', count: 90 },
    { word: 'art', count: 80 },
  ]);

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 3, 
      height: '100vh',  // Container의 py: 4(32px)를 고려한 높이
      // bgcolor: 'grey.100',
      position: 'sticky',
      top: 0
    }} elevation={0}>
      <Typography variant="h5" gutterBottom>
        인기 단어 랭킹
      </Typography>
      
      <List>
        {rankedWords.map((item, index) => (
          <ListItem 
            key={index}
            button
            onClick={() => onWordSelect(item.word)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>{item.word}</Typography>
                  <Typography color="text.secondary">
                    {item.count}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default WordRanking; 