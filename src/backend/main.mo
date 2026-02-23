import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat64 "mo:core/Nat64";
import Time "mo:core/Time";



actor {
  type Profile = {
    displayName : Text;
    emoji : Text;
    color : Text;
    background : Text;
  };

  type Entry = {
    timestamp : Time.Time;
    numberOfWipes : Nat;
  };

  module Entry {
    public func compare(a : Entry, b : Entry) : { #less; #equal; #greater } {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  type UserStats = {
    principal : Principal;
    profile : Profile;
    totalPoops : Nat;
    totalWipes : Nat64;
    totalToiletPaperRolls : Nat;
    avgWipesPerPoop : Nat64;
    entries : [Entry];
  };

  type UserData = {
    profile : Profile;
    entries : [Entry];
  };

  let users = Map.empty<Principal, UserData>();

  public shared ({ caller }) func register(profile : Profile) : async () {
    if (users.containsKey(caller)) { Runtime.trap("User is already registered") };
    let initialData : UserData = {
      profile;
      entries = [];
    };
    users.add(caller, initialData);
  };

  public shared ({ caller }) func createPoopEntry(numberOfWipes : Nat) : async () {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("Cannot create poop entry. User is not registered.") };
      case (?userData) {
        let newEntry : Entry = {
          timestamp = Time.now();
          numberOfWipes;
        };
        let updatedEntries = userData.entries.concat([newEntry]);
        let updatedData : UserData = {
          profile = userData.profile;
          entries = updatedEntries;
        };
        users.add(caller, updatedData);
      };
    };
  };

  public query ({ caller }) func getMyProfile() : async Profile {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("Cannot get profile. User is not registered.") };
      case (?userData) { userData.profile };
    };
  };

  public query ({ caller }) func getRankedUserStats() : async [UserStats] {
    let statsList = List.empty<UserStats>();

    for ((principal, userData) in users.entries()) {
      let totalPoops = userData.entries.size();
      var totalWipes : Nat64 = 0;

      for (entry in userData.entries.values()) {
        totalWipes += Nat64.fromNat(entry.numberOfWipes);
      };
      let totalRolls = totalWipes / 10;
      let avgWipesPerPoop : Nat64 = if (totalPoops > 0) {
        totalWipes / Nat64.fromNat(totalPoops);
      } else { 0 };
      statsList.add({
        principal;
        profile = userData.profile;
        totalPoops;
        totalWipes;
        totalToiletPaperRolls = totalRolls.toNat();
        avgWipesPerPoop;
        entries = userData.entries;
      });
    };

    statsList.toArray();
  };
};
