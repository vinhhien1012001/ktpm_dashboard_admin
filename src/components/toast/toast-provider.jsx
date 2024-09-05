import React from 'react';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function ToastProvider({ children }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastProvider;
