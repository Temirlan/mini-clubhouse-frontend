import Link from 'next/link';
import React from 'react';

interface Props {
  title: string;
  href: string;
}

export const BackButton: React.FC<Props> = ({ title, href }) => {
  return (
    <Link href={href}>
      <div className="d-flex mb-30 cup">
        <img src="/static/left-arrow.svg" alt="Back" width={24} className="mr-10" />
        <h3>{title}</h3>
      </div>
    </Link>
  );
};
