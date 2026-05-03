import address from "../models/address.js";
export const createaddress = async (req, res) => {
    let data = req.body.data
    let cart1 = await address.findOne({ user: req.user.id });


    if (!cart1) {
        cart1 = new address({
            user: req.user.id,
            addresses: []
        })
    }
    if (cart1.addresses.length > 4) {
        return res.status(400).json({ message: " you can  enter maximum five address" });
    }
    cart1.addresses.push({ ...data })
    await cart1.save();
    res.status(200).json(cart1);

};
export const fetchaddress = async (req, res) => {

    let cart1 = await address.findOne({ user: req.user.id });
    res.status(200).json(cart1);
};

export const deleteaddress = async (req, res) => {

    let cart1 = await address.findOne({ user: req.user.id });
    cart1.addresses = cart1.addresses.filter(item => item.id !== req.params.id)
    await cart1.save();
    res.status(200).json(cart1);
};