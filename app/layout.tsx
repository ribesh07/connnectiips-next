import './globals.css';

import type { ReactNode } from 'react';

export const metadata = {
  title: 'Next ConnectIPS',
  description: 'ConnectIPS integration with Next.js',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang='en'>
    <body className='h-screen flex items-center justify-center'>
      {children}
    </body>
  </html>
);

export default RootLayout;
