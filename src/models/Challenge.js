// models/Challenge.js
const db = require('../config/db');

class Challenge {
    static async createChallenge(creator, amount) {
        const time = new Date(Date.now());
        const expiry = new Date(Date.now() + 60 * 60 * 1000);
        const [result] = await db.execute(
            'INSERT INTO challenge (creator, challenge_status, amount, expiry_time, updated_by, admin_approval, created_time, updated_time) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [creator, "Waiting", amount, expiry, creator, 0]
        );

        console.log("PV 2", result)

        return result.insertId;
    }

    static async getChallengeById(challengeId) {
        const [rows] = await db.execute('SELECT * FROM challenge WHERE id = ?', [challengeId]);
        return rows[0];
    }

    static async getAllChallenges() {
        const [rows] = await db.execute('SELECT * FROM challenge');
        return rows;
    }

    static async updateChallenge(challengeId, newData) {
        const { joiner, challenge_status, roomCode, amount, adminApproval, expiry_time, updated_by } = newData;
        const [result] = await db.execute(
            'UPDATE challenge SET joiner=?, challenge_status=?, room_code=?, amount=?, admin_approval=?, expiry_time=?, updated_by=?, updated_time=NOW() WHERE id=?',
            [joiner, challenge_status, roomCode, amount, adminApproval, expiry_time, updated_by, challengeId]
        );

        return result.affectedRows > 0;
    }

    static async deleteChallenge(challengeId) {
        const [result] = await db.execute('DELETE FROM challenge WHERE id=?', [challengeId]);
        return result.affectedRows > 0;
    }
}

module.exports = Challenge;
