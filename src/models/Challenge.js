// models/Challenge.js
const db = require('../config/db');

class Challenge {
    static async createChallenge(creator, amount) {
        const expiry = new Date(Date.now() + 60 * 60 * 1000);
        const [result] = await db.execute(
            'INSERT INTO challenge (creator, challenge_status, amount, expiry_time, updated_by, admin_approval, created_time, updated_time) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
            [creator, "Waiting", amount, expiry, creator, 0]
        );
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

    static async updateChallenge(req, res) {
        const time = new Date(Date.now());
        const { id, joiner, challenge_status, room_code, admin_approval, updated_by } = req.body;

        // Create an array to hold the SET clauses for the fields that are provided
        const setClauses = [];
        const values = [];

        if (joiner) {
            setClauses.push('joiner=?');
            values.push(joiner);
        }
        if (challenge_status !== undefined) {
            setClauses.push('challenge_status=?');
            values.push(challenge_status);
        }
        if (room_code !== undefined) {
            setClauses.push('room_code=?');
            values.push(room_code);
        }
        if (admin_approval !== undefined) {
            setClauses.push('admin_approval=?');
            values.push(admin_approval);
        }
        if (updated_by !== undefined) {
            setClauses.push('updated_by=?');
            values.push(updated_by);
        }

        // Join the setClauses array into a comma-separated string for the SET clause in the SQL query
        const setClause = setClauses.join(', ');
        values.push(time, id);

        const [result] = await db.execute(
            `UPDATE challenge SET ${setClause}, updated_time=? WHERE id=?`,
            values
        );

        return result.affectedRows > 0;
    }

    static async deleteChallenge(challengeId) {
        const [result] = await db.execute('DELETE FROM challenge WHERE id=?', [challengeId]);
        return result.affectedRows > 0;
    }
}

module.exports = Challenge;
