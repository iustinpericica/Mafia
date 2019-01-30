import { Injectable } from '@angular/core';

declare let toastr;

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor() { }

  suceess(message:string):void{

    toastr.success(message);

  }

  warning(message:string):void{

    toastr.warning(message);

  }

  error(message:string):void{

    toastr.error(message);

  }


}
