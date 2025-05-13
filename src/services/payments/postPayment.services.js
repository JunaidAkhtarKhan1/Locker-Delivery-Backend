const { encrypt, decrypt } = require('../../utils/functions');

const postPaymentService = {
    postPayment: async (req, res) => {
        // const result = await encrypt("Integration Xperts");
        const result = await decrypt("B/4qsjv83mV+wOIB2/h2Gnql2PzMIhkan+dSfLZHsnudu9ppT8aM0LfbvYqDn56bUB9Ed0rJi6txlFI9BgCJNQHhJ2xYDM/+ju7HDgMtWQu68RpcKZCToq/YjJlNX2WNV2Ra0IwCIFj5ihYi0fh1t+5hTBVdT/eM4NlbSx7mcbaKHsv0FeRyO1jDqRk2gjZrcpIHXRCBc/v+j475w9nUk+RkfRMPMvDN2EtPHB3zXp2fKueq80iDcHU3eesKFLo3ma2/qErO4HyyN9FEOf4F+ApOmExJdbukUdYrCyQ/kyysp4Ib6GGu3ejIgcyUiSVacsK8DOFA+5Or+93tfrhsqw==");
        return {
            success: true,
            result,
        };
    },
};

module.exports = postPaymentService;
