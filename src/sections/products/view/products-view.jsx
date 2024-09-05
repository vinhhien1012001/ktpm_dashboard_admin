import axios from 'axios';
import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import { storage } from '../../../firebaseConfig';
import ProductCartWidget from '../product-cart-widget';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = async (file) => {
    // const storage = getStorage();
    const storageRef = ref(storage, `voucher_images/${file.name}`);

    try {
      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      console.log('snapshot', snapshot);
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('downloadURL', downloadURL);
      // Here, you would typically save this URL to your database
      console.log('File available at', downloadURL);

      return downloadURL;
    } catch (err) {
      console.error('Error uploading image: ', err);
      throw err;
    }
  };

  const handleFileChange = async (event) => {
    // ------------------------------
    // Assuming you have a file input in your edit form
    const fileInput = document.querySelector('input[type="file"]');
    console.log('fileInput', fileInput.files[0]);
    if (fileInput && fileInput.files[0]) {
      try {
        const imageURL = await handleImageUpload(fileInput.files[0]);

        console.log('Image URL:', imageURL);
      } catch (err) {
        console.error('Error updating voucher:', err);
      }
    } else {
      console.log('No new image selected');
    }
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleEdit = (voucher) => {
    // Implement edit logic here
    console.log('Edit voucher:', voucher);
  };

  const handleDelete = (voucher) => {
    // Implement delete logic here
    console.log('Delete voucher:', voucher);
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          'http://localhost:8080/graphql',
          {
            query: `
              query GetAllVouchers {
                getAllVouchers {
                  code
                  description
                  expiredDate
                  id
                  imageURL
                  value
                }
              }
            `,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.data && response.data.data.getAllVouchers) {
          console.log('Vouchers:', response.data.data.getAllVouchers);
          setVouchers(response.data.data.getAllVouchers);
        } else {
          setError('Failed to fetch vouchers');
        }
      } catch (err) {
        console.error('Error fetching vouchers:', err);
        setError('An error occurred while fetching vouchers');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

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
        VOUCHERS
      </Typography>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <ProductSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {vouchers.map((voucher) => (
          <Grid key={voucher.id} xs={12} sm={6} md={3}>
            <ProductCard product={voucher} onEdit={handleEdit} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>

      <ProductCartWidget />
    </Container>
  );
}
