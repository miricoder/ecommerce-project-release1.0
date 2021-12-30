import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  //For storing data using Web Storage API - to prevent item loss in upon page refresh and login 
  //Session Storage is a reference to web browser's session storage not that of HttpSession 
  // storage: Storage = sessionStorage; --> Items are lost when tab or the browser is closed

  storage: Storage = localStorage; //Unlick Session storage items are not lost when tab or browser is closed 


  //Subject si replaced with BehaviorSubject in order to replay the latest message to CheckoutComponent cart review method
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { 
    //read data from storage - Web Storage API 
    //cartItems is the key, JSON.parse(...) - Reads JSON string and converst to object 
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;
      //compute totals based on the data that is read from storage 
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id


      //>>>>>>>Below For loop has been refactored to a one line code with using find() method which handles looping on the background
      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      //<<<<<<<<Refactored code below
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;




      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if (alreadyExistsInCart) {
      // increment the quantity
      existingCartItem.quantity++;
    }
    else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    //publish the new values ... all subscribers will receieve the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    //Calling persistCartItems to persist cart data 
    this.persistCartItems();
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the carts');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`)
    console.log('----')
  }
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();

    }
  }
  remove(theCartItem: CartItem) {
    // get the index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == theCartItem.id);
    // if found, remove the item from the array at the given index 
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  //Used for the persisting data in Web Storage API 
  persistCartItems(){
    //cartItems -> KEY 
    //this.cartItems -> VALUE 
    //JSON.stringify(...) Converts object to JSON string 
    //- because with Web Storage API everything is a string 
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));

  }
}
