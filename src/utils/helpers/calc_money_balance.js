const calcUserMoneyBalancePurchase = (user, ticket) => {
  const ticketPrice = ticket.ticket_price;
  let currentBalance = user.money_balance;

  if (currentBalance < ticketPrice) {
    throw new Error(
      "Insufficient funds. User does not have enough money to buy this ticket"
    );
  } else {
    currentBalance -= ticketPrice;

    return currentBalance;
  }
};

const calcUserMoneyBalanceRefund = (user, ticket) => {
  const ticketPrice = ticket.ticket_price;
  let currentBalance = user.money_balance;

  return (currentBalance += ticketPrice);
};

export { calcUserMoneyBalancePurchase, calcUserMoneyBalanceRefund };
