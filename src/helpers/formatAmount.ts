const reverseString = (toReverse: string): string => {
  return toReverse.split("").reverse().join("");
};

const formatAmount = (amount: number, size: number, insert: string): string => {
  let formattedAmount: string = reverseString(amount.toString());
  const regex = new RegExp(".{1," + size + "}", "g");
  const matchResult: RegExpMatchArray | null = formattedAmount.match(regex);
  if (matchResult === null) {
    return "";
  }
  formattedAmount = matchResult.join(insert);
  return reverseString(formattedAmount);
};

export default formatAmount;
