import Event from '../models/Event.js';

// GET /api/events — public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json({ message: 'Failed to fetch events' });
  }
};

// POST /api/events — admin only
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, club, image, registrationLink, registrationDeadline } = req.body;

    if (!title || !description || !date || !time || !venue || !club) {
      return res.status(400).json({
        message: 'Title, description, date, time, venue, and club are required',
      });
    }

    const event = await Event.create({
      title, description, date, time, venue, club,
      image: image || '',
      registrationLink: registrationLink || '',
      registrationDeadline: registrationDeadline || '',
    });

    return res.status(201).json({ event });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)[0]?.message || 'Invalid input';
      return res.status(400).json({ message });
    }
    console.error('Create event error:', error);
    return res.status(500).json({ message: 'Failed to create event' });
  }
};

// PUT /api/events/:id — admin only
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, venue, club, image, registrationLink, registrationDeadline } = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      { title, description, date, time, venue, club, image, registrationLink, registrationDeadline },
      { new: true, runValidators: true }
    );

    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.status(200).json({ event });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid event ID' });
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)[0]?.message || 'Invalid input';
      return res.status(400).json({ message });
    }
    console.error('Update event error:', error);
    return res.status(500).json({ message: 'Failed to update event' });
  }
};

// DELETE /api/events/:id — admin only
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid event ID' });
    console.error('Delete event error:', error);
    return res.status(500).json({ message: 'Failed to delete event' });
  }
};
