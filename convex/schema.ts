import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
   users: defineTable({
      name: v.string(),
      email: v.string(),
      imageUrl: v.optional(v.string()),
      externalId: v.string()
   }).index("byExternalId", ["externalId"]),
   spots: defineTable({
      userId: v.optional(v.string()),
      name: v.string(),
      address: v.string(),
      city: v.string(),
      cuisine: v.optional(v.string()),
      rating: v.optional(v.float64()),
      metadata: v.object({
         websiteUrl: v.optional(v.string()),
         twitterUrl: v.optional(v.string()),
         igurl: v.optional(v.string()),
         fburl: v.optional(v.string()),
      }),
      sourceUrl: v.optional(v.string()),
      geocoords: v.object({
         long: v.float64(),
         lat: v.float64(),
      }),
   })
      .index("by_city", ["city"])
      .index("by_user", ["userId"])
      .index("by_lat_long", ["geocoords.lat", "geocoords.long"]),

   upvotes: defineTable({
      spotId: v.id("spots"),
      userId: v.string(),
   })
      .index("by_spot_user", ["spotId", "userId"])
      .index("by_spot", ["spotId"]),

   downvotes: defineTable({
      spotId: v.id("spots"),
      userId: v.string(),
   })
      .index("by_spot_user", ["spotId", "userId"])
      .index("by_spot", ["spotId"]),

   comments: defineTable({
      spotId: v.id("spots"),
      userId: v.string(),
      text: v.string(),
   })
      .index("by_spot", ["spotId"])
      .index("by_user", ["userId"]),

   images: defineTable({
      spotId: v.id("spots"),
      url: v.string(),
      key: v.string(),
   }).index("by_spot", ["spotId"]),
});
