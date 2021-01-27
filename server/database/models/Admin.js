const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  permissions: [{ name: String, permit: Boolean }],
});

adminSchema.methods.hasPermissionTo = function (permit) {
  const permission = this.permissions.find(
    (permission) => permission.name === permit
  );

  if (!permission) {
    return false;
  }
  return permission.permit;
};

module.exports = mongoose.model("Admin", adminSchema);
