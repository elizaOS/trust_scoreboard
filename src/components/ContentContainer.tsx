import { FC, ReactNode } from 'react';
import Link from "next/link";
import Text from './Text';
import NavElement from './nav-element';

interface Props {
  children: React.ReactNode;
}

export const ContentContainer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex-1 container mx-auto px-4 md:px-6">
      <div className="h-full w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};
