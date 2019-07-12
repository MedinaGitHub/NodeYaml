
export class Requirements {
  min_units?: number;
  min_amount?: number;
  constructor(min_units?: number, min_amount?: number) {
    this.min_amount = min_amount;
    this.min_units = min_units
  }
}

export class Tiers {
  from: number;
  to: number;
  price: number;
  constructor(from: number, to: number, price: number) {
    this.from = from;
    this.to = to;
    this.price = price;
  }
}

export class Fruit {
  price_model: string;
  price?: number;
  tiers?: Array<Tiers>;
  constructor(price_model: string, price?: number, tiers?: Array<Tiers>) {
    this.price_model = price_model;
    this.price = price;
    this.tiers = tiers;
  }
}

export class Promotions {
  discount: number;
  requirements: Requirements;
  constructor(discount: number, requirements: Requirements) {
    this.discount = discount;
    this.requirements = requirements;
  }
}

