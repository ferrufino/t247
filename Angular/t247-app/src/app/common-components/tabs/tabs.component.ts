import { Component, ContentChildren, QueryList, AfterContentInit, OnChanges, SimpleChanges, Output, Input, EventEmitter } from '@angular/core';
import {Tab} from "../tab/tab.component";
import {Router} from '@angular/router';

@Component({
    selector: 'tabs',
    template:`
    <ul class="nav nav-tabs cards-component">
      <li *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
        <a>{{tab.title}}</a>
      </li>
    </ul>
    <ng-content></ng-content>
  `
})
export class Tabs implements OnChanges {

    @ContentChildren(Tab) tabs: QueryList<Tab>;
    @Input() selectedTab: string;
    @Input() baseRoute: string;

    constructor(private _router : Router) {

    }
    // contentChildren are set
    ngAfterContentInit() {

        console.log(this.selectedTab + " " + this.baseRoute);
        
        var arrTabs = this.tabs.toArray();
            
        let tabis = arrTabs.filter(tab => tab.tabName == this.selectedTab);
        var tab : Tab;
        if (tabis.length == 0) {
            tab = arrTabs[0];
        } else {
            tab = tabis[0];
        }
        //alert("tab seleccionada: " + changes['selectedTab']['currentValue']);

        for(var i= 0; i<arrTabs.length; i++){
            arrTabs[i].active = false;
        }
        // activate the tab the user has clicked on.
        tab.active = true;
        
    }

    ngOnChanges(changes: SimpleChanges) {
        //alert("HUBO CAMBIOS");
        console.log("HUBO CAMBIOS");
        console.log(changes);
        console.log(this.selectedTab);

        if (this.tabs) {

            var arrTabs = this.tabs.toArray();
            
            let tabis = arrTabs.filter(tab => tab.tabName == this.selectedTab);
            var tab : Tab;
            if (tabis.length == 0) {
                tab = arrTabs[0];
            } else {
                tab = tabis[0];
            }
            //alert("tab seleccionada: " + changes['selectedTab']['currentValue']);

            for(var i= 0; i<arrTabs.length; i++){
                arrTabs[i].active = false;
            }
            // activate the tab the user has clicked on.
            tab.active = true;
            
        }
    }

    selectTab(tab: Tab){
        console.log("PIQUE LA TAB: " + tab.tabName);
        this._router.navigate([this.baseRoute + '/' + tab.tabName]);        
    }

}
