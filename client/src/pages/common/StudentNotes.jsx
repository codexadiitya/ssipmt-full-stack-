import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function StudentNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/api/notes');
      if (res.data.success) setNotes(res.data.notes);
    } catch (err) {
      toast.error('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="stg" style={{ marginTop: '20px' }}>
      <div className="card">
        <div className="ct" style={{ fontSize: '18px', marginBottom: '32px' }}>
          <span style={{ color: 'var(--P)', marginRight: '8px' }}>📚</span> Study Materials
        </div>

        {loading ? <LoadingSkeleton count={4} /> : (
          <div className="sg">
            {notes.map(note => (
              <div key={note._id} className="st" style={{ minWidth: '220px' }}>
                <div className="st-ic" style={{ background: 'var(--PL)', color: 'var(--P)' }}>
                   <span style={{ fontSize: '24px' }}>📄</span>
                </div>
                <div className="fw9 f16 mb6" style={{ color: 'var(--T)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {note.title}
                </div>
                <div className="fw7 f12 c2 mb12">
                   {note.subject} · Semester {note.semester}
                </div>
                <div className="r jb">
                   <span className="bd bz f10" style={{ padding: '4px 10px' }}>{note.fileSize}</span>
                   <a 
                     href={note.fileUrl} 
                     target="_blank" 
                     rel="noreferrer" 
                     className="fw9 cp f12" 
                     style={{ textDecoration: 'none' }}
                   >
                     Download ⇣
                   </a>
                </div>
                <div className="mt12 f10 c3 fw6">
                  By {note.uploader?.name}
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="tc c3 fw7 f14" style={{ padding: '40px', width: '100%' }}>
                No study materials available for your branch yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
