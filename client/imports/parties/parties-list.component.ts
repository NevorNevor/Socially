import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { LoginButtons } from 'angular2-meteor-accounts-ui';
import { MeteorComponent } from 'angular2-meteor';

import { Party } from '../../../both/interfaces/party.interface';
import { Parties }   from '../../../both/collections/parties.collection';
import { PartiesFormComponent } from './parties-form.component';
import { ReactiveVar } from 'meteor/reactive-var';
import { PaginatePipe, PaginationService, PaginationControlsCmp } from 'ng2-pagination';

import template from './parties-list.component.html';

@Component({
  selector: 'parties-list',
  template,
  viewProviders: [PaginationService],
  pipes: [PaginatePipe],
  directives: [PartiesFormComponent, ROUTER_DIRECTIVES, LoginButtons, PaginationControlsCmp]
})
export class PartiesListComponent extends MeteorComponent implements OnInit {
  parties: Mongo.Cursor<Party>;
  pageSize: number = 10;
  curPage: ReactiveVar<number> = new ReactiveVar<number>(1);
  nameOrder: number = 1;
  searchedLocation: ReactiveVar<string> = new ReactiveVar<string>("");
  loading: boolean = false;

  constructor(private paginationService: PaginationService) {
    super();
  }

  ngOnInit() {
    this.paginationService.register({
      id: this.paginationService.defaultId,
      itemsPerPage: this.pageSize,
      currentPage: this.curPage.get(),
      totalItems: 30,
    });   
    this.autorun(() => {
      console.log("autorun " + this.curPage.get() + " " + `/${this.searchedLocation.get()}/`);
      const options =  {
        limit: this.pageSize,
        skip: (this.curPage.get() - 1) * this.pageSize,
        sort: { name: this.nameOrder }
      };

      this.loading = true;
      this.paginationService.setCurrentPage(this.paginationService.defaultId, this.curPage.get());

      this.subscribe('parties', options, this.searchedLocation.get(), () => {
        this.parties = Parties.find({}, { sort: { name: this.nameOrder }});
        this.loading = false;
      }, true);
    });
  }

  onPageChanged(page: number) {
    this.curPage.set(page);
  }

  removeParty(party) {
    Parties.remove(party._id);
  }

  search(value: string) {
    this.curPage.set(1);
    this.searchedLocation.set(value);
  }
}