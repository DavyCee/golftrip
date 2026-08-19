const PLAYER_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=0&single=true&output=csv';

const COURSE_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=672018571&single=true&output=csv';

const SETTINGS_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=659463649&single=true&output=csv';

const ROUND1_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=1161651500&single=true&output=csv';

const ROUND2_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=1161557451&single=true&output=csv';

const ROUND3_CSV =
'https://docs.google.com/spreadsheets/d/e/2PACX-1vSfjxQddO15BxkKKZYF9WFg-LcGJsPqaffUnR_W8g3T76h95n78ipqNoSPIHoqsO40LSaAW5NpVO9C3/pub?gid=1861478720&single=true&output=csv';

let settings = {};
let courseData = {};
let leaderboard = {};

async function loadSettings() {

    const response = await fetch(SETTINGS_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        settings[cols[0].trim()] = cols[1].trim();
    });

    if (settings['Event Name']) {
        document.querySelector('h1').textContent =
            `🏌️ ${settings['Event Name']}`;
    }
    
}
async function loadCourseData() {

    const response = await fetch(COURSE_CSV);
    const text = await response.text();

    const rows = text.split('\n');

    const headers = rows[0].split(',');

    const royal = headers[1].trim();
    const pinhal = headers[2].trim();
    const ocean = headers[3].trim();

    courseData[royal] = {};
    courseData[pinhal] = {};
    courseData[ocean] = {};

    rows.forEach(row => {

        const cols = row.split(',');

        const label = cols[0]?.trim();

        if (!label) return;

        if (label === 'Course Rating') {

            courseData[royal].rating = parseFloat(cols[1]);
            courseData[pinhal].rating = parseFloat(cols[2]);
            courseData[ocean].rating = parseFloat(cols[3]);

        }

        if (label === 'Slope Rating') {

            courseData[royal].slope = parseInt(cols[1]);
            courseData[pinhal].slope = parseInt(cols[2]);
            courseData[ocean].slope = parseInt(cols[3]);

        }

        if (label === 'Par') {

            courseData[royal].par = parseInt(cols[1]);
            courseData[pinhal].par = parseInt(cols[2]);
            courseData[ocean].par = parseInt(cols[3]);

        }

        if (label === 'Group 1 Tee Time') {

            courseData[royal].teeTimes = [
                cols[1]
            ];

            courseData[pinhal].teeTimes = [
                cols[2]
            ];

            courseData[ocean].teeTimes = [
                cols[3]
            ];

        }

        if (label === 'Group 2 Tee Time') {

            courseData[royal].teeTimes.push(cols[1]);
            courseData[pinhal].teeTimes.push(cols[2]);
            courseData[ocean].teeTimes.push(cols[3]);

        }

        if (label === 'Group 3 Tee Time') {

            courseData[royal].teeTimes.push(cols[1]);
            courseData[pinhal].teeTimes.push(cols[2]);
            courseData[ocean].teeTimes.push(cols[3]);

        }

    });

    console.log(courseData);
}

function renderSchedule() {

    const html = `

        <div class="schedule-row">
            <strong>Round 1</strong><br>
            ${settings['Round 1 Date']}<br>
            ${settings['Course 1 Name']}<br>
            ${courseData[settings['Course 1 Name']].teeTimes.join(' • ')}
        </div>

        <div class="schedule-row">
            <strong>Round 2</strong><br>
            ${settings['Round 2 Date']}<br>
            ${settings['Course 2 Name']}<br>
            ${courseData[settings['Course 2 Name']].teeTimes.join(' • ')}
        </div>

        <div class="schedule-row">
            <strong>Round 3</strong><br>
            ${settings['Round 3 Date']}<br>
            ${settings['Course 3 Name']}<br>
            ${courseData[settings['Course 3 Name']].teeTimes.join(' • ')}
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

function renderLeaderboard() {

    const players =
        Object.entries(leaderboard)
            .sort((a, b) => b[1].total - a[1].total);

    let html = '';

    let lastScore = null;
    let position = 0;

    players.forEach(([player, data], index) => {

        if (data.total !== lastScore) {
            position = index + 1;
            lastScore = data.total;
        }

        html += `
            <div class="leaderboard-row">
                ${position}. ${player}
                <br>
                R1: ${data.r1}
                |
                R2: ${data.r2}
                |
                R3: ${data.r3}
                |
                Total: ${data.total}
            </div>
        `;
    });

    document.getElementById('leaderboard').innerHTML = html;
}

async function loadHandicaps() {

    const response = await fetch(PLAYER_CSV);
    const text = await response.text();

    const rows = text.split('\n').slice(1);

    const selectedCourse =
        document.getElementById('courseSelect').value;

const slope =
    courseData[selectedCourse].slope;

    let html = `
    <div class="handicap-row">
        <strong class="handicap-name">Player</strong>
        <strong class="handicap-hi">HI</strong>
        <strong class="handicap-ch">CH</strong>
        <strong class="handicap-ph">PH</strong>
    </div>
`;

    rows.forEach(row => {

        if (!row.trim()) return;

        const cols = row.split(',');

        const player = cols[0];
        const hi = parseFloat(cols[1]);

       const allowance =
    parseFloat(settings['Stableford Allowance']) / 100;

const courseHandicap =
    Math.round((hi * slope) / 113);

const playingHandicap =
    Math.round(courseHandicap * allowance);

    html += `
    <div class="handicap-row">
        <div class="handicap-name">${player}</div>
        <div class="handicap-hi">${hi.toFixed(1)}</div>
        <div class="handicap-ch">${courseHandicap}</div>
        <div class="handicap-ph">${playingHandicap}</div>
    </div>
`;
    `;

    document.getElementById('handicapTable').innerHTML = html;
}

async function initialise() {

    await loadSettings();
    await loadCourseData();

    renderSchedule();

    loadPlayers();

    loadTeams();

    buildLeaderboard();

    loadHandicaps();

    document
        .getElementById('courseSelect')
        .addEventListener('change', loadHandicaps);
}

initialise();
