const mongoose=require('mongoose')

const cartSchema= new mongoose.Schema({

    products: [
        {
            producto: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Producto", 
                required: true },
            quantity: { 
                type: Number, 
                required: true, 
                default: 1 }
        }
    ]

})

module.exports=mongoose.model("Cart",cartSchema)