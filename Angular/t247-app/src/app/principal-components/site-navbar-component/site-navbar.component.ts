import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-site-navbar',
  templateUrl: './site-navbar.component.html',
  styleUrls: ['./site-navbar.component.css']
})
export class SiteNavbarComponent implements OnInit {

  @Input() rolesArray: string[];
  // TODO: CHECK DROPDOWN NPM

  constructor() { }

  ngOnInit() {

  }

}
