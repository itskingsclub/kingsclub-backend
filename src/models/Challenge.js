// models/Challenge.js
const db = require('../config/db');

class Challenge {
    static async createChallenge(creator, challenge_status, amount, expiry_time, updated_by) {
        const [result] = await db.execute(
            'INSERT INTO challenges (creator, challenge_status, amount, expiry_time, updated_by, created_time, updated_time) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
            [creator, challenge_status, amount, expiry_time, updated_by]
        );

        return result.insertId;
    }

    static async getChallengeById(challengeId) {
        const [rows] = await db.execute('SELECT * FROM challenges WHERE id = ?', [challengeId]);
        return rows[0];
    }

    static async getAllChallenges() {
        const [rows] = await db.execute('SELECT * FROM challenges');
        return rows;
    }

    static async updateChallenge(challengeId, newData) {
        const { joiner, challenge_status, roomCode, amount, adminApproval, expiry_time, updated_by } = newData;
        const [result] = await db.execute(
            'UPDATE challenges SET joiner=?, challenge_status=?, room_code=?, amount=?, admin_approval=?, expiry_time=?, updated_by=?, updated_time=NOW() WHERE id=?',
            [joiner, challenge_status, roomCode, amount, adminApproval, expiry_time, updated_by, challengeId]
        );

        return result.affectedRows > 0;
    }

    static async deleteChallenge(challengeId) {
        const [result] = await db.execute('DELETE FROM challenges WHERE id=?', [challengeId]);
        return result.affectedRows > 0;
    }
}

module.exports = Challenge;
