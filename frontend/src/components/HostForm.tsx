// frontend/src/components/HostForm.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';

interface HostFormProps {
  onSuccess: () => void;
}

export function HostForm({ onSuccess }: HostFormProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implement host creation when needed
    console.log("Host creation not implemented yet");
    onSuccess();
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Add Host</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Host
        </button>
      </form>
    </div>
  );
}

