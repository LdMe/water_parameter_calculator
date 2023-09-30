import connection from "../db/mongoose.js";
import bcrypt from "bcrypt";

const userSchema = new connection.Schema(
    {
        
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
    }
);
userSchema.methods.comparePassword = async function (password) {
    try {
        const comparation = await bcrypt.compare(password, this.password);
        return comparation;
    } catch (error) {
      throw new Error(error);
    }
  };

const User = connection.model("User", userSchema);

export default User;