const randomDataHelper = require('../../helpers/random-data');

module.exports = function(app) {
    const productsData = generateProducts();

    app.get('/api/products/', (req, res) => {
        res.send({
            success: true,
            data: productsData
        });
    });

    function generateProducts() {
        const productTypes = [
            {
                name: 'computers',
                imagesCount: 3,
                priceMin: 20000,
                priceMax: 100000
            },
            {
                name: 'watches',
                imagesCount: 3,
                priceMin: 10000,
                priceMax: 35000
            },
            {
                name: 'other',
                imagesCount: 4,
                priceMin: 6000,
                priceMax: 20000
            }
        ];
        const products = [];

        for(let i = 0; i < 20; i++) {
            productTypes.forEach(pt => {
                const imageIndex = randomDataHelper.getRandomInt(1, pt.imagesCount);
                const typeName = pt.name;
                const uid = randomDataHelper.getUid();

                products.push({
                    id: uid,
                    name: typeName + ' - ' + uid,
                    type: typeName,
                    price: randomDataHelper.getRandomInt(pt.priceMin, pt.priceMax),
                    imageName: imageIndex + '.jpg',
                    bigImageName: imageIndex + '_big.jpg',
                    rating: randomDataHelper.getRandomFloat(1, 5),
                    ratingVoteCount: randomDataHelper.getRandomInt(15, 150),
                    prepayment: randomDataHelper.getRandomInt(1, 10)
                })
            });
        }

        return products;
    };
};