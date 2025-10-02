import { useState, useEffect } from 'react';
import EventsService from '../services/eventsService';

export const useEvents = (category) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await EventsService.getEventsByCategory(category);
        setEvents(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchEvents();
    }
  }, [category]);

  return { events, loading, error };
};

export const useAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await EventsService.getAllCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};