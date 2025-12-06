export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  avatar: string;
  department: string;
  joinDate: string;
  city: string;
  bio: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  position?: string;
  avatar?: string;
  department?: string;
  joinDate?: string;
  city?: string;
  bio?: string;
}

