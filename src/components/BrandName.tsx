import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface BrandNameProps {
  className?: string;
  withAcademy?: boolean;
}

export default function BrandName({ className = '', withAcademy = false }: BrandNameProps) {
  const { t } = useLanguage();
  return (
    <span translate="no" className={`notranslate ${className}`}>
      Real Builder{withAcademy ? t('brand.academy') : ''}
    </span>
  );
}
