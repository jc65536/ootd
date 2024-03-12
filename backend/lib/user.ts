import { convertTo24CharHex } from "../endpoints/utils";
import { getClient } from "./db-lib/db-client";
import { DbItem } from "./db-lib/db-item";
import { COLLECTION } from "./enums";
import { ObjectId, WithId } from "mongodb";
import { Wardrobe } from "./wardrobe";
import { Post } from "./post";

type UserDatabaseEntry = {
    _id: ObjectId,
    posts: ObjectId[], // the ids of the Post objects
    wardrobe: ObjectId,
    name: string,
    followers: number,
    streaks: number,
    bestStreak: number,
    ratedPosts: Map<ObjectId, number>
};

export class User extends DbItem {
    posts: ObjectId[];
    wardrobe: ObjectId | null;
    name: string;
    followers: number;
    streaks: number;
    bestStreak: number;
    // private dbClient = getClient();
    ratedPosts: Map<ObjectId, number>;

    constructor(id: ObjectId) {
        super(id, COLLECTION.USERS);
        this.posts = [];
        this.wardrobe = null;
        this.name = '';
        this.followers = 0;
        this.streaks = 0;
        this.bestStreak = 0;
        this.ratedPosts = new Map<ObjectId, number>();
    }

    public static async fromId(userObjectId: ObjectId) {
        const dbClient = getClient();
        const document: UserDatabaseEntry = await dbClient.findDbItem(COLLECTION.USERS, userObjectId);
        if (!document) {
            console.log("User doesn't exist: "+userObjectId);
            return null;
        }
        const user = new User(userObjectId);
        user.posts = document.posts ?? user.posts;
        user.wardrobe = document.wardrobe ?? user.wardrobe;
        user.name = document.name ?? user.name;
        user.followers = document.followers ?? user.followers;
        user.streaks = document.streaks ?? user.streaks;
        user.ratedPosts = document.ratedPosts ?? user.ratedPosts;
        return user;
    }
    /**
     *
     * @param userObjectId the user's google ID
     * should be retrieved from Google API using the google OAuth token
     * @returns
     */
    public static async create(userObjectId: ObjectId): Promise<User | null> {
        //create wardrobe for the user
        const newWardrobe = await Wardrobe.create(userObjectId);
        const wardrobeUID = newWardrobe != null ? newWardrobe?.id : null;
        const newUser = new User(userObjectId);
        newUser.wardrobe = wardrobeUID;
        await newUser.writeToDatabase();
        return newUser;
    }

    /**
     *
     * @returns all posts of the user in String format
     */
    public async getPosts(): Promise<ObjectId[] | null> {
        return this.posts;
    }

    public async getCurrStreak(): Promise<number> {
        var streak = 1;
        for (var i = this.posts.length - 1; i > 0; i--) {
            // note: assume posts are sorted by time
            const curr_post = await Post.fromId(this.posts[i]);
            const prev_post = await Post.fromId(this.posts[i - 1]);
            const curr_date = await curr_post.getDate();
            const prev_date = await prev_post.getDate();
            // 1 day
            if (curr_date.getTime() - prev_date.getTime() < 1000 * 60 * 60 * 24) {
                streak++;
            }
        }
        return streak;
    }

    public async getBestStreak(): Promise<number> {
        return this.bestStreak;
    }

    /**
     *
     * @param postUID the new postUID to add to the post String of User
     * @returns void
     */
    public async addPost(postUID: ObjectId): Promise<void> {
        this.posts.push(postUID);
        const streak = await this.getCurrStreak();
        if (this.bestStreak < streak) {
            this.bestStreak = streak;
        }
        await this.writeToDatabase();
    }

    public async setName(newName: string) {
        this.name = newName;
        await this.writeToDatabase();
    }

    /**
     * 
     * @param postId the id of the post
     * @return the rating the user gave the post
     */
    public async getRatingForPost(postId: ObjectId): Promise<number> {
        return this.ratedPosts.get(postId) ?? 0;
    }

    public async setRatingForPost(postId: ObjectId, rating: number): Promise<void> {
        this.ratedPosts.set(postId, rating);
    }

    public async getRatedPosts(): Promise<Map<ObjectId, number>> {
        return this.ratedPosts;
    }

    /**
     * Converts the object into a form for the database
     * @returns a database entry
     */
    public toJson() {
        const { collectionName: _c, ...entry } = this;
        return {
            ...entry,
            posts: this.posts,
            wardrobe: this.wardrobe,
            bestStreak: this.bestStreak,
        };
    }
}
