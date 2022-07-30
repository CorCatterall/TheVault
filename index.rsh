'reach 0.1';

const COUNTDOWN = 20;

const Common = {
  showTime: Fun([UInt], Null),
};

export const main = Reach.App(() => {
  const A = Participant('Alice', {
    // Specify Alice's interact interface here
    ...Common,
    stash: UInt,
    getStatus: Fun([], Bool),
  });
  const B = Participant('Bob', {
    // Specify Bob's interact interface here
    ...Common,
    acceptTerms: Fun([UInt], Bool),
  });
  init();
  // The first one to publish deploys the contract
  A.only(() => {
    const payout = declassify(interact.stash);
})
  A.publish(payout)
    .pay(payout);
  commit();

  // The second one to publish always attaches
  B.only(() => {
    const terms = declassify(interact.acceptTerms(payout));
})
  B.publish(terms);
  commit();

  each([A, B], () => {
    interact.showTime(COUNTDOWN);
  });

  A.only(() => {
    const stillHere = declassify(interact.getStatus());
  })
  A.publish(stillHere)

  if(stillHere){
    transfer(payout).to(A);
  } else {
    transfer(payout).to(B);
  }
  // write your program here
  commit()
  exit();
});
