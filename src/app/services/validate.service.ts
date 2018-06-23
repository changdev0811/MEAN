import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  
  validateRegisterEventUser(user){

    if(user.username!=undefined && user.username.length > 0 && user.password != undefined && user.password.length > 0)
    {
       return true;
  	} else{
  		return false;
  	}
  }
  validateRegisterServiceUser(user){
    if(user.username!=undefined && user.username.length > 0 && user.password != undefined && user.password.length > 0)
    {
       return true;
  	} else{
  		return false;
  	}
  }
  validateEmail(email){
  	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      return true;
    } else{
      return false;
    }
  }
}
