import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Nat64 "mo:core/Nat64";

module {
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

  type OldUserData = {
    profile : OldProfile;
    entries : [OldEntry];
  };

  type OldActor = {
    users : Map.Map<Principal, OldUserData>;
  };

  public func run(old : OldActor) : OldActor {
    old;
  };
};
