/**
 * A class to hold information about a user.
 */

export class OsuUserInfo {
    id: number;
    username: string;
    rank: number;
    badges: number;

    constructor(id = -1, username = '', rank = -1, badges = -1) {
        this.id = id;
        this.username = username;
        this.rank = rank;
        this.badges = badges;
    }
}
