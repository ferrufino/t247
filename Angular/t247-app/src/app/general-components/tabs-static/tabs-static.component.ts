import { Component, ContentChildren, QueryList, AfterContentInit,  Output, EventEmitter } from '@angular/core';
import {TabStatic} from "../tab-static/tab-static.component";

@Component({
    selector: 'tabs-static',
    template:`
    <ul class="nav nav-tabs cards-component">
      <li *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active">
        <a>{{tab.title}}</a>
      </li>
    </ul>
    <ng-content></ng-content>
  `
})
export class TabsStatic implements AfterContentInit {

    @ContentChildren(TabStatic) tabs: QueryList<TabStatic>;
    @Output() notify = new EventEmitter();
    tabSelected: number;
    // contentChildren are set
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab)=>tab.active);

        // if there is no active tab set, activate the first
        if(activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }



    selectTab(tab: TabStatic){

        var arrTabs =  this.tabs.toArray();
        for(var i= 0; i<arrTabs.length; i++){
            arrTabs[i].active = false;
            if(arrTabs[i] == tab) {
                console.log("tab select: "+ i);
                this.tabSelected = i;
                this.notify.emit(i);
            }
        }
        // activate the tab the user has clicked on.
        tab.active = true;
    }

}
