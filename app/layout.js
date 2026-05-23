import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: 'Anjum Dentist | World-Class Dental Care in Karachi',
  description:
    'Painless, world-class dental care crafted with precision and artistry. From routine checkups to complete smile transformations — your comfort is our priority.',
  keywords:
    'dentist, dental care, teeth whitening, orthodontics, dental clinic, Karachi dentist, Anjum Dentist',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Anjum Dentist | World-Class Dental Care',
    description: 'Your Smile, Our Craft.',
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
