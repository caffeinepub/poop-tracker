import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat64 "mo:core/Nat64";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Types
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

  type UserStats = {
    principal : Principal;
    profile : Profile;
    totalPoops : Nat;
    totalWipes : Nat;
    totalToiletPaperRolls : Nat;
    avgWipesPerPoop : Float;
    entries : [Entry];
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent user state
  let state = Map.empty<Principal, { profile : Profile; entries : List.List<Entry> }>();

  // --- Required profile functions for frontend ---

  // Get current user's profile (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    switch (state.get(caller)) {
      case (null) { null };
      case (?userData) { ?userData.profile };
    };
  };

  // Save current user's profile (required by frontend)
  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    switch (state.get(caller)) {
      case (null) {
        let initialEntries = List.empty<Entry>();
        state.add(caller, { profile; entries = initialEntries });
      };
      case (?userData) {
        state.add(caller, { profile; entries = userData.entries });
      };
    };
  };

  // Get another user's profile (required by frontend)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (state.get(user)) {
      case (null) { null };
      case (?userData) { ?userData.profile };
    };
  };

  // --- Application-specific functions ---

  // Register new user if not already registered
  public shared ({ caller }) func register(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register");
    };
    if (state.containsKey(caller)) {
      Runtime.trap("User is already registered");
    };
    let initialEntries = List.empty<Entry>();
    state.add(caller, { profile; entries = initialEntries });
  };

  // Add Poop Entry
  public shared ({ caller }) func createPoopEntry(numberOfWipes : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create poop entries");
    };
    switch (state.get(caller)) {
      case (null) { Runtime.trap("Cannot create poop entry: User is not registered.") };
      case (?userData) {
        let newEntry : Entry = {
          timestamp = Time.now();
          numberOfWipes;
        };
        userData.entries.add(newEntry);
        state.add(caller, { profile = userData.profile; entries = userData.entries });
      };
    };
  };

  // Get all entries for current user
  public query ({ caller }) func getMyEntries() : async [Entry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their entries");
    };
    switch (state.get(caller)) {
      case (null) { Runtime.trap("Cannot get entries: User is not registered.") };
      case (?userData) { userData.entries.toArray() };
    };
  };

  // Get ranked user stats (all time and daily) - public, no auth required
  public query func getRankedUserStats() : async {
    allTime : [UserStats];
    today : [UserStats];
  } {
    let now = Time.now();
    let todayMidnight = (now / 86_400_000_000_000) * 86_400_000_000_000;

    var allTimeList : List.List<UserStats> = List.empty<UserStats>();
    var dailyList : List.List<UserStats> = List.empty<UserStats>();

    for ((principal, userData) in state.entries()) {
      let entriesArray = userData.entries.toArray();
      let totalPoops = entriesArray.size();
      var totalWipes = 0;

      for (entry in entriesArray.vals()) {
        totalWipes += entry.numberOfWipes;
      };

      let totalRolls = totalWipes / 10;
      let avgWipesPerPoop : Float = if (totalPoops > 0) {
        totalWipes.toFloat() / totalPoops.toFloat();
      } else { 0.0 };

      allTimeList.add({
        principal;
        profile = userData.profile;
        totalPoops;
        totalWipes;
        totalToiletPaperRolls = totalRolls;
        avgWipesPerPoop;
        entries = entriesArray;
      });

      // Daily stats
      let dailyEntries = entriesArray.filter(func(entry) { entry.timestamp >= todayMidnight });
      let dailyPoops = dailyEntries.size();
      var dailyWipes = 0;
      for (entry in dailyEntries.vals()) {
        dailyWipes += entry.numberOfWipes;
      };

      let dailyRolls = dailyWipes / 10;
      let dailyAvgWipes : Float = if (dailyPoops > 0) {
        dailyWipes.toFloat() / dailyPoops.toFloat();
      } else { 0.0 };

      dailyList.add({
        principal;
        profile = userData.profile;
        totalPoops = dailyPoops;
        totalWipes = dailyWipes;
        totalToiletPaperRolls = dailyRolls;
        avgWipesPerPoop = dailyAvgWipes;
        entries = dailyEntries;
      });
    };

    {
      allTime = allTimeList.toArray();
      today = dailyList.toArray();
    };
  };
};
