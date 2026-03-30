import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const GalleryPage = () => {
    const { user } = useAuth();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fetchPhotos = async () => {
        try {
            const res = await fetch('http://localhost:5091/api/photos');
            if (res.ok) {
                const data = await res.json();
                setPhotos(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData(e.target);
        if (user) {
            // Append user info if available, otherwise form uses input
            // But form inputs "uploadedBy" is safest for MVP
        }

        try {
            const res = await fetch('http://localhost:5091/api/photos', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                await fetchPhotos();
                setIsUploadModalOpen(false);
                Swal.fire('¡Éxito!', 'Foto subida correctamente', 'success');
            } else {
                Swal.fire('Error', 'No se pudo subir la foto', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
             {/* Hero-like Header */}
            <div className="bg-institutional text-white py-16 px-4 mb-8 text-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <h1 className="text-4xl md:text-5xl font-bold font-title mb-4 animate-fade-in-down">Muro de Momentos</h1>
                <p className="text-xl text-gray-200 font-subtitle max-w-2xl mx-auto">
                    Compartí tu experiencia en el XVIII CONEIC. ¡Subí tus fotos y sé parte de la historia!
                </p>
                {/* Floating Upload Button or Centered CTA */}
                 <button 
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-8 bg-complementary-gold text-institutional font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Subir mi Foto
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-grow w-full">
                
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Cargando momentos...</div>
                ) : photos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <div className="text-6xl mb-4">📸</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Aún no hay fotos</h3>
                        <p className="text-gray-500">¡Sé el primero en compartir un momento!</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                        {photos.map((photo) => (
                            <div key={photo.id} className="break-inside-avoid bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
                                <div className="relative">
                                    <img 
                                        src={`http://localhost:5091${photo.url}`} 
                                        alt={photo.description} 
                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" 
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-4">
                                    {photo.description && (
                                        <p className="text-gray-800 font-medium mb-2 text-sm leading-snug">"{photo.description}"</p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-400 mt-2 border-t border-gray-100 pt-2">
                                        <span className="font-bold text-primary-blue">@{photo.uploadedBy}</span>
                                        <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up relative">
                        <button 
                            onClick={() => setIsUploadModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold text-institutional font-title mb-6 text-center">Subir Nuevo Recuerdo</h3>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tu Foto</label>
                                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer group">
                                    <input 
                                        type="file" 
                                        name="file" 
                                        accept="image/*" 
                                        required 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="space-y-2 pointer-events-none">
                                        <div className="text-4xl text-gray-300 group-hover:text-primary-blue transition-colors">☁️</div>
                                        <p className="text-sm text-gray-500 font-medium">Toca para seleccionar</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción (Opcional)</label>
                                <textarea name="description" rows="2" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-blue outline-none resize-none" placeholder="¿Qué momento capturaste?"></textarea>
                            </div>

                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tu Nombre / Usuario</label>
                                <input 
                                    name="uploadedBy" 
                                    defaultValue={user?.name || ''} 
                                    required 
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-blue outline-none" 
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="w-full bg-institutional text-white font-bold py-3 rounded-xl hover:bg-primary-blue transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Subiendo...
                                    </>
                                ) : 'Publicar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
