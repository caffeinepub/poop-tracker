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
export interface Profile {
    background: string;
    displayName: string;
    color: string;
    emoji: string;
}
export type Time = bigint;
export interface DailyStats {
    totalToiletPaperRolls: bigint;
    avgWipesPerPoop: number;
    totalPoops: bigint;
    totalWipes: bigint;
}
export interface UserStats {
    principal: Principal;
    entries: Array<Entry>;
    totalToiletPaperRolls: bigint;
    avgWipesPerPoop: bigint;
    totalPoops: bigint;
    totalWipes: bigint;
    profile: Profile;
}
export interface backendInterface {
    createPoopEntry(numberOfWipes: bigint): Promise<void>;
    getDailyStats(): Promise<DailyStats>;
    getMyProfile(): Promise<Profile>;
    getRankedUserStats(): Promise<Array<UserStats>>;
    register(profile: Profile): Promise<void>;
}
