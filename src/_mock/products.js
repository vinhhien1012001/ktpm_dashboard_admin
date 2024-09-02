import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'MoMo Voucher',
  'Shopee Voucher',
  'Lazada Voucher',
  'Tiki Voucher',
  'Grab Voucher',
  'Adidas Voucher',
  'VinID Voucher',
  'Nike Voucher',
];
const VOUCHER_BRAND = ['Pharmacity', 'Shopee', 'Lazada', 'Tiki', 'Grab', 'Adidas', 'VinID', 'Nike'];
const DISCOUNT_PERCENTAGES = [10, 15, 20, 25, 30, 50];

// ----------------------------------------------------------------------

export const products = [...Array(1)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: faker.string.uuid(),
    cover: `/assets/images/products/product_${setIndex}.jpg`,
    name: PRODUCT_NAME[index],
    brand: VOUCHER_BRAND[index],
    price: faker.number.int({ min: 4, max: 99, precision: 0.01 }),
    priceSale: setIndex % 3 ? null : faker.number.int({ min: 19, max: 29, precision: 0.01 }),
    discountPercentage:
      index % 2 !== 0
        ? faker.helpers.arrayElement(DISCOUNT_PERCENTAGES)
        : faker.helpers.arrayElement(DISCOUNT_PERCENTAGES),
    // colors:
    //   (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
    //   (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
    //   (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
    //   (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
    //   (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
    //   (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
    //   PRODUCT_COLOR,
    status: sample(['sale', 'new', '', '']),
  };
});
