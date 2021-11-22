const mongoose = require("mongoose");

const link_life = 604800

const linkSchema = new mongoose.Schema({
    link: {
        required: true,
        lowercase: true,
        type: String,
    },

    linkCode: {
        required: true,
        type: String
    },

    expiration: {
        required: true,
        type: Number
    },

    trigger: {
        
    },

    clicks: {
        required: false,
        type: Number
    }
});


const clicks = new mongoose.Schema({

    clicks: {
        required: false,
        type: Number
    }
})
//`${req.protocol}://${req.get("host")}/${code}`;

module.exports = {
    Active_link: mongoose.model("active_link", linkSchema),
    clicks: mongoose.model("clicks", clicks)
}