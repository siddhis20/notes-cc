import { useEffect, useState } from 'react';
import { getNotes } from './api.js';
import AddNote from './components/AddNote.jsx';
import EditNote from './components/EditNote.jsx';
import NotesList from './components/NotesList.jsx';
import { FileText, Sparkles } from 'lucide-react';

export default function App() {
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [editing, setEditing] = useState(null);
	const [message, setMessage] = useState('');

	async function refresh() {
		setLoading(true);
		setError('');
		try {
			const data = await getNotes();
			setNotes(data);
		} catch (e) {
			setError(e?.message || 'Failed to load notes');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		refresh();
	}, []);

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
			<header className="mb-6 sm:mb-8 text-center">
				<div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
					<div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
						<FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
					</div>
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
						My Notes
					</h1>
					<Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 animate-pulse" />
				</div>
				<p className="text-gray-600 text-base sm:text-lg">Capture your thoughts and ideas beautifully</p>
			</header>

			{message && (
				<div className="mb-6 glass p-4 text-green-800 text-sm rounded-xl border-l-4 border-green-500 animate-slide-in">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						{message}
					</div>
				</div>
			)}
			{error && (
				<div className="mb-6 glass p-4 text-rose-700 text-sm rounded-xl border-l-4 border-rose-500 animate-slide-in">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
						{error}
					</div>
				</div>
			)}

			<div className="flex flex-col gap-6 lg:gap-8">
				<div className="glass p-4 sm:p-6 rounded-2xl hover:shadow-xl transition-all duration-300 animate-fade-in">
					{editing ? (
						<EditNote
							initialNote={editing}
							onCancel={() => setEditing(null)}
							onSaved={(msg) => {
								setEditing(null);
								setMessage(msg);
								refresh();
							}}
						/>
					) : (
						<AddNote
							onCreated={(msg) => {
								setMessage(msg);
								refresh();
							}}
						/>
					)}
				</div>
				<div className="glass p-4 sm:p-6 rounded-2xl hover:shadow-xl transition-all duration-300 animate-fade-in">
					<NotesList
						notes={notes}
						loading={loading}
						onEdit={(note) => setEditing(note)}
						onChanged={(msg) => {
							setMessage(msg);
							refresh();
						}}
					/>
				</div>
			</div>
		</div>
	);
}
