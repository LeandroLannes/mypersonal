import './globals.css';
export const metadata = {
  title: 'Trainer',
  description: 'Personal trainer app',
  manifest: '/manifest.json',
  icons: { icon: '/icon-192.png', apple: '/icon-192.png' },
};
export const viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#18181B',
};
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/android-chrome-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Trainer" />
      </head>
      <body>{children}</body>
    </html>
  );
}