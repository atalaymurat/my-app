const { Schema } = require("mongoose");

const termSchema = new Schema(
  {
    key:        { type: String, required: true },
    label:      { type: String, required: true },
    fieldType:  { type: String, enum: ['text', 'select', 'multiselect'], default: 'text' },
    options:    {
      type: [String],
      validate: { validator: v => v.length <= 10, message: 'options dizisi en fazla 10 eleman içerebilir.' },
    },
    value:      { type: Schema.Types.Mixed },
    isEditable: { type: Boolean, default: true },
    isVisible:  { type: Boolean, default: true },
    visibleIn:  { type: [String], enum: ['offer', 'proforma', 'contract'] },
  },
  { _id: false }
);

module.exports = termSchema;
