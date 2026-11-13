import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: '행운의 확률 | 로또 시뮬레이터', description: '매주 로또 100장, 1등에 당첨되기까지 얼마나 걸릴까요?' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
