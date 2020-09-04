var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
const preservationSchema = new Schema({
    customername: { type: String },
    address: { type: String },
    inspector: { type: String },
    concern: { type: String },
    date: { type: String },
    weather: { type: String },
    housetype: { type: String },
    age: { type: String },
    subfloor: { type: String },
    chimney: { type: String },
    flashing: { type: String },
    ambientemp: { type: String },
    humidity: { type: String },
    surfacetemp: { type: String },
    dewpoint: { type: String },
    trvs: { type: String },
    heatingon: { type: String },
    windowsvented: { type: String },
    pressuretest: { type: String },
    notes: { type: String }
});
 
module.exports = mongoose.model('Preservation', preservationSchema);