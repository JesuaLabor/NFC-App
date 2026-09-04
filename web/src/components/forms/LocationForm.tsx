import React, { useState } from 'react';
import { FormField } from './FormField';
import { Colors } from '../../constants/theme';
import { Navigation } from 'lucide-react';

interface LocationFormProps {
  value: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({ value, onChange }) => {
  const [locating, setLocating] = useState(false);
  const update = (key: string) => (text: string) => onChange({ ...value, [key]: text });

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          ...value,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
          label: value.label || 'Current Location',
        });
        setLocating(false);
      },
      (err) => {
        alert(`Could not fetch location: ${err.message}`);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="record-form">
      <div className="location-action-bar">
        <button
          type="button"
          className="location-gps-btn"
          onClick={handleGetCurrentLocation}
          disabled={locating}
        >
          <Navigation size={14} className={locating ? 'spin-anim' : ''} />
          <span>{locating ? 'Fetching GPS...' : 'Use Current Device Location'}</span>
        </button>
      </div>

      <div className="form-grid-2">
        <FormField
          label="Latitude"
          required
          accentColor={Colors.location}
          placeholder="e.g. 37.7749"
          value={value.latitude ?? ''}
          onChangeText={update('latitude')}
        />
        <FormField
          label="Longitude"
          required
          accentColor={Colors.location}
          placeholder="e.g. -122.4194"
          value={value.longitude ?? ''}
          onChangeText={update('longitude')}
        />
      </div>

      <FormField
        label="Location Label / Name (Optional)"
        accentColor={Colors.location}
        placeholder="e.g. Headquarters Front Gate"
        value={value.label ?? ''}
        onChangeText={update('label')}
        hint="Displayed in Google Maps / Apple Maps when opened."
      />
    </div>
  );
};
