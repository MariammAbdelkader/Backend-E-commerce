const { Return } = require('../models/returns.models');
const { OrderDetail } = require('../models/orderDetails.models');
const { Product } = require('../models/product.models');

const getUserReturnsService = async (userId) => {
    try {
        const returns = await Return.findAll({
            where: { userId },
            attributes: ['orderId', 'ReturnDate', 'ReturnReason', 'RefundAmount'],
            include: [
                {
                    model: OrderDetail,
                    attributes: ['ProductId', 'UnitPrice'],
                    include: [
                        {
                            model: Product,
                            attributes: ['name']
                        }
                    ]
                }
            ]
        });

        const formattedReturns = returns.map(returnItem => {
            return {
                orderId: returnItem.orderId,
                ReturnDate: returnItem.ReturnDate,
                ReturnReason: returnItem.ReturnReason,
                RefundAmount: returnItem.RefundAmount,
                products: returnItem.OrderDetails.map(detail => ({
                    productId: detail.ProductId,
                    name: detail.Product.name,
                    UnitPrice: detail.UnitPrice,
                    quantity: detail.UnitPrice > 0 ? (returnItem.RefundAmount / detail.UnitPrice) : 0
                }))
            };
        });

        return formattedReturns;
    } catch (err) {
        console.error("Error fetching user return history:", err);
        throw err;
    }
};

module.exports = { getUserReturnsService };
