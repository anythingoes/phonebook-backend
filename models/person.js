const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MOGODB_URI;
console.log(url);

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB:`, error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "name should be longer than 3 characters"],
    required: [true, "Name is required"],
  },
  number: {
    type: String,
    validate: {
      validator: function (num) {
        return /^\d{8,}|^\d{2,3}-\d{6,}/.test(num);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
    required: [true, "Phone number is required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
