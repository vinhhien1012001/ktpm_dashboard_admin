import axios from 'axios';
// import bcrypt from 'bcryptjs'; // Import bcrypt
import { useState } from 'react';

// ----------------------------------------------------------------------

import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

import { signInWithPopup } from 'firebase/auth';

// ----------------------------------------------------------------------
import { auth, provider } from 'src/firebaseConfig';

const GoogleSignInButton = ({ onClick, loading }) => (
  <button
    type="button"
    className="gsi-material-button"
    onClick={onClick}
    disabled={loading}
    style={{
      width: '100%',
      height: '40px',
      backgroundColor: '#fff',
      borderRadius: '4px',
      border: '1px solid #dadce0',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 12px',
    }}
  >
    {/* <div className="gsi-material-button-state" style={{ display: 'none' }}></div> */}
    <div
      className="gsi-material-button-content-wrapper"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <div className="gsi-material-button-icon" style={{ marginRight: '10px' }}>
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </div>
      <span
        className="gsi-material-button-contents"
        style={{ fontSize: '14px', fontWeight: '500' }}
      >
        Sign in with Google
      </span>
      <span style={{ display: 'none' }}>Sign in with Google</span>
    </div>
  </button>
);

GoogleSignInButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('result:', result);

      if (result.user) {
        const { user } = result;
        const token = await user.getIdToken();
        console.log('Token:', token);
        console.log('User:', user.email);
        console.log('LOGIN SUCCESS!');
        toast.success('Login Success!');

        localStorage.setItem('token', token);
        localStorage.setItem('isAuthenticated', 'true');

        // Query backend to get user details
        try {
          const response = await axios.post(
            'http://localhost:8080/graphql',
            {
              query: `
                query User($email: String!) {
                  user(email: $email) {
                    createdAt
                    dateOfBirth
                    email
                    facebookAccount
                    firebaseUID
                    gender
                    id
                    imageURL
                    name
                    phoneNumber
                    role
                    status
                    updatedAt
                    username
                  }
                }
              `,
              variables: {
                email: user.email,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.data.user) {
            const userData = response.data.data.user;
            console.log('User data from backend:', userData);

            // Store relevant user data in localStorage or state
            localStorage.setItem('role', userData.role);
          } else {
            console.error('User not found in backend');
            toast.error('User details not found. Please contact support.');
          }
        } catch (backendError) {
          console.error('Error fetching user data from backend:', backendError);
          toast.error('Error fetching user details. Please try again.');
        }

        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error during authentication', error);
      toast.error('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    // Implement registration logic here
    console.log('Register:', { username, email, password, phoneNumber, gender });
    setLoading(false);
  };

  const renderForm = (
    <>
      {/* <Stack spacing={3}>
        <TextField
          name="email"
          label="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack> */}

      {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover" sx={{ cursor: 'pointer' }}>
          Forgot password?
        </Link>
      </Stack> */}

      {/* <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleGoogleLogin}
        loading={loading}
        startIcon={<img src="/path/to/google-icon.png" alt="Google" width="20" height="20" />}
      >
        Sign in with Google
      </LoadingButton> */}

      <GoogleSignInButton onClick={handleGoogleLogin} loading={loading} />
    </>
  );

  const renderRegisterForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="phoneNumber"
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleRegister}
        loading={loading}
        sx={{ mt: 3 }}
      >
        Register
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{ mb: 5 }}>
            {isLogin ? 'Sign in' : 'Register'}
          </Typography>

          {isLogin ? renderForm : renderRegisterForm}

          <Button fullWidth size="large" sx={{ mt: 3 }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </Button>
        </Card>
      </Stack>
    </Box>
  );
}
