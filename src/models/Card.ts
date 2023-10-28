import ICard from "../interfaces/ICard";
export default class Card  implements ICard{

    card_number!: string;    
    cvv!: number;
    expiration_month!: string;
    expiration_year!: string;
    email!: string;
    source_id?: string;
    

    constructor() {}

    get cardNumber(): string {
        return this.card_number;
    }

    set cardNumber(card_number: string) {
        this.card_number = card_number.replace(/\D/g, '');
        
    }

    
}
