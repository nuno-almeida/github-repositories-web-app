export const formatCounterDisplayValue = (value) => {
  if (value < 1000) {
    return "" + value;
  }

  const calculateValue = value / 1000;

  let fractionDigits = 1;
  if (("" + calculateValue).indexOf(".") >= 3) {
    fractionDigits = 0;
  }

  let returnValue = (value / 1000).toFixed(fractionDigits);
  if (returnValue.endsWith(".0")) {
    returnValue = returnValue.replace(".0", "");
  }
  
  return returnValue + "k";
};
