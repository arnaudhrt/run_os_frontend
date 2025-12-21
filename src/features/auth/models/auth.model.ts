export interface UserModel {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  firebase_uid: string;
  garmin_user_id?: string;
  strava_athlete_id?: number;
  created_at: string;
  updated_at: string;
  strava_account: StravaAccountModel | null;
  garmin_account: GarminAccountModel | null;
}

export interface StravaAccountModel {
  id: string;
  user_id: string;
  strava_athlete_id: number;
  access_token: string;
  refresh_token: string;
  expires_at: Date;
  scope?: string;
  last_sync_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface GarminAccountModel {
  id: string;
  user_id: string;
  garmin_email: string;
  garmin_password_encrypted: string;
  oauth1_token?: object;
  oauth2_token?: object;
  last_sync_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserModel {
  first_name: string;
  last_name: string;
  email: string;
  firebase_uid: string;
}
