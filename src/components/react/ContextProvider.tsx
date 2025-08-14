// src/components/react/ContextProvider.tsx
import type { ReactNode } from 'react';
import { AuthProvider } from '../../context/Auth';

export const ContextProvider = ({ children }: { children: ReactNode }) => {
    return <AuthProvider>{children}</AuthProvider>;
};