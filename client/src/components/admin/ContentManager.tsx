import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus, ExternalLink, Image as ImageIcon } from "lucide-react";

interface ContentItem {
    id: string;
    section: string;
    title: string;
    subtitle?: string;
    description?: string;
    image_url?: string;
    link_url?: string;
    badge_text?: string;
    created_at?: string;
}

interface ContentManagerProps {
    section: string;
    title: string;
    labels: {
        title: string;
        subtitle?: string;
        description?: string;
        badge?: string;
    }
}

export function ContentManager({ section, title, labels }: ContentManagerProps) {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newItem, setNewItem] = useState<Partial<ContentItem>>({});

    useEffect(() => {
        fetchItems();
    }, [section]);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            // Public read is allowed, but let's be consistent or open. 
            // My API allowed public read.
            const res = await fetch(`/api/content-items?section=${section}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            toast.error("Failed to load items");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newItem.title) {
            toast.error("Title is required");
            return;
        }
        setIsLoading(true);
        try {
            const token = localStorage.getItem('welux_admin_token');
            const res = await fetch("/api/content-items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...newItem, section })
            });
            if (res.ok) {
                toast.success("Item added!");
                setNewItem({});
                fetchItems();
            } else {
                toast.error("Failed to add item");
            }
        } catch (error) {
            toast.error("Error adding item");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('welux_admin_token');
            const res = await fetch(`/api/content-items?id=${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success("Item deleted");
                setItems(items.filter(i => i.id !== id));
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-serif font-bold text-gray-800">{title} Manager</h2>
                <div className="text-sm text-gray-500">Managing {items.length} items</div>
            </div>

            {/* Add New Form */}
            <Card className="border-2 border-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Add New {title} Item
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">{labels.title}</label>
                            <Input
                                placeholder="E.g. Senior Event Manager..."
                                value={newItem.title || ""}
                                onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                            />
                        </div>
                        {labels.subtitle && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-gray-500">{labels.subtitle}</label>
                                <Input
                                    placeholder="E.g. Contract Type, Partner Name..."
                                    value={newItem.subtitle || ""}
                                    onChange={e => setNewItem({ ...newItem, subtitle: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Image URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    className="pl-9"
                                    placeholder="https://images.unsplash.com/..."
                                    value={newItem.image_url || ""}
                                    onChange={e => setNewItem({ ...newItem, image_url: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Link URL</label>
                            <div className="relative">
                                <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    className="pl-9"
                                    placeholder="https://..."
                                    value={newItem.link_url || ""}
                                    onChange={e => setNewItem({ ...newItem, link_url: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {labels.badge && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">{labels.badge}</label>
                            <Input
                                placeholder="E.g. 15% OFF, Urgent..."
                                value={newItem.badge_text || ""}
                                onChange={e => setNewItem({ ...newItem, badge_text: e.target.value })}
                            />
                        </div>
                    )}

                    {labels.description && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">{labels.description}</label>
                            <Textarea
                                placeholder="Details..."
                                value={newItem.description || ""}
                                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                            />
                        </div>
                    )}

                    <Button onClick={handleAdd} disabled={isLoading} className="w-full">
                        {isLoading ? "Adding..." : "Add Item"}
                    </Button>
                </CardContent>
            </Card>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {items.map(item => (
                    <Card key={item.id} className="group hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                            {item.image_url && (
                                <img src={item.image_url} alt="" className="w-16 h-16 rounded object-cover bg-gray-100" />
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    {item.badge_text && (
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                            {item.badge_text}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{item.subtitle}</p>
                                <p className="text-xs text-gray-400 truncate max-w-md">{item.description}</p>
                            </div>
                            <div className="flex gap-2">
                                {item.link_url && (
                                    <a href={item.link_url} target="_blank" rel="noreferrer">
                                        <Button variant="outline" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                                    </a>
                                )}
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {items.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                        No items found. Start adding some!
                    </div>
                )}
            </div>
        </div>
    );
}
