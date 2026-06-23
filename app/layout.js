import './globals.css';
export const metadata = {
  title: 'Trainer',
  description: 'Personal trainer app',
  manifest: '/manifest.json',
};
export const viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#18181B',
};
export default function RootLayout({ children }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
