import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const AdminScannerPage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader", 
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText) {
             // Avoid duplicate quick scans
             // In real app, verify against API here
            setScanResult(decodedText);
            setHistory(prev => [
                { id: Date.now(), text: decodedText, time: new Date().toLocaleTimeString() },
                ...prev.slice(0, 4) // Keep last 5
            ]);
            
            // Optionally clear after 3 seconds to allow next scan
            // setTimeout(() => setScanResult(null), 3000);
        }

        function onScanFailure(error) {
            // handle error if needed, usually just ignore noise
        }

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-institutional mb-6 text-center">Escáner de Asistencia</h2>
            
            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                 <div id="reader" className="w-full"></div>
            </div>

            {scanResult && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 animate-pulse">
                    <p className="font-bold">¡Escaneo Exitoso!</p>
                    <p className="text-sm">{scanResult}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50 font-bold text-gray-600 text-sm">
                    Historial Reciente
                </div>
                <ul>
                    {history.length === 0 && <li className="p-4 text-center text-gray-400 text-sm">Esperando escaneos...</li>}
                    {history.map(item => (
                        <li key={item.id} className="p-4 border-b border-gray-50 flex justify-between items-center">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{item.text}</span>
                            <span className="text-xs text-gray-400">{item.time}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminScannerPage;
