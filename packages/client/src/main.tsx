import { createRouter, RouterProvider } from '@tanstack/react-router';
// import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Set up deep link listener for OAuth callbacks
if (typeof window !== 'undefined' && '__TAURI__' in window) {
  import('@tauri-apps/plugin-deep-link').then(({ onOpenUrl }) => {
    onOpenUrl((urls) => {
      console.log('Deep link received:', urls);

      if (urls && urls.length > 0) {
        const url = urls[0];

        // Handle OAuth callback: bricks://auth-callback/github or bricks://auth-callback/google
        if (url.startsWith('bricks://auth-callback/')) {
          console.log('OAuth callback detected:', url);

          // Simply reload the page to trigger session refresh
          // The OAuth flow is already completed by the callback handler
          window.location.reload();
        }
      }
    });
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />,
  // </React.StrictMode>,
);
