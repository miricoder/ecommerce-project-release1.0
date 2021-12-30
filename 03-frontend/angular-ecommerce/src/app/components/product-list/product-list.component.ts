import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';
// import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string ;
  searchMode: boolean = false;

  //new properties for pagination 
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number=0;
  
  previousKeyword: string ="null";

//All services are injected using this constructor otherwise their properties can't be used here  
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }
  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    
    //If we have a different keyword than previous 
    // then set the page number to 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keryword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    //
    //Now search for products using keyword 
    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                              this.thePageSize,
                                              theKeyword).subscribe(this.processResult());
  }
  handleListProducts() {
    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;

    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }
    //
    // Check if we have a different category than previous
    //Note: Angular will reuse a component if it currenlty being viewed 
    //

    //if we have a different category id than previous 
    //then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }
    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)
    // now get the products for the given category id
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //   }
    // )
    //thePageNumber - 1 -> Reason, Angular page numbers are 1 base where as in Spring Date Rest: pages are 0 based 
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              this.currentCategoryId)
                                              .subscribe(this.processResult());
  }
  processResult() {
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; }) => {
      this.products = data._embedded.products;
      this.thePageSize = data.page.size;
      this.thePageNumber = data.page.number + 1;
      this.theTotalElements = data.page.totalElements;
    };
  }
  updatePageSize(pageSize: number){
    this.thePageSize=pageSize;
    this.thePageNumber = 1;
    this.listProducts();

  }
  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)
    // TODO... do the real work
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
