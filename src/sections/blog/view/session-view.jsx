import axios from 'axios';
import React, { useState, useEffect } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { posts } from 'src/_mock/blog';

import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------

export default function SessionView() {
  const [sessions, setSessions] = useState([]);
  // const [openDialog, setOpenDialog] = useState(false);
  // const [newSession, setNewSession] = useState({ name: '', startTime: '' });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/graphql',
        {
          query: `
          query getAllGameSession {
            getAllGameSession {
              endTime
              id
              rewards
              startTime
              status
            }
          }
        `,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(response.data.data.getAllGameSession);
      const sortedSessions = response.data.data.getAllGameSession.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
      console.log('sortedSessions', sortedSessions);
      setSessions(sortedSessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleAddSession = async () => {
    try {
      await axios.post(
        'http://localhost:8080/graphql',
        {
          query: `
          mutation CreateGameSession {
            createGameSession
          }
        `,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // setOpenDialog(false);
      // setNewSession({ name: '', startTime: '' });
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">SESSION</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAddSession}
        >
          New Session
        </Button>
      </Stack>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <PostSearch posts={posts} />
        <PostSort
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
      </Stack>
      <List>
        {sessions.map((session) => (
          <ListItem key={session.id} button>
            <ListItemText
              primary={session.name}
              secondary={new Date(session.startTime).toLocaleString()}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit">
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* <Grid container spacing={3}>
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </Grid> */}
    </Container>
  );
}
