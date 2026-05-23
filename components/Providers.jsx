'use client';

import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{ top: 90 }}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid rgba(20,184,166,0.4)',
            borderRadius: '12px',
            padding: '14px 18px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          },
          success: {
            iconTheme: {
              primary: '#14b8a6',
              secondary: '#0f172a',
            },
            style: {
              border: '1px solid rgba(20,184,166,0.5)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0f172a',
            },
            style: {
              border: '1px solid rgba(239,68,68,0.4)',
            },
          },
        }}
      />
    </>
  );
}
