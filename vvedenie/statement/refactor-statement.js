/**
 *  Безусловно я не делал проверок на типы - что является ошибкой, 
 *  а так же перед рефакторингом нужно написать тесты.
 *  Плюс названия для всего выбраны "на пофиг", так как на 100% не понятно что является чем, 
 *  и тратить время на придумывание не хочется.
 *  
 *  Но: 
 *  1. На JS я не пишу, TS типы убирают потребность в проверки типов. 
 *  2. Мне лень писать тесты сюда, но на проде, разумеется, тесты 100% нужно было бы написать.
 */


const { invoices, plays } = require('./info.js');


// Cost in cent
const costsByCategory = {
    'tragedy': {
        cost: 40000,
        audienceGross: 30,
        audienceGrossCost: 0,
        audienceGrossCostPerPerson: 1000,
        costPerPerson: 0,
    },
    'comedy': {
        cost: 30000,
        audienceGross: 20,
        audienceGrossCost: 10000,
        audienceGrossCostPerPerson: 500,
        costPerPerson: 300,
    }
}

const creditsByCategory = {
    'tragedy': {
        minimumCreditAudience: 30,
        additionalCreditByPersonMultiply: 0,
    },
    'comedy': {
        minimumCreditAudience: 30,
        additionalCreditByPersonMultiply: 5,
    }
}

const getCostByCategory = function (category, personsAmount) {
    if (personsAmount === 0) {
        return 0;
    }

    const costs = costsByCategory[category];
    
    if (costs) {
        let totalCost = costs.cost + costs.costPerPerson * personsAmount;

        // Добавление цены в случае привышения лимита за каждого зрителя
        if (personsAmount > costs.audienceGross) {
            totalCost += costs.audienceGrossCost + costs.audienceGrossCostPerPerson * (personsAmount - costs.audienceGross); 
        }

        return totalCost;
    }
    
    throw new Error(`Costs for category '${category}' not exist`);
}

const getCreditsByCategory = function (category, personsAmount) {
    if (personsAmount === 0) {
        return 0;
    }

    const credits = creditsByCategory[category];

    if (credits) {
        let totalCredits = Math.max(0, personsAmount - credits.minimumCreditAudience);

        // Добавление кредитов за каждого N зрителя
        if (credits.additionalCreditByPersonMultiply) {
            totalCredits += Math.floor(personsAmount / credits.additionalCreditByPersonMultiply);
        }

        return totalCredits;
    }

    throw new Error(`Credits for category '${category}' not exist`);
}

const getPlayInfoById = function (id) {
    return plays[id];
}

const getPlayInfoByPerformance = function (performance) {
    return getPlayInfoById(performance.playlD);
}

const statement = function (invoice, plays) {
    const result = {
        customer: invoice.customer,
        totalCost: 0,
        totalCredits: 0,
        performancesCosts: []
    }

    let type, cost, credits, performance;
    for (performance of invoice.performances) {
        type = getPlayInfoByPerformance(performance).type;
        cost = getCostByCategory(type, performance.audience);
        credits = getCreditsByCategory(type, performance.audience);

        result.totalCost += cost;
        result.totalCredits += credits;
        result.performancesCosts.push({
            title: performance.playlD,
            audience: performance.audience,
            type: type,
            cost: cost,
            credits: credits,
        })
    }

    return result;
}

const consoleLogStatement = function (data) {
    console.log(`Statement for ${data.customer}`);
    data.performancesCosts.forEach((cost) => {
        console.log(`${cost.title}: ${cost.cost/100}$ (${cost.audience})`);
    })
    console.log(`Amount owed is ${data.totalCost/100}$`);
    console.log(`You earned ${data.totalCredits} credits`);
}

const htmlStatement = function (data) {
    return `
        <article>
            <h2>Statement for ${data.customer}</h2>
            <ul>
                ${data.performancesCosts.map((cost) => `<li>${cost.title}: ${cost.cost/100}$ (${cost.audience})</li>`).join('')}
            </ul>
            <p>Amount owed is ${data.totalCost/100}$</p>
            <p>You earned ${data.totalCredits} credits</p>
        </article>
    `;
}

consoleLogStatement(statement(invoices[0], plays));
console.log(htmlStatement(statement(invoices[0], plays)))