import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);
const {standardUnit} = stdlib;

const startingBalance = stdlib.parseCurrency(100);

const accBob  =
  await stdlib.newTestAccount(startingBalance);

  const accAlice  =
  await stdlib.newTestAccount(stdlib.parseCurrency(6000));

console.log('Hello, Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const statusArray = ["I'm not here", "I'm still here"];

const getBalance = async (who) => stdlib.formatCurrency((await stdlib.balanceOf(who)));
console.log(`Alice starts out with ${await getBalance(accAlice)} ${standardUnit}`);
console.log(`Bob starts out with ${await getBalance(accBob)} ${standardUnit}`);

const Common = (Who) => ({
  ...stdlib.hasRandom,
  showTime: (t) => {
    //parseInt
    console.log(`${Who} sees COUNTDOWN ${parseInt(t)}`); 
  },
});

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...Common('Alice'),
    stash: stdlib.parseCurrency(5000),
    getStatus: () => {
      const status = Math.floor(Math.random() + 0.5);
      console.log(`Alice's status: ${statusArray[status]}`);
      return (status == 0 ? false : true);
    },
  }),

  backend.Bob(ctcBob, {
    ...Common('Bob'),
    acceptTerms: (num) => {
      console.log(`Bob accepts the terms for a possible payout of ${stdlib.formatCurrency(num)}`);
      return true;
    }
  }),
]);

console.log(`Alice ends up with ${await getBalance(accAlice)} ${standardUnit}`);
console.log(`Bob ends up with ${await getBalance(accBob)} ${standardUnit}`);

console.log('Goodbye, Alice and Bob!');
