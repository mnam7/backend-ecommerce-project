const mongoose= require('mongoose');
const mongoosePaginate= require('mongoose-paginate-v2');


const productoSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    status:{
        type:Boolean,
        required:true,
    },
    code:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    thumbnails:{
        type:String,
        required:true,
    }
});

productoSchema.plugin(mongoosePaginate)

module.exports=mongoose.model("Producto",productoSchema)
