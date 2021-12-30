import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';

import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;
  constructor(private oktAuthService: OktaAuthService) {
    this.oktaSignin = new OktaSignIn({
        logo: '/assets/images/products/logo.png',
        features: {
          registration: true
        },        
        baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
        clientId: myAppConfig.oidc.clientId,
        redirectUri: myAppConfig.oidc.redirectUri,
        authParams: {
          pkce: true,
          issuer: myAppConfig.oidc.issuer,
          scopes: myAppConfig.oidc.scopes
        }
    });
   }
  

  ngOnInit(): void {
    this.oktaSignin.remove();
    //Render the element with the given ID below which is defined in the html file 
    // i.e. -> <div id="okta-sign-in-widget" class="pt-5"></div>
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'  
    },
    //Sign Widdget renedered and user got a respons to sign in on 
    (response: any) => {
      if(response.status === 'SUCCESS'){
        //Sign in the user and redirect them to our page  
        this.oktAuthService.signInWithRedirect();
      }
    },
    (error: any) => {
      throw error;
    }
    );
  }

}
