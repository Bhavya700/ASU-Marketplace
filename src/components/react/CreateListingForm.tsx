// src/components/react/CreateListingForm.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../context/Auth';

interface Category {
  id: number;
  name: string;
}

// NEW: Define the specific list of categories we want to allow in the dropdown.
const allowedCategories = [
    'Textbooks', 
    'Electronics', 
    'Clothing', 
    'Furniture', 
    'Tickets', 
    'Appliances', 
    'Other'
];

export default function CreateListingForm() {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (data) {
        // UPDATED: Filter the fetched data to only include the allowed categories.
        const filteredCategories = data.filter(cat => allowedCategories.includes(cat.name));
        setCategories(filteredCategories);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !imageFile || !selectedCategory) {
      setError('Please fill out all fields and select an image and category.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `listing-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-listings')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('public-listings')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;

      const { data: listingData, error: insertError } = await supabase
        .from('listings')
        .insert({
          title,
          description,
          price: parseFloat(price),
          quantity,
          image_url: publicUrl,
          seller_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const { error: categoryLinkError } = await supabase
        .from('listing_categories')
        .insert({
          listing_id: listingData.id,
          category_id: parseInt(selectedCategory),
        });
        
      if (categoryLinkError) throw categoryLinkError;

      setSuccess(true);
      setTimeout(() => {
        window.location.href = `/listings/${listingData.id}`;
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <div className="p-4 text-center text-green-600 bg-green-100 rounded-lg">Listing created successfully! Redirecting...</div>;
  }

  // The rest of the return statement (the JSX form) remains unchanged.
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asu-maroon focus:border-asu-maroon"/>
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asu-maroon focus:border-asu-maroon"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asu-maroon focus:border-asu-maroon"/>
            </div>
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asu-maroon focus:border-asu-maroon"/>
            </div>
        </div>

         <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-asu-maroon focus:border-asu-maroon">
                <option value="" disabled>Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
        </div>

        <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Listing Image</label>
            <input type="file" id="image" onChange={handleImageChange} required accept="image/png, image/jpeg" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-asu-maroon file:text-white hover:file:bg-opacity-90"/>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button type="submit" disabled={loading} className="w-full bg-asu-maroon text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center">
            {loading ? 'Creating...' : 'Create Listing'}
        </button>
    </form>
  );
}