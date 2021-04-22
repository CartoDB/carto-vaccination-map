import React from 'react';
import { Navigate } from 'react-router-dom';
import { OAuthCallback } from '@carto/react-auth';
import Main from 'components/views/Main';
import NotFound from 'components/views/NotFound';
import Vaccines from 'components/views/Vaccines.js';
// [hygen] Import views

const routes = [
  {
    path: '/',
    element: <Main />,
    children: [
      { path: '/', element: <Navigate to='/vaccination' /> },
      { path: '/vaccination', element: <Vaccines /> },

      // [hygen] Add routes
    ],
  },
  { path: '/oauthCallback', element: <OAuthCallback /> },
  { path: '404', element: <NotFound /> },
  //{ path: '*', element: <Navigate to='/404' /> },
  { path: '*', element: <Navigate to='/' /> }, // For deploying to GCS
];

export default routes;
