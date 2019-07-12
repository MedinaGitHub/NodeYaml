# Start Proyect

npm install

npm run dev -> development environment

# Add Products

      object.addProduct('orange', 10); // add  orange 
      console.log(object.calculeTotal()); // result total
      object.addProduct('apple', 15); // add apple
      console.log(object.calculeTotal()); // result total

# Add New Products
    //YML
    orange:
    price_model: fixed
    price: 12

    banana:
    price_model: fixed
    price: 1
   
    //index.ts
     object.addProduct('banana', 15); // add apple
     console.log(object.calculeTotal()); // result total



## License
[MIT](https://choosealicense.com/licenses/mit/)