import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Anjum Dentist | Premium Dental Care',
  description:
    'Experience premium, painless dental care with cutting-edge technology. From routine checkups to complete smile transformations — your comfort is our priority.',
  keywords:
    'dentist, dental care, teeth whitening, orthodontics, dental clinic, Karachi dentist, Anjum Dentist',
  openGraph: {
    title: 'Anjum Dentist | Premium Dental Care',
    description: 'Your Smile Deserves the Best Care',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
