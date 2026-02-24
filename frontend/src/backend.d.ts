import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Entry {
    numberOfWipes: bigint;
    timestamp: Time;
}
export type Time = bigint;
export interface Profile {
    background: string;
    displayName: string;
    color: string;
    emoji: string;
}
export interface UserStats {
    principal: Principal;
    entries: Array<Entry>;
    totalToiletPaperRolls: bigint;
    avgWipesPerPoop: number;
    totalPoops: bigint;
    totalWipes: bigint;
    profile: Profile;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPoopEntry(numberOfWipes: bigint): Promise<void>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyEntries(): Promise<Array<Entry>>;
    getRankedUserStats(): Promise<{
        today: Array<UserStats>;
        allTime: Array<UserStats>;
    }>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    register(profile: Profile): Promise<void>;
    saveCallerUserProfile(profile: Profile): Promise<void>;
}
