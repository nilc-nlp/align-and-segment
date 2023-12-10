import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-light-blue-200 border-t border-dark-blue-400 p-4 fixed inset-x-0 bottom-0">
      {/* Footer content goes here */}
      <p className="text-center text-gray-700 text-sm">
        &copy; {new Date().getFullYear()} ViMo. All rights reserved.
      </p>
    </footer>
  );
};


export default Footer;