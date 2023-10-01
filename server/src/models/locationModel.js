import connection from '../db/mongoose.js';

const locationSchema = new connection.Schema(
    {
        name: { type: String, required: true, },
        user: { type: connection.Schema.Types.ObjectId, ref: 'User', required: true },
        
    }
);

locationSchema.index({ name: 1, user: 1 });
const Location = connection.model('Location', locationSchema);

export default Location;



