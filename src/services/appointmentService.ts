import { supabase } from '../lib/supabase';
import { Appointment } from '../types/exam';

export const appointmentService = {
  async createAppointment(appointment: Omit<Appointment, 'id'>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        exam_type: appointment.examType,
        appointment_date: appointment.date,
        imaging_center: appointment.imagingCenter,
        location: appointment.location,
        notes: appointment.notes,
        email: appointment.contactInfo?.email,
        phone: appointment.contactInfo?.phone,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateAppointment(appointment: Appointment) {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        exam_type: appointment.examType,
        appointment_date: appointment.date,
        imaging_center: appointment.imagingCenter,
        location: appointment.location,
        notes: appointment.notes,
        email: appointment.contactInfo?.email,
        phone: appointment.contactInfo?.phone,
      })
      .eq('id', appointment.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteAppointment(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};