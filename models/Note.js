var mongoose = require("mongoose");
var schema = mongoose.schema;
var NoteSchema = new Schema({

  title: {
    type: String
  },

  body: {
    type: String
  }
});


// note model
var Note = mongoose.model("Note", NoteSchema);

// exporting note model
module.exports = Note;