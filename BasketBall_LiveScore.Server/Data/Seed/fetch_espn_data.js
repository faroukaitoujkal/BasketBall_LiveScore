const fs = require('fs');
const path = require('path');

const SEED_DIR = __dirname;

async function fetchTeams() {
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams');
    const data = await res.json();
    fs.writeFileSync(path.join(SEED_DIR, 'teams.json'), JSON.stringify(data, null, 2));
    console.log('Saved teams.json');
    return data;
}

async function fetchRoster(teamId) {
    try {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${teamId}/roster`);
        if (!res.ok) return null;
        const data = await res.json();
        fs.writeFileSync(path.join(SEED_DIR, `roster_${teamId}.json`), JSON.stringify(data, null, 2));
        console.log(`Saved roster_${teamId}.json`);
    } catch (e) {
        console.error(`Failed to fetch roster for ${teamId}`, e);
    }
}

async function fetchScoreboard() {
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
    const data = await res.json();
    fs.writeFileSync(path.join(SEED_DIR, 'scoreboard.json'), JSON.stringify(data, null, 2));
    console.log('Saved scoreboard.json');
}

async function run() {
    console.log('Fetching teams...');
    const teamsData = await fetchTeams();
    const teams = teamsData.sports[0].leagues[0].teams;
    
    console.log('Fetching rosters...');
    for (const t of teams) {
        await fetchRoster(t.team.id);
        await new Promise(r => setTimeout(r, 200)); // small delay to not spam
    }
    
    console.log('Fetching scoreboard...');
    await fetchScoreboard();
    console.log('Done!');
}

run();
