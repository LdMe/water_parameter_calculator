import connection from '../db/mongoose.js';

const parameterSchema = new connection.Schema(
    {
        name: { type: String, required: true, },
        isColor: { type: Boolean, required: true, default: false },
        colors :{ type: Array, required: false, default: [] },
        user: { type: connection.Schema.Types.ObjectId, ref: 'User', required: true },
    }
);

parameterSchema.index({ name: 1, user: 1 });
const Parameter = connection.model('Parameter', parameterSchema);

export default Parameter;



