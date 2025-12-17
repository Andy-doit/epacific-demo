import { useState, useEffect, useMemo, useCallback } from "react";
import { User, Mail, Phone, MapPin, Calendar, Save, Edit2, X, Briefcase, Building2, Camera, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useProfile, useUpdateProfile } from "@/hooks/api/useProfile";
import { useAppDispatch } from "@/store/hooks";
import { setProfile, updateProfile as updateProfileAction } from "@/store/slices/profile.slice";
import { getInitials } from "@/utils/format";
import type { Profile } from "@/types/profile.types";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData(profile);
      dispatch(setProfile(profile));
    }
  }, [profile, dispatch]);

  // Reset form data when canceling edit
  const handleCancel = useCallback(() => {
    if (profile) {
      setFormData(profile);
    }
    setIsEditing(false);
  }, [profile]);

  const handleInputChange = useCallback((field: keyof Profile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!profile?.id) return;

    try {
      const updatedProfile = await updateProfileMutation.mutateAsync({
        id: profile.id,
        payload: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          position: formData.position,
          department: formData.department,
          joinDate: formData.joinDate,
          city: formData.city,
          bio: formData.bio,
          avatar: formData.avatar,
        },
      });

      // Update Redux store
      dispatch(updateProfileAction(updatedProfile));
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to update profile:', error);
    }
  }, [profile, formData, updateProfileMutation, dispatch]);

  // Memoize display values to avoid recalculating on every render
  // Must be called before any early returns to follow Rules of Hooks
  const displayValues = useMemo(() => {
    if (!profile) {
      return {
        name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        joinDate: '',
        city: '',
        bio: '',
        avatar: '',
      };
    }
    return {
      name: formData.fullName || profile.fullName || '',
      email: formData.email || profile.email || '',
      phone: formData.phoneNumber || profile.phoneNumber || '',
      position: formData.position || profile.position || '',
      department: formData.department || profile.department || '',
      joinDate: formData.joinDate || profile.joinDate || '',
      city: formData.city || profile.city || '',
      bio: formData.bio || profile.bio || '',
      avatar: formData.avatar || profile.avatar || '',
    };
  }, [formData, profile]);

  const { name: displayName, email: displayEmail, phone: displayPhone, position: displayPosition, department: displayDepartment, joinDate: displayJoinDate, city: displayCity, bio: displayBio, avatar: displayAvatar } = displayValues;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
                <X className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Failed to load profile</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No profile data
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Profile
          </h2>
          <p className="text-sm text-muted-foreground/80">
            Manage your personal information and account settings
          </p>
        </div>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="shadow-sm"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="shadow-sm"
              disabled={updateProfileMutation.isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={updateProfileMutation.isPending}
              className="shadow-sm"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Basic info */}
        <Card className="shadow-sm border-border/50 overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5" />
          <CardHeader className="pb-3">
            <div className="flex flex-col items-center -mt-16 mb-4">
              <div className="relative group">
                <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
                  <AvatarImage src={displayAvatar} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold">{displayName}</h3>
                <p className="text-sm text-muted-foreground/80">{displayPosition}</p>
              </div>
            </div>
         
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pb-6">
            {isEditing && (
              <div className="w-full space-y-2">
                <Label htmlFor="avatar" className="text-sm font-medium">
                  Avatar URL
                </Label>
                <Input
                  id="avatar"
                  type="url"
                  value={displayAvatar}
                  onChange={(e) => handleInputChange("avatar", e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="shadow-sm border-border/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
            <div className="w-full space-y-2 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground/70">Department</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {displayDepartment}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground/70">Join Date</span>
                <span className="font-medium">
                  {new Date(displayJoinDate).toLocaleDateString("en-US", { 
                    month: "short", 
                    year: "numeric" 
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal info */}
        <Card className="md:col-span-2 shadow-sm border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-sm">
              Update your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                  <User className="h-4 w-4 text-primary/70" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="fullName"
                    value={displayName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="shadow-sm border-border/50 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <div className="text-sm py-2.5 px-4 bg-muted/30 rounded-lg border border-border/50 min-h-[40px] flex items-center">
                    {displayName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                  <Mail className="h-4 w-4 text-primary/70" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={displayEmail}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="shadow-sm border-border/50 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <div className="text-sm py-2.5 px-4 bg-muted/30 rounded-lg border border-border/50 min-h-[40px] flex items-center">
                    {displayEmail}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                  <Phone className="h-4 w-4 text-primary/70" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phoneNumber"
                    value={displayPhone}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="shadow-sm border-border/50 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <div className="text-sm py-2.5 px-4 bg-muted/30 rounded-lg border border-border/50 min-h-[40px] flex items-center">
                    {displayPhone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                  <Briefcase className="h-4 w-4 text-primary/70" />
                  Position
                </Label>
                {isEditing ? (
                  <Input
                    id="position"
                    value={displayPosition}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    className="shadow-sm border-border/50 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <div className="text-sm py-2.5 px-4 bg-muted/30 rounded-lg border border-border/50 min-h-[40px] flex items-center">
                    {displayPosition}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                  <Building2 className="h-4 w-4 text-primary/70" />
                  Department
                </Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={displayDepartment}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    className="shadow-sm border-border/50 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <div className="text-sm py-2.5 px-4 bg-muted/30 rounded-lg border border-border/50 min-h-[40px] flex items-center">
                    {displayDepartment}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate" className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                  <Calendar className="h-4 w-4 text-primary/70" />
                  Join Date
                </Label>
                {isEditing ? (
                  <Input
                    id="joinDate"
                    type="date"
                    value={displayJoinDate}
                    onChange={(e) => handleInputChange("joinDate", e.target.value)}
                    className="shadow-sm border-border/50 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <div className="text-sm py-2.5 px-4 bg-muted/30 rounded-lg border border-border/50 min-h-[40px] flex items-center">
                    {new Date(displayJoinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-2" />

            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                <MapPin className="h-4 w-4 text-primary/70" />
                City
              </Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={displayCity}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="shadow-sm border-border/50 focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <div className="text-sm py-2.5 px-4 bg-muted/30 rounded-lg border border-border/50 min-h-[40px] flex items-center">
                  {displayCity}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                <User className="h-4 w-4 text-primary/70" />
                Bio
              </Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={displayBio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="shadow-sm border-border/50 focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="text-sm py-2.5 px-4 bg-muted/30 rounded-lg border border-border/50 min-h-[100px] flex items-start whitespace-pre-wrap">
                  {displayBio}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
