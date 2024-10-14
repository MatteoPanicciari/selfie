import { Schema as _Schema, model, Types } from 'mongoose';
const Schema = _Schema;

const teamSchema = new _Schema({
    name: { 
        type: String,
        required: true
    }
});
const Team = model('Team', teamSchema);

const userSchema = new _Schema({
    username: { 
        type: String, 
        unique: true, 
        required: true
    },
    password: { 
        type: String, 
        required: true
    },
    cryptedPassword: { 
        type: String, 
        required: true
    },
    hisTeams: [{
        type: _Schema.Types.ObjectId,
        ref: 'Team'
    }]
});
const User = model('User', userSchema);

const eventSchema = new Schema({
    ofTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    note: {
        type: String,
        required: false,
        default: null
    },
    isRepeated: { 
        type: Boolean,
        required: true
    },
    repeatCode: { 
        type: Schema.Types.ObjectId,
        required: false,
        default: null
    },
    alarm: {
        type: Number,
        required: true
    }, 
    location: {
        type: String,
        required: false,
        default: null
    }, 
    category: {
        type: String,
        required: false,
        default: null
    }
});
const Event = model('Event', eventSchema);

// Middleware pre-save per impostare repeatCode
eventSchema.pre('save', async function(next) {
    if(this.isRepeated && !this.repeatCode) this.repeatCode = new Types.ObjectId();        //va creato (primo evento di una catena)
    
    next(); // Passa al prossimo middleware o salva il documento
});

export {
    User,
    Team,
    Event,
};