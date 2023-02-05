import { Token } from '../models/token';
import { DateTime } from 'luxon';
const osu = require('../controllers/osuController');

/**
 * Makes sure that the token is up to date. If it's not, it will change the token
 * @returns The most up to date token
 */
async function validateToken(): Promise<string> {
    const token = await Token.findById(1).exec()
    if (token) {
        var access_token = token.token;
        const expirationTime = token.expirationTime;
        // Token is expired
        if (expirationTime! < DateTime.utc().toSeconds()) {
            const [accessToken, expirationTime] = await osu.getAccessToken();
            await Token.updateOne({ _id: 1, }, { token: accessToken, expirationTime: expirationTime });
        }
    } else {
        console.log('Bad things in validate');
    }
    return access_token!;
}

export { validateToken }