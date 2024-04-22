const calcUserMoneyBalancePurchase = (user, ticket) => {
  const ticketPrice = ticket.ticket_price;
  let userMoneyBalance = user.money_balance;

  if (userMoneyBalance < ticketPrice) {
    return `Insufficient funds. User does not have enough money to buy this ticket`;
  } else {
    return (userMoneyBalance -= ticketPrice);
  }
};

const calcUserMoneyBalanceRefund = (user, ticket) => {
  const ticketPrice = ticket.ticket_price;
  let userMoneyBalance = user.money_balance;

  return (userMoneyBalance += ticketPrice);
};

export { calcUserMoneyBalancePurchase, calcUserMoneyBalanceRefund };
