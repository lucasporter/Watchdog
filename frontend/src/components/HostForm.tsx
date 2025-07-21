// frontend/src/components/HostForm.tsx
import { useState, FormEvent } from 'react';
import type { HostCreate } from '../types/host';
import { createHost } from '../services/api';

interface HostFormProps {
  onSuccess: () => void;
}

export function HostForm({ onSuccess }: HostFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createHost({ name, address });
      setName('');
      setAddress('');
      onSuccess();   // let parent refresh the list
    } catch (err) {
      console.error(err);
      setError('Failed to add host');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          className="mt-1 block w-full border px-2 py-1"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. web01"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Address</label>
        <input
          className="mt-1 block w-full border px-2 py-1"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="e.g. 10.0.0.5"
          required
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Adding…' : 'Add Host'}
      </button>
    </form>
  );
}

