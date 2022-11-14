import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
const axios = require('axios');

async function getUser(name: String) {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxODYyOSIsImp0aSI6IjFlYzBhMjQyMGYwMzc4MTE0YjY0OWMwNjczYWQ3NmY4MTYxYWI0YmZkNDIwMzMxMzg4NDFkNGQ4MTE5NjUyNDZjODhmNzc5N2NmYjFkYmY0IiwiaWF0IjoxNjY4Mzk3NzM0LjIxOTIwOCwibmJmIjoxNjY4Mzk3NzM0LjIxOTIxMiwiZXhwIjoxNjY4NDgzMTk5LjkwNzg3Miwic3ViIjoiIiwic2NvcGVzIjpbInB1YmxpYyJdfQ.WvILaK95qZxLhggx9_pJowNJEo7iwA0u40-quLH3P-W8WZk42wYkO7HHxEh2Si6OdldtMvzD_wDOlg6DzfpMCaqsE44lRlfdomNxoV09CHU3WKxyhtUl5zFdqFiquFTuljmwkZFKmgoPUW1awfrPcrbyGj98xaODkhCKdJhwHx92xdYBg_q_NxzBwdu_JOGupquS9XzNwDXlHI0mSrWcGepAgxiDtVuDfje0_ruHZH-5NTgt6IAe9P5MSrokHeo1z4M4_r439K-8mHx_AfUxRyyl2NsC6kZ-po9-FXCIyfWAoMjCrp_lXLleWmMA9Qnfb8fceU1pEUvUIJyGesDDnB7Q7lDpwkrItFv2trtJdsYZOw4tYgIl6WwHogdsDbGabxl6ovFXRwVz1m2kbb3tWU-WAyXhS1YpUSSpUh9kOhjyZinVCQ2biuIROcFQdqtYj3W9j52vpSbyZOc5lgYsdnq7MDE4e04ehoar65CpXMp2KX3b9l-W26Y5U6cVKLYN_KZgqeiZWvFrOecG8AE0lawryBkiaSQJeBU1G9i7JtpAu9efGteEdo7vz8HDk9AIBVvw6zMP6WZIF9Y9-_kn-knax3whAylmf0IigWTIovL_XLShCN5nFAcRo4GlGiQ6xgBmUg7YlEjyXUzfcgRbbzOe9nWe2A5EecwuVy7_5E4'
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    };
    const response = await axios.get(`https://osu.ppy.sh/api/v2/users/${name}/osu?key=username`, config);
    return response.data.id;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your osu account with your name')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('Your osu! name')
                .setRequired(true)
        ),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const osuName = interaction.options.getString('name');
        const id = await getUser(osuName!);
        console.log(id)
    }
}