import { Component, OnInit } from '@angular/core';
import { GetCurrencyService } from './get-currency.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';


interface Currency {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  myForm!: FormGroup;
  title = 'currency';
  secondLast = ''
  firstLast = ''
  secondSelectLast = 'USD'
  firstSelectLast = 'UAH'
  currency: Currency[] = [
    {"ccy":"USD","base_ccy":"UAH","buy":"0.0","sale":"0.01"},
    {"ccy":"EUR","base_ccy":"UAH","buy":"0.0","sale":"0.01"},
    {"ccy":"UAH","base_ccy":"EUR","buy":"0.0","sale":"0.01"},
    {"ccy":"UAH","base_ccy":"USD","buy":"0.0","sale":"0.01"},
  ]


  constructor(
    private currencyService : GetCurrencyService,
    private fb: FormBuilder,
  ) { }


  ngOnInit(){
    this.myForm = this.fb.group({
      first: '',
      firstSelect: new FormControl(this.currency[1].ccy),
      last:  '',
      lastSelect:  new FormControl(this.currency[0].ccy), 
    })
    
    this.currencyService.getJSON().subscribe(data => {
         this.currency = data
     });
    
    this.myForm.valueChanges.subscribe(val =>{
      
      
      if(this.firstLast == this.myForm.value.first){
        this.changeSecond()
      } else if (this.secondLast == this.myForm.value.last){
        this.changeFirst()
      } else console.log("Nothing")
    });

  }



changeFirst(){
    const last = this.currency.filter((obj) => {
      return obj.ccy === this.myForm.value['lastSelect'] && obj.base_ccy === this.myForm.value['firstSelect'];
    });
    this.myForm.value.last = (parseFloat(this.myForm.value.first) / parseFloat(last[0].buy)).toFixed(3);
    this.secondLast = this.myForm.value.last
    this.firstLast = this.myForm.value.first
    this.secondSelectLast = this.myForm.value.lastSelect
    this.firstSelectLast = this.myForm.value.firstSelect
}

changeSecond(){
    const last = this.currency.filter((obj) => {
      return obj.ccy === this.myForm.value['lastSelect'] && obj.base_ccy === this.myForm.value['firstSelect'];
    });
    this.myForm.value.first = (parseFloat(this.myForm.value.last) * parseFloat(last[0].buy)).toFixed(3);
    this.secondLast = this.myForm.value.last
    this.firstLast = this.myForm.value.first
    this.secondSelectLast = this.myForm.value.lastSelect
    this.firstSelectLast = this.myForm.value.firstSelect
}
  

}
