import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'burgerQueen';

  constructor(
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {  
  }
}

