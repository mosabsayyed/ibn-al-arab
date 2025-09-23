import React from 'react';
const PageLayout: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto py-8 flex-1"> 
        {title ? <h1 className="text-2xl font-bold mb-4">{title}</h1> : null}
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
