import React, { useState } from 'react';
import { brewingApi } from '../../services/api';

interface AddReadingFormProps {
  sessionId: number;
  onAdded: () => void;
}

const AddReadingForm: React.FC<AddReadingFormProps> = ({ sessionId, onAdded }) => {
  const [gravity, setGravity] = useState(1.000);
  const [temp, setTemp] = useState(20);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    brewingApi.addReading(sessionId, { gravity, temperature: temp, notes }).then(() => {
      onAdded();
      setNotes('');
    });
  };

  return (
    <form className="reading-form" onSubmit={handleSubmit}>
      <h4>Ajouter une mesure</h4>
      <input type="number" step="0.001" value={gravity} onChange={e => setGravity(Number(e.target.value))} placeholder="Gravité" />
      <input type="number" value={temp} onChange={e => setTemp(Number(e.target.value))} placeholder="Temp (°C)" />
      <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddReadingForm;
