const PLAYER_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=0&single=true&output=csv';

const COURSE_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=672018571&single=true&output=csv';

function renderSchedule() {

    const html = `
        <div class="schedule-row">
            <strong>2 September</strong><br>
            Vale do Lobo Royal<br>
            09:30 • 09:40 • 09:50
        </div>

        <div class="schedule-row">
            <strong>3 September</strong><br>
            Pinhal<br>
            09:30 • 09:40 • 09:50
        </div>

        <div class="schedule-row">
            <strong>5 September</strong><br>
            Vale do Lobo Ocean<br>
            09:00 • 09:10 • 09:20
        </div>
    `;

    document.getElementById('schedule').innerHTML = html;
}

async function loadPlayers() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    let html = '';

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        const player = cols[0];
        const handicap = cols[1];
        const team = cols[2];

        html += `
            <div class="player">
                <strong>${player}</strong>
                | HI ${handicap}
                | ${team}
            </div>
        `;
    });

    async function loadTeams() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    let north = '';
    let south = '';

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        const player = cols[0];
        const team = cols[2];

        if (team === 'North') {
            north += `<div class="team-player">${player}</div>`;
        }

        if (team === 'South') {
            south += `<div class="team-player">${player}</div>`;
        }

    });

    document.getElementById('teams').innerHTML = `
        <div class="team-section">
            <div class="team-title">North</div>
            ${north}
        </div>

        <div class="team-section">
            <div class="team-title">South</div>
            ${south}
        </div>
    `;
}

    document.getElementById('players').innerHTML = html;
}

async function loadCourses() {

    const response = await fetch(COURSE_CSV);
    const text = await response.text();

    const rows = text.split('\n');

    const courseNames = [
        'Vale do Lobo Royal',
        'Pinhal',
        'Vale do Lobo Ocean'
    ];

    let html = '';

    courseNames.forEach(course => {
        html += `<div class="course">${course}</div>`;
    });

    document.getElementById('courses').innerHTML = html;
}

async function buildLeaderboard() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    let html = '';

    let position = 1;

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        const player = cols[0];

        html += `
            <div class="leaderboard-row">
                ${position}. ${player} - 0 pts
            </div>
        `;

        position++;
    });

    document.getElementById('leaderboard').innerHTML = html;
}

renderSchedule();
loadPlayers();
loadCourses();
loadTeams();
buildLeaderboard();
