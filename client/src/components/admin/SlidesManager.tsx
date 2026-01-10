
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, MonitorPlay, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const SlidesManager = () => {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const BUCKET_NAME = 'presentation'; // Ensure this bucket exists in Supabase

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .storage
                .from(BUCKET_NAME)
                .list(undefined, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (error) {
                // Check if bucket missing
                console.error('Error fetching slides:', error);
                if (error.message.includes('Bucket not found')) {
                    toast.error(`Bucket '${BUCKET_NAME}' no existe.`);
                }
            } else {
                setSlides(data || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setLoading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            toast.success('Slide subido correctamente');
            fetchSlides();
        } catch (error: any) {
            console.error('Error uploading:', error);
            toast.error('Error al subir imagen: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSlide = async (fileName: string) => {
        if (!confirm('¿Eliminar este slide?')) return;
        
        try {
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([fileName]);

            if (error) throw error;

            setSlides(slides.filter(s => s.name !== fileName));
            toast.success('Slide eliminado');
        } catch (error: any) {
            console.error('Error deleting:', error);
            toast.error('No se pudo eliminar');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
             <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <MonitorPlay className="text-amber-500" />
                        Gestor de Presentación
                    </h3>
                    <p className="text-sm text-slate-500">Administra las imágenes del carrusel principal.</p>
                 </div>
                 <div className="relative overflow-hidden group">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleUploadSlide}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        disabled={loading}
                    />
                    <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-amber-500/10 active:scale-95">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                        {loading ? 'Subiendo...' : 'Nuevo Slide'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map(file => {
                    // Get public URL
                    // Note: If bucket is private, use createSignedUrl, here assuming public
                    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
                    const publicUrl = data.publicUrl;

                    return (
                        <div key={file.id || file.name} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all hover:scale-[1.01]">
                            <div className="aspect-video relative overflow-hidden bg-slate-100">
                                <img 
                                    src={publicUrl} 
                                    className="w-full h-full object-cover" 
                                    alt={file.name} 
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                                    <button 
                                        onClick={() => handleDeleteSlide(file.name)}
                                        className="bg-red-500/90 text-white px-4 py-2 rounded-full font-bold text-xs hover:bg-red-600 transition-colors shadow-lg flex items-center gap-2 backdrop-blur-md"
                                    >
                                        <Trash2 size={16} />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                            <div className="p-3 bg-white border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-mono truncate">{file.name}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            {slides.length === 0 && !loading && (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                    <MonitorPlay className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">La presentación está vacía.</p>
                </div>
            )}
        </div>
    );
};
