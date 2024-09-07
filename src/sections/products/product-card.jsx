import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product, onEdit, onDelete }) {
  const renderImg = (
    <Box
      component="img"
      alt={product.description}
      src={product.imageURL !== 'null' ? product.imageURL : '/assets/images/products/voucher.jpg'}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      &nbsp;
      {product.value && `-${product.value * 100}%`}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>{renderImg}</Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography color="inherit" variant="subtitle1" noWrap sx={{ fontSize: '1.1rem' }}>
            {product.description.length > 20
              ? `${product.description.substring(0, 20)}...`
              : product.description}
          </Typography>
          {renderPrice}
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Code: {product.code}
          </Typography>
          <Stack direction="row">
            <IconButton onClick={() => onEdit(product)} size="small" color="primary">
              <EditIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton onClick={() => onDelete(product)} size="small" color="error">
              <DeleteIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
