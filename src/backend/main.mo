import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type PropertyId = Nat;
  type InquiryId = Nat;

  type PropertyType = {
    #land;
    #plot;
    #commercial;
  };

  type ListingStatus = {
    #available;
    #sold;
    #pending;
  };

  type PropertyListing = {
    id : PropertyId;
    title : Text;
    description : Text;
    propertyType : PropertyType;
    price : Float;
    size : Float;
    location : Text;
    status : ListingStatus;
    images : [Text];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type Inquiry = {
    id : InquiryId;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    propertyId : PropertyId;
    contacted : Bool;
    createdAt : Time.Time;
  };

  module PropertyListing {
    public func compare(listing1 : PropertyListing, listing2 : PropertyListing) : Order.Order {
      switch (Text.compare(listing1.title, listing2.title)) {
        case (#equal) { Text.compare(listing1.description, listing2.description) };
        case (order) { order };
      };
    };
  };

  module Inquiry {
    public func compare(inquiry1 : Inquiry, inquiry2 : Inquiry) : Order.Order {
      Text.compare(inquiry1.name, inquiry2.name);
    };
  };

  let listings = Map.empty<PropertyId, PropertyListing>();
  let inquiries = Map.empty<InquiryId, Inquiry>();

  let propertyIdCounter = Map.empty<PropertyId, ()>();
  let inquiryIdCounter = Map.empty<InquiryId, ()>();

  // Simple password-based admin login
  stable var simpleAdminPassword : Text = "NK@2026";

  public shared ({ caller }) func loginAsAdminWithPassword(password : Text) : async Bool {
    if (caller.isAnonymous()) { return false };
    if (password == simpleAdminPassword) {
      accessControlState.userRoles.add(caller, #admin);
      accessControlState.adminAssigned := true;
      return true;
    };
    return false;
  };

  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize the canister");
    };

    if (listings.isEmpty()) {
      let now = Time.now();

      let sampleListings : [PropertyListing] = [
        {
          id = 1;
          title = "Prime Agricultural Land";
          description = "Fertile land suitable for farming.";
          propertyType = #land;
          price = 100000.0;
          size = 5.0;
          location = "Rural Location";
          status = #available;
          images = ["url1", "url2"];
          createdAt = now;
          updatedAt = now;
        },
        {
          id = 2;
          title = "Residential Plot";
          description = "Ideal for building a family home.";
          propertyType = #plot;
          price = 50000.0;
          size = 0.5;
          location = "Suburban Area";
          status = #available;
          images = ["url3"];
          createdAt = now;
          updatedAt = now;
        },
        {
          id = 3;
          title = "Prime Commercial Land";
          description = "Excellent location for business development.";
          propertyType = #commercial;
          price = 100000.0;
          size = 2.0;
          location = "Urban Area";
          status = #available;
          images = ["url3", "url4"];
          createdAt = now;
          updatedAt = now;
        },
      ];

      for (listing in sampleListings.values()) {
        listings.add(listing.id, listing);
      };
    };
  };

  // ===== Authorization & User Profiles =====
  let accessControlState : AccessControl.AccessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ===== Property Listings =====

  public shared ({ caller }) func createListing(title : Text, description : Text, propertyType : PropertyType, price : Float, size : Float, location : Text, images : [Text]) : async PropertyId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create listings");
    };

    let newId = listings.size() + 1 : PropertyId;

    let listing : PropertyListing = {
      id = newId;
      title;
      description;
      propertyType;
      price;
      size;
      location;
      status = #available;
      images;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    listings.add(newId, listing);
    newId;
  };

  public shared ({ caller }) func updateListing(id : PropertyId, title : Text, description : Text, propertyType : PropertyType, price : Float, size : Float, location : Text, status : ListingStatus, images : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update listings");
    };

    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        let updatedListing : PropertyListing = {
          id;
          title;
          description;
          propertyType;
          price;
          size;
          location;
          status;
          images;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        listings.add(id, updatedListing);
      };
    };
  };

  public shared ({ caller }) func deleteListing(id : PropertyId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete listings");
    };

    if (not listings.containsKey(id)) {
      Runtime.trap("Listing not found");
    };

    listings.remove(id);
  };

  public query ({ caller }) func getListing(id : PropertyId) : async PropertyListing {
    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };
  };

  public query ({ caller }) func getAllListings() : async [PropertyListing] {
    listings.values().toArray().sort();
  };

  public query ({ caller }) func getAvailableListings() : async [PropertyListing] {
    listings.values().toArray().filter(func(l) { l.status == #available });
  };

  public query ({ caller }) func filterListingsByType(propertyType : PropertyType) : async [PropertyListing] {
    listings.values().toArray().filter(func(l) { l.propertyType == propertyType and l.status == #available });
  };

  public query ({ caller }) func filterListingsByTypeAndPrice(propertyType : PropertyType, maxPrice : Float) : async [PropertyListing] {
    listings.values().toArray().filter(func(l) { l.propertyType == propertyType and l.price <= maxPrice and l.status == #available });
  };

  public query ({ caller }) func filterListingsByMaxPrice(maxPrice : Float) : async [PropertyListing] {
    listings.values().toArray().filter(func(l) { l.price <= maxPrice and l.status == #available });
  };

  // ===== Inquiries =====
  public shared ({ caller }) func submitInquiry(name : Text, email : Text, phone : Text, message : Text, propertyId : PropertyId) : async InquiryId {
    if (not listings.containsKey(propertyId)) {
      Runtime.trap("Property does not exist");
    };

    let newId = inquiries.size() + 1 : InquiryId;

    let inquiry : Inquiry = {
      id = newId;
      name;
      email;
      phone;
      message;
      propertyId;
      contacted = false;
      createdAt = Time.now();
    };

    inquiries.add(newId, inquiry);
    newId;
  };

  public shared ({ caller }) func markInquiryContacted(id : InquiryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark inquiries as contacted");
    };

    switch (inquiries.get(id)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?existing) {
        let updatedInquiry : Inquiry = {
          id = existing.id;
          name = existing.name;
          email = existing.email;
          phone = existing.phone;
          message = existing.message;
          propertyId = existing.propertyId;
          contacted = true;
          createdAt = existing.createdAt;
        };
        inquiries.add(id, updatedInquiry);
      };
    };
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all inquiries");
    };

    inquiries.values().toArray().sort();
  };

  public query ({ caller }) func getInquiriesByProperty(propertyId : PropertyId) : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view property inquiries");
    };

    let filtered = inquiries.values().toArray().filter(func(i) { i.propertyId == propertyId });
    filtered;
  };

  public query ({ caller }) func getInquiriesByContactStatus(contacted : Bool) : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can filter inquiries by contact status");
    };

    let filtered = inquiries.values().toArray().filter(func(i) { i.contacted == contacted });
    filtered;
  };

  public query ({ caller }) func getPropertyInquiryCounts() : async [(PropertyId, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view inquiry counts");
    };

    let propertyIds = listings.keys().toArray();
    let result = List.empty<(PropertyId, Nat)>();

    for (propertyId in propertyIds.values()) {
      let count = inquiries.values().toArray().filter(func(i) { i.propertyId == propertyId }).size();
      result.add((propertyId, count));
    };

    result.reverse().toArray();
  };
};
