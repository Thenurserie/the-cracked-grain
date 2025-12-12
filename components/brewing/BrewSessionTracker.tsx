'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseStub';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Play, Pause, Check, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface BrewSession {
  id: string;
  user_id: string;
  recipe_id?: string;
  name: string;
  status: string;
  brew_date: string;
  bottle_date?: string;
  keg_date?: string;
  actual_og?: number;
  actual_fg?: number;
  actual_abv?: number;
  actual_ibu?: number;
  actual_srm?: number;
  actual_batch_size?: number;
  actual_efficiency?: number;
  rating?: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface BrewNote {
  id: string;
  session_id: string;
  note: string;
  timestamp: string;
}

const SESSION_STATUSES = [
  { value: 'planned', label: 'Planned', color: 'bg-blue-500' },
  { value: 'brewing', label: 'Brewing', color: 'bg-orange-500' },
  { value: 'fermenting', label: 'Fermenting', color: 'bg-purple-500' },
  { value: 'conditioning', label: 'Conditioning', color: 'bg-yellow-500' },
  { value: 'kegged', label: 'Kegged', color: 'bg-green-500' },
  { value: 'bottled', label: 'Bottled', color: 'bg-green-500' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-500' },
];

export function BrewSessionTracker() {
  const [sessions, setSessions] = useState<BrewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<BrewSession | null>(null);
  const [sessionNotes, setSessionNotes] = useState<BrewNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);

  const [newSession, setNewSession] = useState<Partial<BrewSession>>({
    name: '',
    status: 'planned',
    brew_date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      loadSessionNotes(selectedSession.id);
    }
  }, [selectedSession]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  async function loadSessions() {
    const { data, error } = await supabase
      .from('brew_sessions')
      .select('*')
      .order('brew_date', { ascending: false });

    if (data) {
      setSessions(data);
    }
  }

  async function loadSessionNotes(sessionId: string) {
    const { data, error } = await supabase
      .from('brew_session_notes')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false });

    if (data) {
      setSessionNotes(data);
    }
  }

  async function handleCreateSession() {
    const { data, error } = await supabase
      .from('brew_sessions')
      .insert([newSession])
      .select()
      .single();

    if (data) {
      await loadSessions();
      setSelectedSession(data);
      setShowNewSession(false);
      setNewSession({
        name: '',
        status: 'planned',
        brew_date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
      });
    }
  }

  async function handleUpdateSession(updates: Partial<BrewSession>) {
    if (!selectedSession) return;

    const { error } = await supabase
      .from('brew_sessions')
      .update(updates)
      .eq('id', selectedSession.id);

    if (!error) {
      setSelectedSession({ ...selectedSession, ...updates });
      await loadSessions();
    }
  }

  async function handleAddNote() {
    if (!selectedSession || !newNote.trim()) return;

    const { error } = await supabase
      .from('brew_session_notes')
      .insert([{
        session_id: selectedSession.id,
        note: newNote,
      }]);

    if (!error) {
      setNewNote('');
      await loadSessionNotes(selectedSession.id);
    }
  }

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function addTimerNote() {
    setNewNote(prev => {
      const timerNote = `[${formatTime(timer)}] `;
      return prev ? prev + '\n' + timerNote : timerNote;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Brew Sessions
              </span>
              <Button onClick={() => setShowNewSession(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Session
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessions.map(session => {
                const status = SESSION_STATUSES.find(s => s.value === session.status);
                return (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedSession?.id === session.id ? 'border-primary bg-muted/50' : ''
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{session.name}</h4>
                      <Badge className={status?.color}>{status?.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(session.brew_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {showNewSession && (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>New Brew Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Session Name</Label>
                <Input
                  value={newSession.name}
                  onChange={(e) => setNewSession({...newSession, name: e.target.value})}
                  placeholder="e.g., American IPA Batch #5"
                />
              </div>

              <div className="space-y-2">
                <Label>Brew Date</Label>
                <Input
                  type="date"
                  value={newSession.brew_date}
                  onChange={(e) => setNewSession({...newSession, brew_date: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newSession.status}
                  onValueChange={(value) => setNewSession({...newSession, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SESSION_STATUSES.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Initial Notes</Label>
                <Textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateSession} className="flex-1">
                  Create Session
                </Button>
                <Button onClick={() => setShowNewSession(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedSession && !showNewSession && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Brew Day Timer & Notes</CardTitle>
              <CardDescription>Track your brew day with timer and timestamped notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-4 p-8 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-5xl font-mono font-bold">{formatTime(timer)}</p>
                  <div className="flex gap-2 mt-4 justify-center">
                    <Button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      variant={isTimerRunning ? 'destructive' : 'default'}
                    >
                      {isTimerRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {isTimerRunning ? 'Pause' : 'Start'}
                    </Button>
                    <Button onClick={() => setTimer(0)} variant="outline">
                      Reset
                    </Button>
                    <Button onClick={addTimerNote} variant="outline">
                      <Clock className="mr-2 h-4 w-4" />
                      Add Timestamp
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Add Note</Label>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter brew day notes..."
                  rows={3}
                />
                <Button onClick={handleAddNote} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Session Notes</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sessionNotes.map(note => (
                    <div key={note.id} className="p-3 rounded-lg border bg-muted/30">
                      <p className="text-sm mb-1">{note.note}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Details & Measurements</CardTitle>
              <CardDescription>Track actual vs predicted values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={selectedSession.status}
                    onValueChange={(value) => handleUpdateSession({ status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SESSION_STATUSES.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Batch Size (gal)</Label>
                  <Input
                    type="number"
                    value={selectedSession.actual_batch_size || ''}
                    onChange={(e) => handleUpdateSession({ actual_batch_size: parseFloat(e.target.value) || undefined })}
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Original Gravity</Label>
                  <Input
                    type="number"
                    value={selectedSession.actual_og || ''}
                    onChange={(e) => handleUpdateSession({ actual_og: parseFloat(e.target.value) || undefined })}
                    step="0.001"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Final Gravity</Label>
                  <Input
                    type="number"
                    value={selectedSession.actual_fg || ''}
                    onChange={(e) => handleUpdateSession({ actual_fg: parseFloat(e.target.value) || undefined })}
                    step="0.001"
                  />
                </div>

                <div className="space-y-2">
                  <Label>ABV %</Label>
                  <Input
                    type="number"
                    value={selectedSession.actual_abv || ''}
                    onChange={(e) => handleUpdateSession({ actual_abv: parseFloat(e.target.value) || undefined })}
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Efficiency %</Label>
                  <Input
                    type="number"
                    value={selectedSession.actual_efficiency || ''}
                    onChange={(e) => handleUpdateSession({ actual_efficiency: parseFloat(e.target.value) || undefined })}
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>IBU</Label>
                  <Input
                    type="number"
                    value={selectedSession.actual_ibu || ''}
                    onChange={(e) => handleUpdateSession({ actual_ibu: parseFloat(e.target.value) || undefined })}
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>SRM</Label>
                  <Input
                    type="number"
                    value={selectedSession.actual_srm || ''}
                    onChange={(e) => handleUpdateSession({ actual_srm: parseFloat(e.target.value) || undefined })}
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bottle Date</Label>
                  <Input
                    type="date"
                    value={selectedSession.bottle_date || ''}
                    onChange={(e) => handleUpdateSession({ bottle_date: e.target.value || undefined })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Keg Date</Label>
                  <Input
                    type="date"
                    value={selectedSession.keg_date || ''}
                    onChange={(e) => handleUpdateSession({ keg_date: e.target.value || undefined })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating (1-5)</Label>
                  <Select
                    value={selectedSession.rating?.toString() || ''}
                    onValueChange={(value) => handleUpdateSession({ rating: value ? parseInt(value) : undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 ⭐</SelectItem>
                      <SelectItem value="2">2 ⭐⭐</SelectItem>
                      <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                      <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                      <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session Notes</Label>
                <Textarea
                  value={selectedSession.notes || ''}
                  onChange={(e) => handleUpdateSession({ notes: e.target.value })}
                  rows={4}
                  placeholder="Overall notes about this brew session..."
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}