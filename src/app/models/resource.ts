
export class Resource {
    _id:String;
    name:String;
    user:String;
	description: String;
	timing:any = {};
	price:Number;
	numberofguests:Number;
	location: any = {};
	images:any = [];
}
export class Order{
	_id:String;
	name:String;
	date:String;
	country:String;
	paid:number;
	serviceid:String;
	feedback:String;
}
export class Feedback{
	stars:number;
	feedback:string;
}