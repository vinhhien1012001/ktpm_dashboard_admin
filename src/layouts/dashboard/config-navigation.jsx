import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const getNavConfig = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Check if user is authenticated
  const role = localStorage.getItem('role'); // Get user role

  console.log('isAuthenticated in NAV:', isAuthenticated); // Add this line
  console.log('role in NAV:', role); // Add this line

  return isAuthenticated
    ? [
        {
          title: 'dashboard',
          path: '/dashboard',
          icon: icon('ic_analytics'),
        },
        ...(role === 'admin'
          ? [
              {
                title: 'user',
                path: '/user',
                icon: icon('ic_user'),
              },
            ]
          : []),
        {
          title: 'My vouchers',
          path: '/products',
          icon: icon('ic_cart'),
        },
        {
          title: 'Session',
          path: '/session',
          icon: icon('ic_analytics'),
        },
      ]
    : [];
};

export default getNavConfig;
