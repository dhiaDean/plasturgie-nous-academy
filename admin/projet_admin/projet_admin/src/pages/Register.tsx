import React from 'react';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('register.title')}</h1>
      <p>{t('register.placeholderText')}</p>
    </div>
  );
};

export default Register;
