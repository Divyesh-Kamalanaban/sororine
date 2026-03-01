-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geometry columns for Incident table
ALTER TABLE "Incident"
ADD COLUMN IF NOT EXISTS location_geog geography(Point, 4326);

-- Create index on Incident geography for fast spatial queries
CREATE INDEX IF NOT EXISTS incident_geog_idx 
ON "Incident" 
USING GIST(location_geog);

-- Add geometry columns for UserLocation table
ALTER TABLE "UserLocation"
ADD COLUMN IF NOT EXISTS location_geog geography(Point, 4326);

-- Create index on UserLocation geography for fast spatial queries
CREATE INDEX IF NOT EXISTS user_location_geog_idx 
ON "UserLocation" 
USING GIST(location_geog);

-- Trigger to automatically populate location_geog from lat/lng for Incident
CREATE OR REPLACE FUNCTION update_incident_geog()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location_geog := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS incident_geog_update ON "Incident";
CREATE TRIGGER incident_geog_update
BEFORE INSERT OR UPDATE ON "Incident"
FOR EACH ROW
EXECUTE FUNCTION update_incident_geog();

-- Trigger to automatically populate location_geog from lat/lng for UserLocation
CREATE OR REPLACE FUNCTION update_user_location_geog()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location_geog := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_location_geog_update ON "UserLocation";
CREATE TRIGGER user_location_geog_update
BEFORE INSERT OR UPDATE ON "UserLocation"
FOR EACH ROW
EXECUTE FUNCTION update_user_location_geog();
