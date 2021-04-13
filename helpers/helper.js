const Active_link = require("../models/model");
const randomstring = require("randomstring");

module.exports = {
    
    LINK_LIFE: 604800000,

    genCode : async function (_link) {
        let linkCode = randomstring.generate(6);
        let status = false;

        console.log(linkCode);
        try {

            let active_link = await Active_link.findOne({ linkCode });
            let link = await Active_link.findOne({ link: _link });

            if (link && Date.now() - link.expiration < module.exports.LINK_LIFE) { 

                status = true;
                return {linkCode: link.linkCode, status};

            } else if (link) {
                status = false;
                await Active_link.deleteOne({ link: link.link });
            }



            if (active_link && Date.now() - active_link.expiration >= module.exports.LINK_LIFE) {
                await Active_link.deleteOne({ linkCode });
                
                return {linkCode, status};
            } else if (active_link) {
                console.log(active_link);
                return await module.exports.genCode(link);
            } else {
                return {linkCode, status};
            }
        }
        catch (error){
            throw new Error(error)
        }
    },

    genLink : async function (link, host) {
        try {

            let result = await module.exports.genCode(link);
            let linkCode = result.linkCode;
            let status = result.status;

            if (!status) {
                Active_link.create({ link, linkCode, expiration: Number(Date.now()) }, (error, payload) => {
                    if (error) {
                        throw new Error(error)
                    } else console.log(payload + " at genLink");
                });
            }

            return `${host}/${linkCode}`
        }

        catch (error) {
            throw new  Error(error)
        }
    },

    getLink: async function (linkCode) {
        try {

            let result = await Active_link.findOne({ linkCode });

            if (!result) {
                return false;
            } else if (Date.now - result.expiration >= module.exports.LINK_LIFE) {
                await Active_link.deleteOne({ linkCode });
                return false;
            } else {
                return result.link;
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }

    
}