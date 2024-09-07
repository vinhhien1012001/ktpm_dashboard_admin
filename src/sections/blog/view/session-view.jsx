import axios from 'axios';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
// import Chip from '@mui/material/Chip';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import SessionDetail from '../session-detail';

// import SessionDetail from '../session-detail';

// ----------------------------------------------------------------------

export default function SessionView() {
  const [sessions, setSessions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newSession, setNewSession] = useState({ name: '', startTime: '', endTime: '' });
  const [selectedSession, setSelectedSession] = useState(null);
  const navigate = useNavigate();

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
              name
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

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSession = async () => {
    try {
      const mutation = `
        mutation CreateGameSession {
          createGameSession(
            name: "${newSession.name}"
            startTime: "${new Date(newSession.startTime).toISOString()}"
            endTime: "${new Date(newSession.endTime).toISOString()}"
          )
        }
      `;

      const response = await axios.post(
        'http://localhost:8080/graphql',
        {
          query: mutation,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.data.createGameSession) {
        setOpenDialog(false);
        setNewSession({ name: '', startTime: '', endTime: '' });
        fetchSessions();
      } else {
        console.error('Failed to create session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleDeleteSession = async (id) => {
    try {
      const hexId = id.replace(/^ObjectID\("(.*)"\)$/, '$1');

      console.log('Extracted id:', hexId);
      const mutation = `
        mutation DeleteGameSession($id: ID!) {
          deleteGameSession(id: $id)
        }
      `;

      const response = await axios.post(
        'http://localhost:8080/graphql',
        {
          query: mutation,
          variables: { id: hexId },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.data.deleteGameSession) {
        toast.success('Session deleted successfully');
        fetchSessions();
      } else {
        toast.error('Failed to delete session');
        console.error('Failed to delete session');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
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
          onClick={() => setOpenDialog(true)}
        >
          New Session
        </Button>
      </Stack>

      {/* List of sessions */}
      <List>
        {sessions.map((session) => (
          <ListItem
            key={session.id}
            button
            onClick={() => {
              const hexId = session.id.replace(/^ObjectID\("(.*)"\)$/, '$1');
              navigate(`/session/${hexId}`);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemText
              primary={session.name}
              secondary={session.status ? 'Opening' : 'Closed'}
            />
            <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSession(session.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Dialog for adding new session */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Session</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Session Name"
            fullWidth
            value={newSession.name}
            onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Start Time"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newSession.startTime}
            onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
          />
          {/* TextField for end time */}
          <TextField
            margin="dense"
            label="End Time"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newSession.endTime}
            onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSession}>Add</Button>
        </DialogActions>
      </Dialog>

      <SessionDetail
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onUpdate={fetchSessions}
      />
    </Container>
  );
}

SessionDetail.propTypes = {
  session: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

SessionDetail.defaultProps = {
  session: null,
};
