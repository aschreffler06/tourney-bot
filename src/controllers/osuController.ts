import { DateTime } from 'luxon';
import { validateToken, getAccessToken } from '../db/token';
import axios from 'axios';
import Config from '../../config/config.json';
import { OsuUserInfo } from '../data_objects';

const endpoint = 'https://osu.ppy.sh/api/v2';

/**
 * Calls osu api to get the access token for the application's use. Also creates the time that it expires at
 * @returns A tuple where t[0] is the access token and t[1] is the time the token expires at in epoch seconds
 */
async function getNewAccessToken(): Promise<[number, string]> {
    const bodyParameters = {
        client_id: Config.osu.clientId,
        client_secret: Config.osu.clientSecret,
        grant_type: 'client_credentials',
        scope: 'public'
    };

    const response = await axios.post('https://osu.ppy.sh/oauth/token', bodyParameters);
    return [
        response.data.access_token,
        response.data.expires_in + Math.trunc(DateTime.utc().toSeconds())
    ];
}

/**
 * Gets a user based on a given name from the osu! api
 * @param name the name we want to search for
 * @returns A User object from the osu! api or null if there was an error
 */
async function getUserByName(name: string): Promise<OsuUserInfo> {
    const token = await getAccessToken();
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        const user = await axios.get(`${endpoint}/users/${name}/osu?key=username`, config);
        return new OsuUserInfo(
            user.data.id,
            name,
            user.data.statistics.global_rank,
            user.data.badges.length
        );
    } catch (err) {
        console.log(err);
        throw new Error('Error getting user');
    }
}

export { getNewAccessToken, getUserByName };
