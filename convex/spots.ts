import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { haversine } from "./utils";
import { getCurrentUserOrThrow } from "./users";

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
      const user = await getCurrentUserOrThrow(ctx);

      const comment = await ctx.db.insert("comments", {
         spotId,
         text,
         userId: user.externalId,
      });

      return comment;
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
      const upvotes = await db.query("upvotes").collect();

      return upvotes;
   },
});

export const downvotes = query({
   args: {
      spotId: v.id("spots"),
   },
   handler: async ({ db }, { spotId }) => {
      const downvotes = await db.query("downvotes").collect();

      return downvotes;
   },
});
