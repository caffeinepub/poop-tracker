import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";

module {
  type OldActor = { users : Map.Map<Principal, OldUserData> };

  type OldUserData = {
    profile : OldProfile;
    entries : [OldEntry];
  };

  type OldProfile = {
    displayName : Text;
    emoji : Text;
    color : Text;
    background : Text;
  };

  type OldEntry = {
    timestamp : Int;
    numberOfWipes : Nat;
  };

  type NewActor = { state : Map.Map<Principal, NewUserData> };

  type NewUserData = {
    profile : NewProfile;
    entries : List.List<NewEntry>;
  };

  type NewProfile = {
    displayName : Text;
    emoji : Text;
    color : Text;
    background : Text;
  };

  type NewEntry = {
    timestamp : Int;
    numberOfWipes : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newState = old.users.map<Principal, OldUserData, NewUserData>(
      func(_principal, oldUserData) {
        {
          profile = {
            displayName = oldUserData.profile.displayName;
            emoji = oldUserData.profile.emoji;
            color = oldUserData.profile.color;
            background = oldUserData.profile.background;
          };
          entries = List.fromArray<NewEntry>(oldUserData.entries.map( // convert array to list
            func(oldEntry) {
              { timestamp = oldEntry.timestamp; numberOfWipes = oldEntry.numberOfWipes };
            }
          ));
        };
      }
    );
    { state = newState };
  };
};
