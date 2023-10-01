import connection from '../db/mongoose.js';

const measurementSchema = new connection.Schema(
    {
        date: { type: Date, default: Date.now },
        value: { type: Number, required: true, },
        color: { type: Object, required: false },
        parameter: { type: connection.Schema.Types.ObjectId, ref: 'Parameter' },
        user: { type: connection.Schema.Types.ObjectId, ref: 'User' },
        location : { type: connection.Schema.Types.ObjectId, ref: 'Location' },
    }
);
measurementSchema.index({ date: 1, user: 1 });
measurementSchema.index({ parameter: 1, user: 1 });

const Measurement = connection.model('Measurement', measurementSchema);


export default Measurement;
