const mongoose = require('mongoose')

const poemsSchema = mongoose.Schema(
    {
        text:{
            type: String,
            required: true
        },
        author:{
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
)

const Poem = mongoose.model('Poem', poemsSchema)


module.exports = Poem