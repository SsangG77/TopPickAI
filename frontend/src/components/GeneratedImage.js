import React from 'react';
import { 
  Paper, 
  Box, 
  Typography,
  CircularProgress
} from '@mui/material';

const GeneratedImage = ({ image }) => {
  return (
    <Paper sx={{ p: 3 }} elevation={0}>
      {/* <Typography variant="h5" gutterBottom>
        생성된 이미지
      </Typography> */}
      
      <Box
        sx={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // bgcolor: 'grey.100',
          borderRadius: 1,
        }}
      >
        {image ? (
          <img 
            src={image} 
            alt="Generated" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '400px',
              objectFit: 'contain'
            }} 
          />
        ) : (
          <Typography color="text.secondary">
            이미지를 생성해주세요
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default GeneratedImage; 