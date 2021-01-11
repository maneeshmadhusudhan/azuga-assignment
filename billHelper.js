const moment = require('moment');

const categoryTaxInfo = Promise.resolve([
    {
        category: 'Medicine',
        taxPercentage: 5,
        fromAmount: 0,
        toAmount: Number.MAX_SAFE_INTEGER
    },
    {
        category: 'Book',
        taxPercentage: 0,
        fromAmount: 0,
        toAmount: Number.MAX_SAFE_INTEGER
    },
    {
        category: 'Food',
        taxPercentage: 5,
        fromAmount: 0,
        toAmount: Number.MAX_SAFE_INTEGER
    },
    {
        category: 'Clothes',
        taxPercentage: 5,
        fromAmount: 0,
        toAmount: 1000
    },
    {
        category: 'Clothes',
        taxPercentage: 12,
        fromAmount: 1000,
        toAmount: Number.MAX_SAFE_INTEGER
    },
    {
        category: 'CD',
        taxPercentage: 3,
        fromAmount: 0,
        toAmount: Number.MAX_SAFE_INTEGER
    },
    {
        category: 'Imported',
        taxPercentage: 18,
        fromAmount: 0,
        toAmount: Number.MAX_SAFE_INTEGER
    }

])

const getCategoryInfoForItem = async (item) => {
    const categoryInfo = (await categoryTaxInfo).find(c => {
        if (
            (c.category === item.itemCategory) &&
            (c.fromAmount <= totalAmount) &&
            (c.toAmount > totalAmount)
        ) {
            return true;
        } else {
            return false;
        }
    })
    if (!categoryInfo) {
        throw new Error('CATEGORY_NOT_FOUND');
    }

    return categoryInfo;
}

const getBillForLineItem = (item) => {
    const totalAmount = item.quantity * item.price;
    //query db for category info
    const categoryInfo = await getCategoryInfoForItem(item);
    const totalTaxAmount = (totalAmount) * (categoryInfo.taxPercentage) / (100);
    const rateApplied = categoryInfo.taxPercentage;
    const finalPrice = totalAmount + totalTaxAmount;
    return {
        totalTaxAmount,
        rateApplied,
        finalPrice,
        ...item
    };
}

const getBillForItems = (billLineItems) => {
    const dateOfPurchase = moment().format('YYYYMMDD');
    const timeOfPurchase = moment().toDate().getTime();
    const totalAmount = billLineItems.reduce((acc, curr) => {
        return acc + curr.finalPrice
    }, 0);
    let discount = 0;
    if (totalAmount > 2000) {
        discount = 5;
    }

    const discountAmount = (discount) * (totalAmount) / 100;
    const finalAmount = totalAmount - discountAmount;
    return {
        dateOfPurchase,
        timeOfPurchase,
        totalAmount,
        discountAmount,
        finalAmount,
        billLineItems
    };
}

const calculateBill = (items) => {
    try {
        const lineItemBills = [];
        for (const item of items) {
            lineItemBills.push(getBillForLineItem(item));
        }
        const bill = getBillForItems(lineItemBills);
        return bill;
    } catch (err) {
        console.error(err);
    }
}

// module.exports = {
//     calculateBill
// };

const bill = calculateBill([
    {
        "item": "Headache pills",
        "itemCategory": "Medicine",
        "quantity": 5,
        "price": 50
    },
    {
        "item": "Sandwich",
        "itemCategory": "Food",
        "quantity": 2,
        "price": 200
    },
    {
        "item": "Perfume",
        "itemCategory": "Imported",
        "quantity": 1,
        "price": 4000
    },
    {
        "item": "Black Swan",
        "itemCategory": "Book",
        "quantity": 1,
        "price": 300
    }
]);

console.log(JSON.stringify(bill));