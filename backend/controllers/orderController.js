import Cart from '../models/cartModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

export const getOrder = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Order.find({ user: userId }).populate('items.product');
        
        if (!orders) {
            return res.status(404).json({ msg: 'No orders found' });
        }

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product');
        
        if (!orders) {
            return res.status(404).json({ msg: 'No orders found' });
        }

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const checkoutCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        let total = 0;
        cart.items.forEach(item => {
            total += item.product.price * item.quantity;
        });

        const order = new Order({
            user: userId,
            items: cart.items,
            total: total
        });

        await order.save();

        // Clear the cart after successful checkout
        await Cart.findOneAndDelete({ user: userId });

        // Generate WhatsApp payment link/message
        const whatsappMessage = `Permisi kak, Saya ingin membeli barang:\n\n${cart.items.map(item => `${item.quantity} x ${item.product.productName}`).join('\n')}\n\nTotal: Rp ${total}. Mohon konfirmasi pesanan saya.`;

        const whatsappLink = `https://wa.me/6285156252811?text=${encodeURIComponent(whatsappMessage)}`;

        res.status(201).json({ msg: 'Checkout successful', order, whatsappLink });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

export const updatePaymentStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Only allow certain statuses to be set
        const validStatuses = ['Pending', 'Successful', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        order.status = status;
        await order.save();

        res.json({ msg: 'Order status updated successfully', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};