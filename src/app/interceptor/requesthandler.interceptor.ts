import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { refreshCanvasBarcode } from '@syncfusion/ej2-barcode-generator/src/barcode/utility/barcode-util';

import { Observable } from 'rxjs';;
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AccountEndpoint } from '../services/account-endpoint.service';
import { AccountService } from '../services/account.service';
import { AlertService, MessageSeverity } from '../services/alert.service';
import { AppTranslationService } from '../services/app-translation.service';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../services/configuration.service';
import { EndpointFactory } from '../services/endpoint-factory.service';
import { Utilities } from '../services/utilities';


@Injectable()
export class RequesthandlerInterceptor implements HttpInterceptor {
  gT = (key: string) => this.translationService.getTranslation(key);
  public baseUrl = environment.baseUrl || Utilities.baseUrl();
  requestcount: number = 0;
  er1=0;
  er2=0;
  er3=0;
  er4=0;
  er5=0;
  er6=0;
  constructor(

    private alertService: AlertService,
    private translationService: AppTranslationService,
    public account:AccountEndpoint,
    private authService:AuthService,
    private router:Router

  ) { }

  // this interceptor to handle error 401 
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers 
    if(request.url.includes('items/Search')||request.url.includes('Item/SearchItems')){
      headers={
        'Authorization': 'Bearer ' + this.authService.accessToken,
        'language':this.translationService.getCurrentLanguage()
  
      }
    }
   else{
     headers = {
      'Authorization': 'Bearer ' + this.authService.accessToken,
      //'language':this.translationService.getCurrentLanguage()
    //  'Content-Type':'application/vnd.iman.v1+json, application/json, text/plain, */*'
  };
   }
    this.requestcount++;
    //console.log('count=', this.requestcount)
    if (this.requestcount === 1) {
     // console.log('true')
      this.alertService.showStickyMessage(this.gT('messages.loading'), '', MessageSeverity.wait)

    }
    if(this.authService.userInStorage.value)
    request = request.clone({
      setHeaders:  headers 
  });
    return next.handle(request).do(resp => {

      // on Response
      if (resp instanceof HttpResponse && request.method != "GET") {
        console.log('resp', resp)
        
          // Do whatever you want with the response.
          if (resp.url == this.baseUrl + "/connect/token") {
            /*this.alertService.showMessage(this.gT("app.Login"),
              this.gT("app.Welcome"), MessageSeverity.success);
*/
          }
          
          else
            this.alertService.showMessage(this.gT("shared.OperationSucceded")
              , "",
              MessageSeverity.success);
        }


        //    return resp;
      else if(resp instanceof HttpResponse &&resp.url == this.baseUrl + "/api/Bill/CollectCostForCostCenter"){
        this.alertService.showMessage(this.gT("shared.OperationSucceded")
        , "",
        MessageSeverity.success);
      }

      
      // this.contador--;
      if (resp instanceof HttpResponse) { //<--only when event is a HttpRespose
        this.requestcount--;
        if (this.requestcount == 0)
          this.alertService.resetStickyMessage()
      }
      return resp;

    }, (err: HttpErrorResponse) => {
      if (err instanceof HttpErrorResponse) {
        this.requestcount--;
        if (this.requestcount == 0) {
          this.alertService.resetStickyMessage()
          this.er1=0;
          this.er2=0;
          this.er3=0;
          this.er4=0;
          this.er5=0;
          this.er6=0;

        }

        console.log(err.status,this.requestcount);
        console.log(err.statusText);
        console.error(err)
        if (err.status == 401) {
          //  console.log('u')
          this.er1++
          if(this.er1==1)
          this.alertService.showStickyMessage(this.gT("messages.Unauthorized"), "", MessageSeverity.error)
          //return err
        }
        if ( err.status == 403) {
          //console.log('errrrrrrrrrrrrrrrror')
          this.er2++
          if(this.er2==1)
          this.alertService.showStickyMessage(this.gT("messages.error"), "", MessageSeverity.error)
          this.refresh()
         
         // this.authService.loadingData.next(false)
          //return err
        }
        if (err.status == 500 ) {
          //console.log('errrrrrrrrrrrrrrrror')
          this.er2++
          if(this.er2==1)
          this.alertService.showStickyMessage(this.gT("messages.error"), "", MessageSeverity.error)

          //return err
        }
        if (err && ("error" in err) && (err.error) && ("error_description" in err.error)) {
          this.er3++
          if(this.er3==1)
          this.alertService.showStickyMessage(this.gT("shared." + err.error.error_description), "", MessageSeverity.error);
          //return err
        }

        else if (err.status == 404) {
          this.er4++
          if(this.er4==1)
          this.alertService.showStickyMessage(this.gT("notFound.404"), "", MessageSeverity.error)

          //return err
        }
        else if (err.status == 0) {
          // console.log('error0000000000')
          this.er5++
          if(this.er5==1)
          this.alertService.showStickyMessage(this.gT("notFound.nonetwork"), "", MessageSeverity.error)

          
        }

        else {
          this.er6++
          if(this.er6==1)
          this.alertService.showStickyMessage(this.gT("messages.error"), "", MessageSeverity.error)
          
        }
        return err
      }
    })
    
    /*   .map(resp => {
           // on Response
           if (resp instanceof HttpResponse && request.method!="GET") {
               // Do whatever you want with the response.
               if(resp.url==this.baseUrl+"/connect/token"){
                 this.alertService.showMessage(this.gT("app.Login"),
                 this.gT("app.Welcome"), MessageSeverity.success);
                 
               }
            
               else
               this.alertService.showMessage(this.gT("shared.OperationSucceded")
               ,"",
               MessageSeverity.success);
               console.log("res=",resp)
               return resp;
           }
           else
           {
               return resp;
           }
        }).catch(err => {
            // onError
            console.log(err);
            if (err instanceof HttpErrorResponse) {
                console.log(err.status);
                console.log(err.statusText);
                  if (err.status === 401) {
                    // redirect the user to login page
                    // 401 unauthorised user
                    this.alertService.showStickyMessage("انتهت الجلسة","", MessageSeverity.error)

                }
                else if(err.status==404){
                 this.alertService.showStickyMessage("تأكد من صحة البيانات ","", MessageSeverity.error)

                }
                else if(err.status==404){
                  
                  this.alertService.showStickyMessage(this.gT("notFound.404"),"", MessageSeverity.error)

                }
                else if(err.status==0){
                 this.alertService.showStickyMessage("لايوجد اتصال بشبكة الانترنت","", MessageSeverity.error)
              
                } else if(err.error.error_description){
                 this.alertService.showStickyMessage(this.gT("shared."+err.error.error_description),"", MessageSeverity.error)
              
                }
                else {
                 this.alertService.showStickyMessage(this.gT("messages.error"),"", MessageSeverity.error)
             
                }
            }
            return Observable.of(err);
        });*/
  }
  refresh(){
  this.authService.logout();

  this.authService.redirectLogoutUser();

         
  }
}
