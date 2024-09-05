import { Helmet } from 'react-helmet-async';

import { SessionView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function SessionPage() {
  return (
    <>
      <Helmet>
        <title> SESSION | DASHBOARD </title>
      </Helmet>

      <SessionView />
    </>
  );
}
