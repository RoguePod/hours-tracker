export const formatPhoneNumber = (value) => {
  if (!value) {
    return value;
  }

  const onlyNums = value.replace(/[^\d]/g, '');

  if (onlyNums.length <= 3) {
    return onlyNums;
  }

  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  }

  return (
    `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`
  );
};

export const formatCardNumber = (value) => {
  if (!value) {
    return value;
  }

  return value.replace(/[^\d]/g, '')
    .match(/.{1,4}/g)
    .join(' ');
};

export const formatDate = (value, previousValue) => {
  if (!value) {
    return value;
  }

  const onlyNums     = value.replace(/[^\d]/g, '');
  const previousNums = (previousValue || '').replace(/[^\d]/g, '');

  if (onlyNums.length <= 1) {
    return onlyNums;
  }

  if (onlyNums.length <= 2) {
    if (previousNums.length === 1) {
      return `${onlyNums}/`;
    }

    return onlyNums;
  }

  if (onlyNums.length <= 4) {
    if (previousNums.length === 3) {
      return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}/`;
    }

    return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}`;
  }

  return (
    `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}/${onlyNums.slice(4, 8)}`
  );
};

export const formatFloatPositive = (value) => {
  if (!value) {
    return value;
  }

  return String(value).replace(/[^0-9.]/g, '');
};
