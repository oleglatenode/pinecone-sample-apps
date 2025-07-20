"use client";

import Sidenav from '@/components/ui/sidenav';
import { WorkspaceChatProvider } from '../../lib/hooks/workspace-chat-context';
import { AuthProvider } from '../../lib/hooks/auth-context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WorkspaceChatProvider>
        <div className="flex h-screen bg-white">
          <Sidenav />
          <main className="flex-1 p-4 overflow-auto ">{children}</main>
        </div>
      </WorkspaceChatProvider>
    </AuthProvider>
  );
}