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
    getMyProfile(): Promise<Profile>;
    getRankedUserStats(): Promise<Array<UserStats>>;
    register(profile: Profile): Promise<void>;
}
