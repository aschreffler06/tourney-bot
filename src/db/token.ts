import { Token } from '../models/token';
import { DateTime } from 'luxon';
import { getAccessToken } from '../controllers/osuController';

/**
 * Makes sure that the token is up to date. If it's not, it will change the token
 * @returns The most up to date token
 */
async function validateToken(): Promise<string> {
    // There's only one access token at a time so we can just get the first one
    const token = await Token.findById(1).exec();
    if (token) {
        const accessToken = token.token;
        const expirationTime = token.expirationTime;
        if (accessToken && expirationTime) {
            // Check if token is expired
            if (expirationTime < DateTime.utc().toSeconds()) {
                const [accessToken, expirationTime] = await getAccessToken();
                await Token.updateOne(
                    { _id: 1 },
                    { token: accessToken, expirationTime: expirationTime }
                );
            }
            return accessToken;
        } else {
            console.log('Bad things in validate');
            return '';
        }
    } else {
        console.log('Bad things in validate');
        return '';
    }
}

export { validateToken };
