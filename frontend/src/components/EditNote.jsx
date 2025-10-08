import { useState, useEffect } from 'react';
import { updateNote } from '../api.js';
import { Edit3, Save, X, Sparkles } from 'lucide-react';

export default function EditNote({ initialNote, onSaved, onCancel }) {
	const [title, setTitle] = useState(initialNote?.title || '');
	const [description, setDescription] = useState(initialNote?.description || '');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		setTitle(initialNote?.title || '');
		setDescription(initialNote?.description || '');
	}, [initialNote]);

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		if (!title.trim()) {
			setError('Title is required');
			return;
		}
		setLoading(true);
		try {
			await updateNote(initialNote.noteId, { title, description });
			onSaved?.('Note updated');
		} catch (e) {
			setError(e?.message || 'Failed to update note');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
				<div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
					<Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
				</div>
				<h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Note</h2>
				<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" />
			</div>
			
			{error && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
					<div className="w-2 h-2 bg-red-500 rounded-full"></div>
					{error}
				</div>
			)}
			
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<label className="block text-sm font-semibold text-gray-700">
						Title
					</label>
					<input
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 placeholder-gray-400"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Enter title"
					/>
				</div>
				<div className="space-y-2">
					<label className="block text-sm font-semibold text-gray-700">
						Description
					</label>
					<textarea
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 placeholder-gray-400 resize-none"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={4}
						placeholder="Enter description"
					/>
				</div>
				<div className="flex flex-col sm:flex-row gap-3">
					<button 
						type="submit" 
						className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2" 
						disabled={loading}
					>
						{loading ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span className="hidden sm:inline">Saving...</span>
								<span className="sm:hidden">Saving</span>
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								<span className="hidden sm:inline">Save Changes</span>
								<span className="sm:hidden">Save</span>
							</>
						)}
					</button>
					<button 
						type="button" 
						className="px-4 sm:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2" 
						onClick={onCancel}
					>
						<X className="w-4 h-4" />
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
