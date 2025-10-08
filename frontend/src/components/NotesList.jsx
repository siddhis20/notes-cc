import { deleteNote } from '../api.js';
import { Search, Edit3, Trash2, FileText, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function NotesList({ notes, loading, onEdit, onChanged }) {
	const [searchTerm, setSearchTerm] = useState('');
	const [deletingId, setDeletingId] = useState(null);

	async function handleDelete(id) {
		setDeletingId(id);
		try {
			await deleteNote(id);
			onChanged?.('Note deleted');
		} finally {
			setDeletingId(null);
		}
	}

	const filteredNotes = notes.filter(note => 
		note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		note.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
				<p className="text-gray-600">Loading your notes...</p>
			</div>
		);
	}

	if (!notes.length) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
					<FileText className="w-12 h-12 text-indigo-500" />
				</div>
				<h3 className="text-xl font-semibold text-gray-800 mb-2">No notes yet</h3>
				<p className="text-gray-600 mb-4">Start capturing your thoughts and ideas!</p>
				<div className="flex items-center gap-2 text-indigo-500">
					<Sparkles className="w-4 h-4 animate-pulse" />
					<span className="text-sm">Create your first note above</span>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
					<FileText className="w-5 h-5 text-white" />
				</div>
				<h2 className="text-2xl font-bold text-gray-800">Your Notes</h2>
				<span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
					{notes.length}
				</span>
			</div>

			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						placeholder="Search notes..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
					/>
				</div>
			</div>

			{filteredNotes.length === 0 && searchTerm ? (
				<div className="text-center py-8">
					<Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600">No notes found matching "{searchTerm}"</p>
				</div>
			) : (
				<div className="space-y-4 max-h-96 overflow-y-auto">
					{filteredNotes.map((n) => (
						<div key={n.noteId} className="glass p-4 sm:p-5 rounded-xl hover:shadow-lg transition-all duration-300 group animate-scale-in">
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
								<div className="flex-1 min-w-0">
									<h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2 group-hover:text-indigo-600 transition-colors">
										{n.title}
									</h3>
									{n.description && (
										<p className="text-gray-700 whitespace-pre-wrap mb-3 leading-relaxed text-sm sm:text-base">
											{n.description}
										</p>
									)}
									<div className="flex items-center gap-2 text-xs text-gray-500">
										<Calendar className="w-3 h-3" />
										<span>Updated {new Date(n.updatedAt || n.createdAt).toLocaleString()}</span>
									</div>
								</div>
								<div className="flex flex-col sm:flex-row gap-2 shrink-0">
									<button 
										className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium" 
										onClick={() => onEdit?.(n)}
									>
										<Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
										<span className="hidden sm:inline">Edit</span>
									</button>
									<button 
										className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium disabled:opacity-50" 
										onClick={() => handleDelete(n.noteId)}
										disabled={deletingId === n.noteId}
									>
										{deletingId === n.noteId ? (
											<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
										) : (
											<Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
										)}
										<span className="hidden sm:inline">Delete</span>
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
