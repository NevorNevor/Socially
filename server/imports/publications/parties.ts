import {Parties} from '../../../both/collections/parties.collection';
import {Meteor} from 'meteor/meteor';

function buildQuery(partyId?: string, location?: string): Object {
    let isAvailable: Object = {
        $or: [
            { 'public': true },
            {
                $and: [
                    { owner: this.userId },
                    { owner: { $exists: true } }
                ]
            }
        ]
    };
    if (location)
        isAvailable = {
            $and: [
                isAvailable,
                { location: { $regex: `${location}` , $options: "i"} }
            ]
        };

    if (partyId) {
        return { $and: [{ _id: partyId }, isAvailable] };
    }

    return isAvailable;
}

Meteor.publish('parties', function (options: any, location: string) {
    let select = buildQuery.call(this, null, location);
    console.log(select);
    return Parties.find(select, options);
});

Meteor.publish('party', function (partyId: string) {
    return Parties.find(buildQuery.call(this, partyId));
});