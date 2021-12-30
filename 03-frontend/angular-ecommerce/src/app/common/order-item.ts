import { CartItem } from "./cart-item";

export class OrderItem {
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    productId: string;

    /***Constructing OrderItem based off of CartItem data */
    /***Used in Checkout Form when building Purchase to send to the backends*/
    constructor(cartItem: CartItem){
        this.imageUrl = cartItem.imageUrl;
        this.unitPrice = cartItem.unitPrice;
        this.quantity = cartItem.quantity;
        this.productId = cartItem.id;
    }
}
