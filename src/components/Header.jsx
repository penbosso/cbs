import React from 'react';

const Header = ({ category, title }) => (
  <div className=" mb-4  dark:bg-secondary-dark-bg">
    <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      {title}
    </p>
  </div>
);

export default Header;
