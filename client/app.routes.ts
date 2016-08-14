import { Injectable } from '@angular/core';
import { RouterConfig, provideRouter, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import {Observable} from 'rxjs/Observable'

import { CanActivate } from '@angular/router';

import { Party } from '../both/interfaces/party.interface';
import { Parties } from '../both/collections/parties.collection';

import { PartiesListComponent } from './imports/parties/parties-list.component';
import { PartyDetailsComponent } from './imports/parties/party-details.component';

const routes: RouterConfig = [
  { path: '', component: PartiesListComponent },
  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateDetails']/*, canActivate: ['CanActivateForLoggedIn']*/ }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
  { provide: 'canActivateDetails', useValue: canActivatePartyDetails }
  //{ provide: 'CanActivateForLoggedIn', useValue: () => !! Meteor.userId() }
];


function canActivatePartyDetails(route: ActivatedRouteSnapshot) {
  let result;
  let partyId = route.params['partyId'];
  if (!Meteor.user())
    result = false;
  else
    result = new Observable<boolean>(observer => {
      new Observable<Party>(partyObserver => {
        partyObserver.next(Parties.findOne(partyId))
      }).subscribe(value => {
        console.log(!!Meteor.userId && value && value.owner == Meteor.userId());
        observer.next(!!Meteor.userId && value && value.owner == Meteor.userId());
        observer.complete();
        //observer.next(true);
      });
    });
  return result;
}
