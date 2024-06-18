import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (productIndex > -1) {
                cart.items[productIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            cart = await cart.save();
            return res.status(200).json(cart);
        } else {
            const newCart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }]
            });

            const savedCart = await newCart.save();
            return res.status(201).json(savedCart);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


export const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

export const updateCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (productIndex > -1) {
            cart.items[productIndex].quantity = quantity;

            if (cart.items[productIndex].quantity <= 0) {
                cart.items.splice(productIndex, 1);
            }

            const updatedCart = await cart.save();
            return res.status(200).json(updatedCart);
        } else {
            return res.status(404).json({ msg: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

export const deleteCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (productIndex > -1) {
            cart.items.splice(productIndex, 1);
            const updatedCart = await cart.save();
            return res.status(200).json({ msg: 'Product Deleted' });
        } else {
            return res.status(404).json({ msg: 'Product not found in cart' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};