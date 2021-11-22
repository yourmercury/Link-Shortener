const { Active_link } = require("../models/model");
const randomstring = require("randomstring");

module.exports = {

    LINK_LIFE: 604800000,

    genCode: async function (link) {
        let linkCode = randomstring.generate(6);
        let status = false;

        try {

            let active_link = await Active_link.findOne({ linkCode });
            let result = await Active_link.findOne({ link: link });

            if (result && Date.now() - result.expiration < module.exports.LINK_LIFE) {

                status = true;
                return { linkCode: result.linkCode, status };

            } else if (result) {
                status = false;
                await Active_link.deleteOne({ link: result.link });
            }



            if (active_link && Date.now() - active_link.expiration >= module.exports.LINK_LIFE) {
                await Active_link.deleteOne({ linkCode });

                return { linkCode, status };
            } else if (active_link) {
                console.log(active_link);
                return await module.exports.genCode(link);
            } else {
                return { linkCode, status };
            }
        }
        catch (error) {
            throw new Error(error);
        }
    },

    genLink: async function (link, host) {
        try {

            let result = await module.exports.genCode(link);
            let linkCode = result.linkCode;
            let status = result.status;

            if (!status) {
                Active_link.create({ link, linkCode, expiration: Number(Date.now()), clicks: 0 }, (error, payload) => {
                    if (error) {
                        throw new Error(error);
                    } else console.log(payload + " at genLink");
                });
            }

            return `${host}/${linkCode}`
        }

        catch (error) {
            throw new Error(error)
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
                await Active_link.updateOne({ linkCode }, { trigger: Math.random() * 100000000000000000000 * Math.random() * 100000000000000000 });
                return result.link;
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }


}