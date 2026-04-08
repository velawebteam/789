import React from 'react';

interface BrandNameProps {
  className?: string;
  withAcademy?: boolean;
}

export default function BrandName({ className = '', withAcademy = false }: BrandNameProps) {
  return (
    <span translate="no" className={`notranslate ${className}`}>
      Real Builder{withAcademy ? ' Academy' : ''}
    </span>
  );
}
