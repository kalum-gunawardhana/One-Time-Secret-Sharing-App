import React from 'react';
import ViewSecretForm from '../components/ViewSecretForm';

const SecretPage: React.FC = () => {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <ViewSecretForm />
    </div>
  );
};

export default SecretPage;