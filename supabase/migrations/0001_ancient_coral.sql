/*
  # Scheduling System Database Schema

  1. New Tables
    - `appointments`
      - Stores appointment details including exam type, date, location
      - Links to user authentication
    - `notification_preferences`
      - Stores user notification settings
      - Controls email, SMS, and browser notifications
    - `notification_logs`
      - Tracks all sent notifications
      - Helps prevent duplicate notifications

  2. Security
    - Enable RLS on all tables
    - Policies ensure users can only access their own data
*/

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_type text NOT NULL CHECK (exam_type IN ('mri', 'ct', 'ultrasound', 'xray')),
  appointment_date timestamptz NOT NULL,
  imaging_center text NOT NULL,
  location text NOT NULL,
  notes text,
  email text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT true,
  browser_enabled boolean DEFAULT true,
  reminder_times integer[] DEFAULT ARRAY[1440, 60, 30, 15, 5], -- minutes before appointment
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notification logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  notification_type text NOT NULL CHECK (notification_type IN ('email', 'sms', 'browser')),
  minutes_before integer NOT NULL,
  sent_at timestamptz DEFAULT now(),
  status text NOT NULL CHECK (status IN ('success', 'failed')),
  error_message text
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Policies for appointments
CREATE POLICY "Users can create their own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for notification preferences
CREATE POLICY "Users can manage their notification preferences"
  ON notification_preferences
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for notification logs
CREATE POLICY "Users can view their notification logs"
  ON notification_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM appointments
    WHERE appointments.id = notification_logs.appointment_id
    AND appointments.user_id = auth.uid()
  ));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();