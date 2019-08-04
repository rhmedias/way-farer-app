import passport from 'passport';
import Joi from '@hapi/joi';
import userHelper from '../helpers/user_helper';
import Trips from '../models/trips';
import Bookings from '../models/bookings';
const bookingsSchema = Joi.object().keys({
    id : Joi.number().integer(),
    trip_id : Joi.number().integer().min(1).required(),
    user_id : Joi.number().integer().min(1),
    seat_number : Joi.number().integer().min(1),
    created_on  : Joi.date()
});
export default  {
    validateBooking : (req, res, next) => {
        let { trip_id } = req.body;
        const validate = bookingsSchema.validate(req.body);
        const targetTrip = Trips.findbyField('id','trips', parseInt(trip_id));
        if(validate.error){
            return res.status(400).send({
                status : "error",
                error  : validate.error
            })
        }
        if(!targetTrip || targetTrip.status !== "active"){
            const status = !targetTrip ? 404 : 400;
            return res.status(status).send({
                status : "error",
                error  : status === 404 
                ? "The specified trip does not exist" 
                : "The target trip is not active"
            })
        }
        next();
    },
    isSeatAvailable : (req, res, next) => {
        let { trip_id, seat_number } = req.body;
        const validate = bookingsSchema.validate(req.body);
        const targetTrip = Trips.findbyField('id','trips', parseInt(trip_id));
        seat_number = (seat_number) ? parseInt(seat_number) : db.bookings.length + 1;
        const checkAvailability = db.bookings.filter(booking => parseInt(booking.seat_number) === seat_number);
        if(seat_number > parseInt(targetTrip.seating_capacity)){
            // the specified seat is not available
            return res.status(400).send({
                status : "error",
                error  : "The specified seat is not available"
            });
        }
        if(checkAvailability.length){
            // the seat is already taken 
            return res.status(400).send({
                status : "error",
                error  : `The specified seat is already taken, try with ${db.bookings.length + 1}`
            });
        }
        next();
    }

}
