import { ReactNode } from 'react';
import { ModalContent } from './styles';

interface GenericModalContentProps {
  children: ReactNode;
}

export function GenericModalContent({children}: GenericModalContentProps) {
  return <ModalContent>{children}</ModalContent>;
}