import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password, img_url, phone, address } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        let emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        user = new User({ username, email, password, img_url, phone, address });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(201).json({ msg : "User Registered" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        const role = user.role;
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token, user:{
                username, role
            } });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.findById(req.user.id).select('-password');
        res.status(200).json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().select('-password');
        res.status(200).json(allUsers);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export const updateUser = async (req, res) => {
    const { username, email, img_url, phone, address, password } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the username is being updated and if it's already taken
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ msg: 'Username already exists' });
            }
            user.username = username;
        }

        // Check if the email is being updated and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: 'Email already exists' });
            }
            user.email = email;
        }

        if (img_url) user.img_url = img_url;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.status(200).json({ msg: 'User updated successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const updateRole = async (req, res) => {
    const { id, role, username, email, img_url, phone, password } = req.body;
  
    try {
      let user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      if (role) user.role = role;
  
      await user.save();
      res.status(200).json({ msg: 'User updated successfully', user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  

export const logout = async (req, res) => {
    try {
        // You can use token blacklisting or simply clear the token from the client side
        res.clearCookie('token'); // Clear the token cookie
        res.json({ msg: 'Logout successful' });
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
