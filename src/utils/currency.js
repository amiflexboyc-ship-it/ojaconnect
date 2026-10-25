// Currency helper for Nigerian Naira (₦)
export const NAIRA = '\u20A6';

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG').format(price || 0);
};

export const formatNaira = (price) => {
  return `${NAIRA}${formatPrice(price)}`;
};
