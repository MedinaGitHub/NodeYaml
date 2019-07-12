const yaml = require('js-yaml');
const fs = require('fs');

import { Fruit, Promotions, Requirements, Tiers } from './models/models'

class Quotation {

  config: any;
  products: any = [];
  promo: Array<string> = ['one', 'two']

  constructor(config: any) {

    this.config = config
  }

  calculatePrice(product: Fruit, count: number) {
    var price = null;
    switch (product.price_model) {
      case 'fixed':
        price = product.price ? product.price * count : null;
        break;
      case 'tiered':
        product.tiers = product.tiers ? product.tiers : [];
        for (const tiers of product.tiers) {
          var tier = new Tiers(tiers.from, tiers.to, tiers.price);
          if (count >= tier.from && count <= tier.to) {
            price = tier.price * count;
          }
        }
        break;
      default:
        price = null;
        break;
    }
    return price;
  }

  addProduct(name: string, count: number) {

    var index = 0;
    if (this.products.length > 0) {
      index = this.products.map(function (e: any) { return e.name; }).indexOf(name);
      if (index != -1) {
        this.products[index].count += count;
      } else {
        this.products.push({ name, count })
      }
    } else {
      this.products.push({ name, count })
    }
  }

  calculeTotal() {

    var priceTotal: number = 0;
    var countTotal: number = 0;
    var error: boolean = false;
    var resultPrice = null;

    for (const prod of this.products) {
      var fruit = this.parseProduct(prod.name);
      if (fruit) {
        resultPrice = this.calculatePrice(fruit, prod.count);
      }

      if (resultPrice != null) {
        priceTotal += resultPrice
        countTotal += prod.count
      } else {
        error = true;
        break;
      }
    }
    if (error) {
      return 'error';
    }
    var total = this.calculatePromotions(priceTotal, countTotal);
    return total;
  }

  parseProduct(name: string) {

    var product = this.config.products[name];
    var fruit;
    switch (product.price_model) {
      case 'fixed':
        fruit = new Fruit(product.price_model, product.price);
        break;
      case 'tiered':
        fruit = new Fruit(product.price_model, undefined, product.tiers);
        break;
      default:
        fruit = null;
        break;
    }
    return fruit;

  }

  calculatePromotions(price: number, count: number) {

    var discounts: Array<number> = [];
    var promotions = this.config.promotions;
    var newPrice = 0;

    this.promo.forEach(namePromo => {

      var require = new Requirements(promotions[namePromo].requirements.min_units, promotions[namePromo].requirements.min_amount);
      var promo = new Promotions(promotions[namePromo].discount, require);

      if (require.min_amount && require.min_units) {
        if (require.min_amount <= price && require.min_units <= count) {
          discounts.push(price * promo.discount)
        }
      } else if (require.min_units) {
        require.min_units <= count ? discounts.push(price * promo.discount) : null;
      } else if (require.min_amount) {
        require.min_amount <= price ? discounts.push(price * promo.discount) : null;
      }
    });
    if (discounts.length > 0) {
      var arr = discounts;
      var max = Math.max(...arr);
      newPrice = price - max;
    } else {
      newPrice = price;
    }
    return newPrice;
  }
}

async function readData(): Promise<void> {
  try {
    var doc = await yaml.safeLoad(fs.readFileSync('./prices.yml', 'utf8'));
    return doc;
  }
  catch (err) {
    console.log('Error: ', err.message);
  }
}

function run() {
  try {
    var promise = readData();

    promise.then(result => {
      var object = new Quotation(result);

      object.addProduct('orange', 10);
      console.log(object.calculeTotal());
      object.addProduct('apple', 15);
      console.log(object.calculeTotal());
    });
  } catch (e) {
    console.log(e);
  }
}
run();

