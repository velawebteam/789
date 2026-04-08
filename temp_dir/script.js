const fs = require('fs');
const path = require('path');

const enJson = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace {t('key')} with value
  content = content.replace(/\{t\('([^']+)'\)\}/g, (match, key) => {
    const value = getNestedValue(enJson, key);
    return value ? value : match;
  });

  // Replace t('key') with 'value'
  content = content.replace(/t\('([^']+)'\)/g, (match, key) => {
    const value = getNestedValue(enJson, key);
    return value ? `'${value.replace(/'/g, "\\'")}'` : match;
  });

  // Replace placeholder={t('key')} with placeholder="value"
  content = content.replace(/placeholder=\{t\('([^']+)'\)\}/g, (match, key) => {
    const value = getNestedValue(enJson, key);
    return value ? `placeholder="${value.replace(/"/g, '&quot;')}"` : match;
  });

  // Remove import { useTranslation } from 'react-i18next';
  content = content.replace(/import \{ useTranslation \} from 'react-i18next';\n/g, '');
  
  // Remove const { t } = useTranslation();
  content = content.replace(/\s*const \{ t \} = useTranslation\(\);\n/g, '');

  fs.writeFileSync(filePath, content);
  console.log(`Processed ${filePath}`);
}

const files = [
  'src/components/EnrollmentModal.tsx',
  'src/components/Hero.tsx',
  'src/components/Navbar.tsx',
];

files.forEach(processFile);
