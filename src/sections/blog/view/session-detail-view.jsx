import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
// import CircularProgress from '@mui/material/CircularProgress';

// import RewardCard from '../reward-card';
import { storage } from '../../../firebaseConfig';

export default function SessionDetailView() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    type: '',
    value: '',
    imageURL: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('id: ', id);
    fetchSessionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchSessionDetails = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/graphql',
        {
          query: `
            query GetGameSessionByID($id: ID!) {
              getGameSessionByID(id: $id) {
                id
                name
                startTime
                endTime
                status
                rewards {
                  id
                  name
                  description
                  type
                  value
                  imageURL
                }
              }
            }
          `,
          variables: { id },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('response: ', response);
      if (response.data.data) {
        const sessionData = response.data.data.getGameSessionByID;
        setSession(sessionData);
        setRewards(sessionData.rewards || []);
      }
      //   const sessionData = response.data.data.getGameSessionByID;
      //   setSession(sessionData);
      //   setRewards(sessionData.rewards || []);
    } catch (err) {
      console.error('Error fetching session details:', err);
      setError('An error occurred while fetching session details');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `reward_images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleAddReward = async () => {
    setIsLoading(true);
    try {
      let image = newReward.imageURL;
      if (imageFile) {
        image = await handleImageUpload(imageFile);
      }

      console.log('imageURL: ', image);

      console.log('newReward: ', newReward);

      console.log('id: ', id);

      const response = await axios.post(
        'http://localhost:8080/graphql',
        {
          query: `
            mutation CreateReward {
              createReward(
                value: "${newReward.value}"
                name: "${newReward.name}"
                gameId: "${id}"
                image: "${image}"
                description: "${newReward.description || ''}"
                type: "${newReward.type || ''}"
              )
            }
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('response: ', response);

      if (response.data.data.createReward) {
        // Assuming the mutation returns the ID of the created reward
        const newRewardId = response.data.data.createReward;
        // You might want to fetch the full reward details or update the UI accordingly
        fetchSessionDetails(); // Refresh the rewards list
        setOpenDialog(false);
        toast.success('Reward added successfully');
        setNewReward({ name: '', description: '', type: '', value: '', image: '' });
        setImageFile(null);
      }
    } catch (err) {
      console.error('Error adding reward:', err);
      toast.error('Error adding reward:', err);
    } finally {
      setIsLoading(false);
    }
  };

  //   const handleDeleteReward = async (rewardId) => {
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:8080/graphql',
  //         {
  //           query: `
  //             mutation RemoveRewardFromGameSession($gameid: ID!, $rewardID: ID!) {
  //               removeRewardFromGameSession(gameid: $gameid, rewardID: $rewardID)
  //             }
  //           `,
  //           variables: { gameid: id, rewardID: rewardId },
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //         }
  //       );

  //       if (response.data.data.removeRewardFromGameSession) {
  //         setRewards(rewards.filter((reward) => reward.id !== rewardId));
  //       }
  //     } catch (err) {
  //       console.error('Error removing reward:', err);
  //     }
  //   };

  if (loading) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error" sx={{ mb: 5 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        {/* {session.name} - Rewards */}
        REWARDS
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 3 }}
      >
        Add New Reward
      </Button>

      {/* <Grid container spacing={3}>
        {rewards.map((reward) => (
          <Grid key={reward.id} xs={12} sm={6} md={3}>
            <RewardCard reward={reward} onDelete={handleDeleteReward} />
          </Grid>
        ))}
      </Grid> */}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Reward</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={newReward.name}
            onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newReward.description}
            onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="Type"
            value={newReward.type}
            onChange={(e) => setNewReward({ ...newReward, type: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Value"
            value={newReward.value}
            onChange={(e) => setNewReward({ ...newReward, value: e.target.value })}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            style={{ margin: '10px 0' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddReward} disabled={isLoading}>
            {isLoading ? (
              <>
                <CircularProgress size={24} color="inherit" />
                Adding...
              </>
            ) : (
              'Add'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
