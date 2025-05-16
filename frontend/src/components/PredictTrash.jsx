import React, { useState } from 'react';
import { predictTrash } from '../services/api';

export default function PredictTrash() {
  const [file, setFile]         = useState(null);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);

  const onFileChange = e => {
    setResult(null);
    setFile(e.target.files[0]);
  };

  const onSubmit = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const { data } = await predictTrash(file);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la prédiction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Reconnaissance de déchets</h2>
      <input type="file" accept="image/*" onChange={onFileChange} />
      <button onClick={onSubmit} disabled={!file || loading}>
        {loading ? 'Analyse…' : 'Analyser l’image'}
      </button>
      {result && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Type détecté :</strong> {result.label} <br/>
          <strong>Confiance :</strong> {Math.round(result.confidence * 100)} %
        </div>
      )}
    </div>
  );
}
