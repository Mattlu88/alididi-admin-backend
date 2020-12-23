const Product = require("../models/product")

const initProducts = [{
    SKU: "T062023",
    title: "Cadbury Scorched Almonds",
    description: "CADBURY milk chocolate coated almonds",
    size: "310g",
    contains: "Milk, Soy And Almonds. Milk Chocolate (86%), Almonds (12%). Milk Chocolate contains Cocoa Solids 27%, Milk Solids 26%.",
    costPrice: 2,
    sellingPrice: 5
  },
  {
    SKU: "T062024",
    title: "Sorbent Silky White New Thicker And Softer Toilet Paper",
    description: `Back in 1952, we proudly transformed the Australian outhouse routine from an unpleasant chore into something a little more enjoyable,
    when we introduced crepe toilet paper.`,
    size: "24 pack",
    contains: "24 embossed rolls.",
    costPrice: 7,
    sellingPrice: 10
  }
]

const productsInDb = async () => {
  const products = await Product.find({})
  return products.map(product => product.toJSON())
}

module.exports = {
  initProducts,
  productsInDb
}