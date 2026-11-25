import assert from 'node:assert/strict';
import { BASE_CURRENCY, convertFromBase } from '../src/lib/currency';
import { readStripeMoneyConfig, toStripeMinorUnits } from '../src/lib/stripeMoney';

assert.equal(BASE_CURRENCY, 'MAD');
assert.equal(convertFromBase(79, 'MAD'), 79);
assert.equal(convertFromBase(79, 'USD'), 7.9);
assert.equal(convertFromBase(79, 'EUR'), 7.35);
assert.equal(convertFromBase(0, 'MAD'), 0);

assert.throws(
  () => readStripeMoneyConfig({}),
  /STRIPE_PRESENTMENT_CURRENCY/
);

const madConfig = readStripeMoneyConfig({ STRIPE_PRESENTMENT_CURRENCY: 'mad' });
assert.equal(madConfig.currency, 'mad');
assert.equal(toStripeMinorUnits(79, madConfig), 7900);

const usdConfig = readStripeMoneyConfig({
  STRIPE_PRESENTMENT_CURRENCY: 'usd',
  STRIPE_MAD_TO_USD_RATE: '0.1',
});
assert.equal(usdConfig.currency, 'usd');
assert.equal(toStripeMinorUnits(79, usdConfig), 790);

assert.throws(
  () => readStripeMoneyConfig({ STRIPE_PRESENTMENT_CURRENCY: 'usd' }),
  /STRIPE_MAD_TO_USD_RATE/
);

console.log('currency and stripe money checks passed');
