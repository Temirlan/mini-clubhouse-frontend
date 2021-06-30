import clsx from 'clsx';
import React, { ButtonHTMLAttributes, FC } from 'react';

import styles from './Button.module.scss';

const colors = {
  green: styles.buttonGreen,
  gray: styles.buttonGray,
  blue: styles.buttonBlue,
};

interface Props {
  color?: keyof typeof colors;
}

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & Props> = ({
  children,
  disabled,
  color,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(className, styles.button, colors[color])}
      disabled={disabled}>
      {children}
    </button>
  );
};
