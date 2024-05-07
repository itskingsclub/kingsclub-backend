const marketingData = require("../const/marketingData");

const getPromotions = (req, res) => {
    const promotions = marketingData.promotions;
    res.status(200).json({
        success: true,
        message: "Promotions fetched successfully",
        data: promotions
    });
};

const getBanners = (req, res) => {
    const banners = marketingData.banners;
    res.status(200).json({
        success: true,
        message: "Banners fetched successfully",
        data: banners
    });
};

const getContactDetail = (req, res) => {
    const contactDetail = marketingData.contactDetail;
    res.status(200).json({
        success: true,
        message: "Contact detail fetched successfully",
        data: contactDetail
    });
};

const getPaymentDetail = (req, res) => {
    const paymentDetail = marketingData.paymentDetail;
    res.status(200).json({
        success: true,
        message: "Payment detail fetched successfully",
        data: paymentDetail
    });
};

const getCancelReasons = (req, res) => {
    const cancelReasons = marketingData.cancelReasons;
    res.status(200).json({
        success: true,
        message: "Cancel Reasons fetched successfully",
        data: cancelReasons
    });
};

const getBanks = (req, res) => {
    const banks = marketingData.banks;
    res.status(200).json({
        success: true,
        message: "Banks fetched successfully",
        data: banks
    });
};


module.exports = {
    getPromotions,
    getBanners,
    getContactDetail,
    getPaymentDetail,
    getCancelReasons,
    getBanks
};