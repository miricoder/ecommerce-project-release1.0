import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {
  // - 1 Create an array object of the Product Category 
  productCategories: ProductCategory[];
  // - 2 Inject the Service
  constructor(private productService: ProductService) { }
  
  ngOnInit(): void {
    // - 3 Create listProductCategories() method which will call the service
    this.listProductCategories();
  }
  listProductCategories() {
    // - 4 Invoke the service
    // - Note: getProductCategories() will throw an error but it doesn't exist yet  
    //---: to solve this issue we will need to Enhance menu component to read data from products service
    this.productService.getProductCategories().subscribe(
      data => {
        // - 5 Convert the output to JSON 
        console.log('Product Categories=' + JSON.stringify(data));
        // - 6 Assign data to our property
        this.productCategories = data;
      }
    );
  }

}
