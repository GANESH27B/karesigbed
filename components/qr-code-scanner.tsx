
"use client";

import { useState, useRef } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';

interface User {
  id: string;
  name: string;
  registrationNumber: string;
  avatar?: string;
}

const QrCodeScanner = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const errorAudioRef = useRef<HTMLAudioElement>(null);

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (loading || detectedCodes.length === 0) return;

    const result = detectedCodes[0].rawValue;

    setLoading(true);
    setScannedData(result); // Keep this to show the raw scanned value
    setError(null);
    setUserInfo(null);

    try {
      const userRes = await fetch(`/api/users/lookup/${result}`);
      if (!userRes.ok) {
        throw new Error('User not found');
      }
      const user: User = await userRes.json();
      setUserInfo(user);

      await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      successAudioRef.current?.play();
    } catch (err: any) {
      setError(err.message);
      errorAudioRef.current?.play();
    } finally {
      setLoading(false);
      // Reset after a delay
      setTimeout(() => {
        setScannedData(null);
        setUserInfo(null);
        setError(null);
      }, 5000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <Scanner
          onScan={handleScan}
          onError={(error) => console.log(error?.message)}
        />
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      {userInfo && (
        <div className="mt-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{userInfo.name}</h3>
          <p>Registration #: {userInfo.registrationNumber}</p>
          <p>Attendance marked successfully!</p>
        </div>
      )}
      {scannedData && !userInfo && !error && !loading && (
        <div className="mt-4 p-4 border rounded-lg shadow-md">
            <h3 className="text-lg font-bold">Scanned Barcode Information</h3>
            <p>{scannedData}</p>
        </div>
      )}


      <audio ref={successAudioRef} src="/sounds/success.mp3" preload="auto" />
      <audio ref={errorAudioRef} src="/sounds/error.mp3" preload="auto" />
    </div>
  );
};

export default QrCodeScanner;
