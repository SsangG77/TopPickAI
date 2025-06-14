import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  Box
} from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

const WordRanking = ({ onWordSelect }) => {
  const [rankedWords, setRankedWords] = useState([]);

  useEffect(() => {
    // Firebase Realtime Database에서 단어 랭킹 데이터 구독
    const wordsRef = ref(database, 'wordCounts');
    const unsubscribe = onValue(wordsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 데이터를 배열로 변환하고 카운트 기준으로 정렬
        const ranking = Object.entries(data)
          .map(([word, count]) => ({ word, count }))
          .sort((a, b) => b.count - a.count);
        setRankedWords(ranking);
      } else {
        setRankedWords([]);
      }
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 3, 
      height: '90vh',
      position: 'sticky',
      top: 0,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column'
    }} elevation={10}>
      <Typography variant="h5" gutterBottom>
        Ranking
      </Typography>
      
      <Box sx={{
        flex: 1,
        overflowY: 'auto'
      }}>
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
      </Box>
    </Paper>
  );
};

export default WordRanking; 