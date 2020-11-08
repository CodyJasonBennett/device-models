import React from 'react';
import Chevron from 'assets/icons/chevron.svg';
import Check from 'assets/icons/check.svg';
import RotateX from 'assets/icons/rotate-x.svg';
import RotateY from 'assets/icons/rotate-y.svg';
import RotateZ from 'assets/icons/rotate-z.svg';

export const icons = {
  chevron: Chevron,
  check: Check,
  rotateX: RotateX,
  rotateY: RotateY,
  rotateZ: RotateZ,
};

const Icon = ({ icon, ...rest }) => {
  const IconComponent = icons[icon];

  return (
    <IconComponent aria-hidden {...rest} />
  );
};

export default Icon;
