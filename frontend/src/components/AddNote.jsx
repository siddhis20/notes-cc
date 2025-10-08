import { useState } from 'react';
import { createNote } from '../api.js';
import { Plus, Sparkles, FileText } from 'lucide-react';

export default function AddNote({ onCreated }) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		if (!title.trim()) {
			setError('Title is required');
			return;
		}
		setLoading(true);
		try {
			await createNote({ title, description });
			setTitle('');
			setDescription('');
			onCreated?.('Note created');
		} catch (e) {
			setError(e?.message || 'Failed to create note');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
				<div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
					<Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
				</div>
				<h2 className="text-xl sm:text-2xl font-bold text-gray-800">Create New Note</h2>
				<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 animate-pulse" />
			</div>
			
			{error && (
				<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
					<div className="w-2 h-2 bg-red-500 rounded-full"></div>
					{error}
				</div>
			)}
			
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
						<FileText className="w-4 h-4" />
						Title
					</label>
					<input
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="What's on your mind?"
					/>
				</div>
				<div className="space-y-2">
					<label className="block text-sm font-semibold text-gray-700">
						Description
					</label>
					<textarea
						className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 resize-none"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={4}
						placeholder="Add more details..."
					/>
				</div>
				<button 
					type="submit" 
					className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2" 
					disabled={loading}
				>
					{loading ? (
						<>
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							Creating...
						</>
					) : (
						<>
							<Plus className="w-4 h-4" />
							Create Note
						</>
					)}
				</button>
			</form>
		</div>
	);
}
