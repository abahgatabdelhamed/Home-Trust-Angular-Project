import { Injectable } from '@angular/core';
import { BillPost } from '../models/bill-post.model'
import { OfferEndpoint } from './offer-endpoint.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OfferService {

    constructor(private offerEndpoint: OfferEndpoint) {

    }

    newOffer(offer: BillPost) {
        return this.offerEndpoint.getNewOfferEndpoint<BillPost>(offer);
    }

    updateOffer(offer: BillPost) {
        return this.offerEndpoint.getUpdateOfferEndpoint<BillPost>(offer, offer.Id);
    }

    getOffers(dataParam, page?: number, pageSize?: number) {

        return this.offerEndpoint.getOffersEndpoint<BillPost[]>(dataParam ,page, pageSize);
    }

    getOfferById(dataParam)
    {
        return this.offerEndpoint.getOfferByIDEndpoint(dataParam);
    }

    deleteOffer(offerOrOfferId: number): Observable<BillPost> {
        return this.offerEndpoint.getDeleteOfferEndpoint<BillPost>(offerOrOfferId);
    }

    getOfferInit(dataParam){
        return this.offerEndpoint.getOfferInitEndpoint(dataParam);
    }
}
