import { Component, OnInit, NgZone, Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Tracker } from 'meteor/tracker';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { Parties } from '../../../both/collections/parties.collection';
import { Party } from '../../../both/interfaces/party.interface';

import { CanActivate } from '@angular/router';


import template from './party-details.component.html';

@Component({
  selector: 'party-details',
  template,
  directives: [ROUTER_DIRECTIVES]
})
export class PartyDetailsComponent implements OnInit {
  partyId: string;
  party: Party;

  constructor(private route: ActivatedRoute, private ngZone: NgZone) { }  

  ngOnInit() {
    this.route.params
      .map(params => params['partyId'])
      .subscribe(partyId => {
        this.partyId = partyId;
        Tracker.autorun(() => {
          this.ngZone.run(() => {
            this.party = Parties.findOne(this.partyId);
          });
        });
      });
  }

  saveParty() {
    Parties.update(this.party._id, {
      $set: {
        name: this.party.name,
        description: this.party.description,
        location: this.party.location
      }
    });
  }
}