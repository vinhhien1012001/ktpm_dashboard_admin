import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { toast } from 'react-toastify';
import { storage } from '../../firebaseConfig';

export default function SessionDetail({ session, onClose, onUpdate }) {
  const [rewards, setRewards] = useState([]);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    type: '',
    value: '',
    imageURL: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (session) {
      fetchRewards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `voucher_images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const fetchRewards = async () => {
    if (!session) return;

    try {
      const hexId = session.id.replace(/^ObjectID\("(.*)"\)$/, '$1');
      console.log('hexId', hexId);
      const response = await axios.post(
        'http://localhost:8080/graphql',
        {
          query: `
              query GetGameSessionByID($id: ID!) {
                getGameSessionByID(id: $id) {
                  endTime
                  id
                  name
                  rewards
                  startTime
                  status
                }
              }
            `,
          variables: { id: hexId },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('response', response);
      console.log('response', response.data.data.getGameSessionByID.rewards);
      setRewards(response.data.data.getGameSessionByID.rewards || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  const handleAddReward = async () => {
    try {
      let imageURL = newReward.imageURL;
      if (imageFile) {
        imageURL = await handleImageUpload(imageFile);
        console.log('imageURL', imageURL);
      }

      // const response = await axios.post(
      //   'http://localhost:8080/graphql',
      //   {
      //     query: `
      //       mutation AddRewardToGameSession($gameSessionID: ID!, $rewardInput: RewardInput!) {
      //         addRewardToGameSession(gameSessionID: $gameSessionID, rewardInput: $rewardInput)
      //       }
      //     `,
      //     variables: {
      //       gameSessionID: session.id,
      //       rewardInput: { ...newReward, imageURL },
      //     },
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem('token')}`,
      //     },
      //   }
      // );
      // if (response.data.data.addRewardToGameSession) {
      //   toast.success('Reward added successfully');
      //   setNewReward({ name: '', description: '', type: '', value: '', imageURL: '' });
      //   setImageFile(null);
      //   fetchRewards();
      //   onUpdate();
      // }
    } catch (error) {
      console.error('Error adding reward:', error);
      toast.error('Failed to add reward');
    }
  };

  //   const handleDeleteReward = async (rewardId) => {
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:8080/graphql',
  //         {
  //           query: `
  //             mutation RemoveRewardFromGameSession($gameSessionID: ID!, $rewardID: String!) {
  //               removeRewardFromGameSession(gameSessionID: $gameSessionID, rewardID: $rewardID)
  //             }
  //           `,
  //           variables: { gameSessionID: session.id, rewardID: rewardId },
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //         }
  //       );
  //       if (response.data.data.removeRewardFromGameSession) {
  //         toast.success('Reward removed successfully');
  //         fetchRewards();
  //         onUpdate();
  //       }
  //     } catch (error) {
  //       console.error('Error removing reward:', error);
  //       toast.error('Failed to remove reward');
  //     }
  //   };

  return (
    <Dialog open={!!session} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{session?.name} - Rewards</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', height: '70vh' }}>
          <div style={{ flex: 1, overflowY: 'auto', marginRight: '20px' }}>
            <List>
              {rewards.map((reward) => (
                <ListItem
                  key={reward.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => console.log('delete', reward)}
                      // onClick={() => handleDeleteReward(reward.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={reward.name}
                    secondary={`${reward.type} - ${reward.value}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
          <div style={{ flex: 1 }}>
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
            <Button
              onClick={handleAddReward}
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '10px' }}
            >
              Add Reward
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

SessionDetail.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  newReward: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    imageURL: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
