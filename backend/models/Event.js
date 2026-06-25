import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    club: {
      type: String,
      required: [true, 'Club name is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    registrationLink: {
      type: String,
      default: '',
    },
    registrationDeadline: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export default mongoose.model('Event', eventSchema);
