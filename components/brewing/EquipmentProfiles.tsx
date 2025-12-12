'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface EquipmentProfile {
  id?: string;
  name: string;
  batch_size: number;
  boil_size: number;
  evaporation_rate: number;
  tun_volume: number;
  tun_weight: number;
  tun_specific_heat: number;
  trub_chiller_loss: number;
  boil_time: number;
  efficiency: number;
  notes: string;
}

const DEFAULT_PROFILES: EquipmentProfile[] = [
  {
    name: '5 Gal BIAB',
    batch_size: 5.0,
    boil_size: 6.5,
    evaporation_rate: 1.5,
    tun_volume: 10.0,
    tun_weight: 5.0,
    tun_specific_heat: 0.3,
    trub_chiller_loss: 0.5,
    boil_time: 60,
    efficiency: 75,
    notes: 'Brew-in-a-bag setup with 10 gallon kettle'
  },
  {
    name: '10 Gal 3-Vessel',
    batch_size: 10.0,
    boil_size: 13.0,
    evaporation_rate: 2.0,
    tun_volume: 20.0,
    tun_weight: 10.0,
    tun_specific_heat: 0.3,
    trub_chiller_loss: 1.0,
    boil_time: 60,
    efficiency: 78,
    notes: 'Three-vessel system with separate HLT, mash tun, and boil kettle'
  },
  {
    name: '1 Gal Stovetop',
    batch_size: 1.0,
    boil_size: 1.5,
    evaporation_rate: 0.3,
    tun_volume: 2.0,
    tun_weight: 1.0,
    tun_specific_heat: 0.3,
    trub_chiller_loss: 0.1,
    boil_time: 60,
    efficiency: 70,
    notes: 'Small batch stovetop brewing'
  }
];

export default function EquipmentProfiles() {
  const [profiles, setProfiles] = useState<EquipmentProfile[]>([]);
  const [editingProfile, setEditingProfile] = useState<EquipmentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setProfiles(DEFAULT_PROFILES);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('equipment_profiles')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to load profiles');
    } else if (data && data.length > 0) {
      setProfiles(data);
    } else {
      setProfiles(DEFAULT_PROFILES);
    }

    setLoading(false);
  };

  const createNewProfile = () => {
    setEditingProfile({
      name: '',
      batch_size: 5.0,
      boil_size: 6.5,
      evaporation_rate: 1.0,
      tun_volume: 10.0,
      tun_weight: 5.0,
      tun_specific_heat: 0.3,
      trub_chiller_loss: 0.5,
      boil_time: 60,
      efficiency: 75,
      notes: ''
    });
  };

  const saveProfile = async () => {
    if (!editingProfile?.name) {
      toast.error('Please enter a profile name');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('Please sign in to save profiles');
      return;
    }

    const profileData = {
      user_id: user.id,
      ...editingProfile
    };

    const { error } = await supabase.from('equipment_profiles').insert([profileData]);

    if (error) {
      toast.error('Failed to save profile');
      console.error(error);
    } else {
      toast.success('Profile saved!');
      setEditingProfile(null);
      loadProfiles();
    }
  };

  const deleteProfile = async (id: string) => {
    const { error } = await supabase.from('equipment_profiles').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete profile');
    } else {
      toast.success('Profile deleted');
      loadProfiles();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profiles...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Equipment Profiles</h2>
        <Button onClick={createNewProfile}>
          <Plus className="h-4 w-4 mr-2" />
          New Profile
        </Button>
      </div>

      {editingProfile && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProfile.id ? 'Edit Profile' : 'New Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Profile Name</Label>
                <Input
                  id="name"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="batch_size">Batch Size (gal)</Label>
                <Input
                  id="batch_size"
                  type="number"
                  step="0.1"
                  value={editingProfile.batch_size}
                  onChange={(e) => setEditingProfile({ ...editingProfile, batch_size: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="boil_size">Boil Size (gal)</Label>
                <Input
                  id="boil_size"
                  type="number"
                  step="0.1"
                  value={editingProfile.boil_size}
                  onChange={(e) => setEditingProfile({ ...editingProfile, boil_size: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="evaporation_rate">Evaporation Rate (gal/hr)</Label>
                <Input
                  id="evaporation_rate"
                  type="number"
                  step="0.1"
                  value={editingProfile.evaporation_rate}
                  onChange={(e) => setEditingProfile({ ...editingProfile, evaporation_rate: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="tun_volume">Mash Tun Volume (gal)</Label>
                <Input
                  id="tun_volume"
                  type="number"
                  step="0.1"
                  value={editingProfile.tun_volume}
                  onChange={(e) => setEditingProfile({ ...editingProfile, tun_volume: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="trub_chiller_loss">Trub/Chiller Loss (gal)</Label>
                <Input
                  id="trub_chiller_loss"
                  type="number"
                  step="0.1"
                  value={editingProfile.trub_chiller_loss}
                  onChange={(e) => setEditingProfile({ ...editingProfile, trub_chiller_loss: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="boil_time">Boil Time (min)</Label>
                <Input
                  id="boil_time"
                  type="number"
                  value={editingProfile.boil_time}
                  onChange={(e) => setEditingProfile({ ...editingProfile, boil_time: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="efficiency">System Efficiency (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  value={editingProfile.efficiency}
                  onChange={(e) => setEditingProfile({ ...editingProfile, efficiency: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editingProfile.notes}
                onChange={(e) => setEditingProfile({ ...editingProfile, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
              <Button variant="outline" onClick={() => setEditingProfile(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Card key={profile.id || profile.name}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{profile.name}</span>
                {profile.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProfile(profile.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Batch Size:</span>
                <span className="font-semibold">{profile.batch_size} gal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Boil Size:</span>
                <span className="font-semibold">{profile.boil_size} gal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Evaporation:</span>
                <span className="font-semibold">{profile.evaporation_rate} gal/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Efficiency:</span>
                <span className="font-semibold">{profile.efficiency}%</span>
              </div>
              {profile.notes && (
                <div className="pt-2 text-muted-foreground text-xs">
                  {profile.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
