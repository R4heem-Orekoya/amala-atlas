import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { haversine } from "./utils";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const nearby = query({
   args: {
      lat: v.float64(),
      lng: v.float64(),
      radiusKm: v.float64(),
   },
   handler: async ({ db }, args) => {
      const spots = await db.query("spots").collect();
      return spots
         .map((spot) => ({
            ...spot,
            distanceKm: haversine({
               lat1: args.lat,
               lon1: args.lng,
               lat2: spot.geocoords.lat,
               lon2: spot.geocoords.long,
            }),
         }))
         .filter((s) => s.distanceKm <= args.radiusKm)
         .sort((a, b) => a.distanceKm - b.distanceKm);
   },
});

export const comments = query({
   args: {
      spotId: v.id("spots"),
      take: v.number(),
   },
   handler: async ({ db }, { spotId, take }) => {
      const comments = await db
         .query("comments")
         .filter((q) => q.eq(q.field("spotId"), spotId))
         .take(take);

      const results = await Promise.all(
         comments.map(async (c) => {
            const author = await db
               .query("users")
               .filter((q) => q.eq(q.field("externalId"), c.userId))
               .first();
            return {
               ...c,
               author,
            };
         })
      );

      return results;
   },
});

export const addComment = mutation({
   args: {
      spotId: v.id("spots"),
      text: v.string(),
   },
   handler: async (ctx, { spotId, text }) => {
      const user = await getCurrentUser(ctx);

      if (!user) {
         return {
            error: true,
            message: "You're not signed in!",
         };
      }

      const comment = await ctx.db.insert("comments", {
         spotId,
         text,
         userId: user.externalId,
      });

      return {
         error: false,
         comment,
      };
   },
});

export const deleteComment = mutation({
   args: {
      commentId: v.id("comments"),
   },
   handler: async (ctx, { commentId }) => {
      const user = await getCurrentUserOrThrow(ctx);

      const commentToDelete = await ctx.db
         .query("comments")
         .filter((q) => q.eq(q.field("_id"), commentId))
         .first();

      if (!commentToDelete) {
         throw new ConvexError("Comment does not exist!");
      }

      if (commentToDelete.userId !== user.externalId) {
         throw new ConvexError("You are unauthorized to delete this comment!");
      }

      await ctx.db.delete(commentId);
   },
});

export const upvotes = query({
   args: {
      spotId: v.id("spots"),
   },
   handler: async ({ db }, { spotId }) => {
      const upvotes = await db
         .query("upvotes")
         .withIndex("by_spot", (q) => q.eq("spotId", spotId))
         .collect();

      return upvotes;
   },
});

export const upvote = mutation({
   args: {
      spotId: v.id("spots"),
   },
   handler: async (ctx, { spotId }) => {
      const user = await getCurrentUser(ctx);

      if (!user)
         return {
            error: true,
            message: "You are not signed in!",
         };

      const existingUpvote = await ctx.db
         .query("upvotes")
         .withIndex("by_spot_user", (q) =>
            q.eq("spotId", spotId).eq("userId", user.externalId)
         )
         .first();

      if (existingUpvote) {
         await ctx.db.delete(existingUpvote._id);
         return;
      }

      const existingDownvote = await ctx.db
         .query("downvotes")
         .withIndex("by_spot_user", (q) =>
            q.eq("spotId", spotId).eq("userId", user.externalId)
         )
         .first();

      if (existingDownvote) {
         await ctx.db.delete(existingDownvote._id);
      }

      await ctx.db.insert("upvotes", {
         spotId,
         userId: user.externalId,
      });
   },
});

export const downvote = mutation({
   args: {
      spotId: v.id("spots"),
   },
   handler: async (ctx, { spotId }) => {
      const user = await getCurrentUser(ctx);

      if (!user)
         return {
            error: true,
            message: "You are not signed in!",
         };

      const existingDownvote = await ctx.db
         .query("downvotes")
         .withIndex("by_spot_user", (q) =>
            q.eq("spotId", spotId).eq("userId", user.externalId)
         )
         .first();

      if (existingDownvote) {
         await ctx.db.delete(existingDownvote._id);
         return;
      }

      const existingUpvote = await ctx.db
         .query("upvotes")
         .withIndex("by_spot_user", (q) =>
            q.eq("spotId", spotId).eq("userId", user.externalId)
         )
         .first();

      if (existingUpvote) {
         await ctx.db.delete(existingUpvote._id);
      }

      await ctx.db.insert("downvotes", {
         spotId,
         userId: user.externalId,
      });
   },
});

export const downvotes = query({
   args: {
      spotId: v.id("spots"),
   },
   handler: async ({ db }, { spotId }) => {
      const downvotes = await db
         .query("downvotes")
         .withIndex("by_spot", (q) => q.eq("spotId", spotId))
         .collect();

      return downvotes;
   },
});

export const bookmark = mutation({
   args: {
      spotId: v.id("spots"),
   },
   handler: async (ctx, { spotId }) => {
      const user = await getCurrentUser(ctx);

      if (!user)
         return {
            error: true,
            message: "You are not signed in!",
         };

      const existingBookmark = await ctx.db
         .query("bookmarks")
         .withIndex("by_spot_user", (q) =>
            q.eq("spotId", spotId).eq("userId", user.externalId)
         )
         .first();

      if (existingBookmark) {
         await ctx.db.delete(existingBookmark._id);
         return;
      }

      await ctx.db.insert("bookmarks", {
         spotId,
         userId: user.externalId,
      });
   },
});

export const bookmarks = query({
   handler: async (ctx) => {
      const user = await getCurrentUserOrThrow(ctx);

      const bookmarks = await ctx.db
         .query("bookmarks")
         .withIndex("by_user", (q) => q.eq("userId", user.externalId))
         .collect();

      const bookmarksWithSpots = await Promise.all(
         bookmarks.map(async (bookmark) => {
            const spot = await ctx.db.get(bookmark.spotId);
            return {
               ...bookmark,
               spot,
            };
         })
      );

      return bookmarksWithSpots;
   },
});

export const generateImageUploadUrl = mutation({
   handler: async (ctx) => {
      await getCurrentUserOrThrow(ctx);
      const uploadUrl = await ctx.storage.generateUploadUrl();
      return uploadUrl;
   },
});

export const addSpotWithImages = mutation({
   args: {
      name: v.string(),
      address: v.string(),
      category: v.string(),
      description: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      latitude: v.optional(v.float64()),
      longitude: v.optional(v.float64()),
      rating: v.optional(v.float64()),
      imageStorageIds: v.array(v.id("_storage")),
   },
   handler: async (ctx, args) => {
      const user = await getCurrentUserOrThrow(ctx);

      const spotId = await ctx.db.insert("spots", {
         userId: user.externalId,
         name: args.name,
         address: args.address,
         city: "",
         cuisine: args.category,
         rating: args.rating,
         description: args.description,
         tags: args.tags,
         metadata: {
            websiteUrl: undefined,
            twitterUrl: undefined,
            igurl: undefined,
            fburl: undefined,
         },
         sourceUrl: undefined,
         geocoords: {
            lat: args.latitude ?? 0,
            long: args.longitude ?? 0,
         },
      });

      for (const storageId of args.imageStorageIds) {
         await ctx.db.insert("images", {
            spotId,
            url: (await ctx.storage.getUrl(storageId)) || "",
            key: storageId.toString(),
         });
      }

      return spotId;
   },
});

export const allUpvotes = query({
   handler: async (ctx) => {
      return await ctx.db.query("upvotes").collect();
   },
});

export const allDownvotes = query({
   handler: async (ctx) => {
      return await ctx.db.query("downvotes").collect();
   },
});

export const findSimilarSpots = query({
   args: {
      name: v.string(),
      address: v.string(),
   },
   handler: async ({ db }, { name, address }) => {
      if (!name && !address) return [];

      const spots = await db.query("spots").collect();

      const normalize = (s?: string) =>
         (s || "")
            .toLowerCase()
            .replace(/[^a-z0-9\s]/gi, "")
            .trim();

      const nName = normalize(name);
      const nAddress = normalize(address);

      const matches = spots.filter((s) => {
         const sName = normalize(s.name);
         const sAddress = normalize(s.address);
         return (
            (nName && sName.includes(nName)) ||
            (nAddress && sAddress.includes(nAddress))
         );
      });

      return matches.slice(0, 10);
   },
});

export const imagesBySpot = query({
   args: {
      spotId: v.id("spots"),
   },
   handler: async ({ db }, { spotId }) => {
      return await db
         .query("images")
         .withIndex("by_spot", (q) => q.eq("spotId", spotId))
         .collect();
   },
});
