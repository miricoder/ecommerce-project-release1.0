import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  //Used for prepopulating the email field when checking out 
  storage: Storage = sessionStorage;

  //[STRIPE]Initializinig STRIPE API and PaymentInfo DTO 
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo  = new PaymentInfo();
  //[STRIPE]Set up a reference for cardEelement and displayError
  cardEelement: any;
  displayError: any="";

  //1: Inject FormBuilder group using the constructor 
  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {
    //[STRIPE] - Set up Stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();
      //Used for prepopulating the email field when checking out 
      /*read the user's email address from browser storage*/
      const theEmail = JSON.parse(this.storage.getItem('userEmail')!)

    //2: Build the Form 
    // -> customer - key for the group (FormGroup name)
    // -> firstName,lastName,email - FormControl names, these are the form fields 
    // -> Empty brackets or value for the fields - FormControl initial value empty string 
    //3: Every control group name contain validations as well which starts with creating new FormControl() initial 
    //    value which is empty 
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail,
          //Using Validators.pattern instead of Validators.email in order to verify actual email domains 
          [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
       //Replaced by Stripe code
        /* cardType: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        nameOnCard: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']*/

      })
    });
    // populate credit card months
    //Replaced by Stripe code
    /*const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  
    // populate credit card years

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
*/


    // populate countries

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }
  setupStripePaymentForm() {
    //Get a handle to stripe elements
    var element = this.stripe.elements();
    
    //Create a card Element ... customize it to hide zip-code field
    this.cardEelement = elements.create('card', {hidePosalCode: true});

    //Add an instance of card UI component into the 'card-element' div
    this.cardEelement.mount('#card-element');

    //Add event binding for the 'change' event on the card element
    this.cardEelement.on('change', (event: any) => {
      // get a handle to card-errors element 
      this.displayError = document.getElementById('card-errors');

      if(event.complete){
        this.displayError.textContent = "";
      }else if(event.error){
        //Show validation error to customer
        this.displayError.textContent = event.error.message;
        
      }
    });

    
  }
  //Pub/Sub latest Price, Shipping Details and Quantity in Review Cart Details 
  reviewCartDetails() {

    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }
  /****
       * VALIDATIONs - Getter Methods */
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  //Shipping
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipcode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  //Billing
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipcode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  //Credit Card Details 
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardnameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }


  copyShippingAddressToBillingAddress(event: any) {
    //If Billing address is same as Shippinhg copy Shipping over to Billing 
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      //bug fiz code for states (discovered on Nov 28 21 8:14AM / States are not Auto populating when checkbox is selected)
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      //If not then reset back to blank forum so billing information can be entered 
      this.checkoutFormGroup.controls.billingAddress.reset();

      //bug fiz code for states (discovered on Nov 28 21 8:14AM / States are not Auto populating when checkbox is selected)
      //to clear billing states when nothing is selected 
      this.billingAddressStates = [];
    }

  }
  //3: Method to call when submit button is clicked - Event Handling 
  onSubmit() {
    console.log("Handling the submit button");
    // [+] Checking ng validations upon submit 
    //    [-] Touching all fields triggers the display of the error messages 
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    /***Saving order details to the back end steps for onSubmit Button are below*/

    /*[1] - set up order*/ 
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    
    /*[2] - get cart items*/ 
    const cartItems = this.cartService.cartItems;

    /*[3] - create orderItems from cartItems ->convert cartItems into orderItems*/ 
        /*-------Long Approach-->*/
    /*
        let orderItems: OrderItem[]= [];
    for (let i=0; i<cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */
        /*-------Short Approach to the same code above-->*/
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    
    /*[4] - set up purchase*/ 
    let purchase = new Purchase();

    /*[5] - populate purchase - customer*/ 
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    /*[6] - populate purchase - shipping address*/ 
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    /*[7] - populate purchase - billing address*/ 
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    /*[8] - populate purchase - order and orderItems*/ 
    purchase.order = order;
    purchase.orderItems = orderItems;
    /*[9] - Call REST API via the CheckoutService */ 
    this.checkoutService.placeOrder(purchase).subscribe({
      //next: success/Happy PATH
      //what are the back ticks for: For template string output
      next: response => {
        alert(`Your order has been received, \nOrder tracking number: ${response.orderTrackingNumber}`);
        // reset cart
        this.resetCart();
        
      },
      //error: error/Exception PATH
      error: error => {
        alert(`There was an error: ${error.message}`);
      }
    });
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    // reset the form data 
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products');
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }
  //Populate the states based on User selected Country 
  getStates(formGroupName: string) {
    //Get a handle to Form Group Name 
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    //Retrieve the country from formGroup
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);
    //Make a call to formServive to get the states 
    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        //If its shipping assign the states to shippingAddress
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        //select the first state as default 
        formGroup?.get('state')?.setValue(data[0]);
      }
    )
  }

}
