var fs = require("fs");
var assert = require('assert');


function amountFor(play, perf) {
    let thisAmount = 0;

    switch (play.type) {

        case "tragedy":
            thisAmount = 40000;

            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;

        case "comedy":
            thisAmount = 30000;

            if (perf.audience > 20) {
                thisAmount += 10000 + 500 * (perf.audience - 20);
            }

            thisAmount += 300 * perf.audience;
            break;

        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

function statement(invoice, plays){
	let totalAmount = 0;
	let volumeCredits = 0;
	let result = `Statement for ${invoice.customer}\n`

	const format = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimumFractionDigits:2 }).format;

	for(let perf of invoice.performances) {
		const play = plays[perf.playID];

        let thisAmount = amountFor(play, perf);
	

		//add volume credits
		volumeCredits += Math.max(perf.audience - 30, 0);

		//add extra credit for every ten comedy attendees

		if("comedy" === play.type){
			volumeCredits += Math.floor(perf.audience / 5);
		}

		//print line for this order

		result += `   ${play.name} : ${format(thisAmount/100)} (${perf.audience} seats)\n`;
		totalAmount += thisAmount;
	}

	result += `You earned ${volumeCredits} credits \n`

	return result;
}


let invoicesContent = fs.readFileSync("invoices.json");
let playsContent = fs.readFileSync("plays.json");


let invoices = JSON.parse(invoicesContent)
let plays = JSON.parse(playsContent);

let result = statement(invoices, plays);

console.log(result);

assert.equal(result, "Statement for BigCo\n" +
    "   Hamlet : $650.00 (55 seats)\n" +
    "   As you like it : $580.00 (35 seats)\n" +
    "   Othello : $500.00 (40 seats)\n" +
    "You earned 47 credits \n");